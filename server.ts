import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// API Route: Ask Legal & Expat Questions with Google Search Grounding
app.post('/api/ask-legal', async (req: Request, res: Response) => {
  try {
    const { question, category } = req.body;

    if (!question || typeof question !== 'string' || question.trim().length === 0) {
      return res.status(400).json({ error: 'السؤال مطلوب' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'مفتاح Gemini API غير مهيأ على الخادم. يرجى ضبط GEMINI_API_KEY.',
      });
    }

    const categoryContext = category ? `المجال المستهدف: ${category}\n` : '';
    const userPrompt = `${categoryContext}سؤال المستخدم حول السويد:
"${question.trim()}"

يرجى تقديم إجابة شاملة، دقيقة، وموثقة باللغة العربية بناءً على القوانين واللوائح الرسمية المعتمدة في السويد لعام 2024-2026 من الجهات الحكومية السويدية الرسمية (مثل: Migrationsverket, Skatteverket, Försäkringskassan, Socialstyrelsen, Riksdagen, Skolverket).
وضح الحقوق والواجبات، الخطوات العملية، والأخطاء الشائعة التي يجب تجنبها.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: userPrompt,
      config: {
        systemInstruction: `أنت خبير ومستشار قانوني وإجرائي متخصص في النظام القانوني والخدمي في مملكة السويد، مع تركيز خاص على الجاليات والمغتربين المقيمين في السويد ومدينة ستوكهولم.
مهامك:
1. الإجابة بدقة باللغة العربية الفصحى الواضحة والمهنية.
2. ذكر المصطلحات السويدية الرسمية المقابلة بين قوسين (مثل: Uppehållstillstånd, SGI, Orosanmälan, Skälig hyra).
3. توثيق المعلومات دائماً بالرجوع للمواقع الحكومية السويدية المعتمدة ومواد القانون المعمول بها لعام 2024-2026.
4. تقديم خطوات عملية مباشرة وإرشادات لتفادي التعقيدات الإدارية.
5. التحلي بالواقعية والموضوعية التامة بعيداً عن التهويل أو الشائعات.`,
        tools: [{ googleSearch: {} }],
      },
    });

    const answerText = response.text || 'لم يتم استلام نص من النموذج.';

    // Extract grounding sources
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: { title: string; url: string }[] = [];

    for (const chunk of groundingChunks) {
      if (chunk.web?.uri) {
        sources.push({
          title: chunk.web.title || chunk.web.uri,
          url: chunk.web.uri,
        });
      }
    }

    // Deduplicate sources by URL
    const uniqueSources = sources.filter(
      (source, index, self) => index === self.findIndex((s) => s.url === source.url)
    );

    return res.json({
      answer: answerText,
      sources: uniqueSources,
      groundingSearchQueries: response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [],
    });
  } catch (error: any) {
    console.error('Error in /api/ask-legal:', error);
    return res.status(500).json({
      error: error?.message || 'حدث خطأ أثناء معالجة استشارتك القانونية. يرجى المحاولة لاحقاً.',
    });
  }
});

// Helper: Convert raw PCM 16-bit 24kHz buffer to WAV with 44-byte RIFF header
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  if (pcmBuffer.length >= 12 && pcmBuffer.toString('ascii', 0, 4) === 'RIFF' && pcmBuffer.toString('ascii', 8, 12) === 'WAVE') {
    return pcmBuffer; // Already a valid WAV file
  }
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16); // SubChunk1Size (16 for PCM)
  header.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

// Convert PCM to 64k mono MP3 via ffmpeg, fallback to WAV
function pcmToMp3(pcmBuffer: Buffer, sampleRate = 24000): { buffer: Buffer; format: 'mp3' | 'wav' } {
  try {
    const { spawnSync } = require('child_process');
    const res = spawnSync('ffmpeg', [
      '-f', 's16le',
      '-ar', sampleRate.toString(),
      '-ac', '1',
      '-i', 'pipe:0',
      '-b:a', '64k',
      '-f', 'mp3',
      'pipe:1',
    ], { input: pcmBuffer });

    if (res.status === 0 && res.stdout && res.stdout.length > 0) {
      return { buffer: Buffer.from(res.stdout), format: 'mp3' };
    }
  } catch (err) {
    console.warn('ffmpeg conversion failed, falling back to WAV:', err);
  }

  // Fallback to WAV container
  return { buffer: pcmToWav(pcmBuffer, sampleRate, 1, 16), format: 'wav' };
}

// Ensure permanent audio directory exists
const AUDIO_DIR = path.resolve(process.cwd(), 'public/audio');
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// Serve static /audio directory directly via Express
app.use('/audio', express.static(AUDIO_DIR));
app.use('/audio', (_req, res) => {
  res.status(404).json({ error: 'Audio file not found' });
});

// Helper: Standardized filenames for podcast audio files
function getAudioFilePaths(episodeId: string | number, segmentIndex: number, episodeNumber?: number) {
  let num = episodeNumber;
  if (!num) {
    const match = String(episodeId).match(/\d+/);
    num = match ? parseInt(match[0], 10) : 1;
  }
  const baseName = `ep${num}-${segmentIndex}`;
  return {
    baseName,
    mp3Name: `${baseName}.mp3`,
    wavName: `${baseName}.wav`,
    mp3Path: path.join(AUDIO_DIR, `${baseName}.mp3`),
    wavPath: path.join(AUDIO_DIR, `${baseName}.wav`),
    relMp3Url: `/audio/${baseName}.mp3`,
    relWavUrl: `/audio/${baseName}.wav`,
  };
}

// Segment lock map to prevent duplicate parallel requests for the same segment
const segmentLocks = new Map<string, Promise<{ audioUrl: string; format: string }>>();

// Core generator with 429 exponential backoff retry
async function generateAudioCore(
  formattedPrompt: string,
  multiSpeakerConfig: any,
  cleanText: string,
  isHost: boolean,
  hostVoice: string,
  guestVoice: string
): Promise<Buffer> {
  const maxRetries = 3;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      let rawAudioBase64: string | undefined;

      // 1. Primary Model: gemini-2.5-flash-preview-tts
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-preview-tts',
          contents: [{ role: 'user', parts: [{ text: formattedPrompt }] }],
          config: multiSpeakerConfig,
        });
        rawAudioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      } catch (primaryErr: any) {
        console.warn('Primary model gemini-2.5-flash-preview-tts failed, trying fallback:', primaryErr?.message || primaryErr);
      }

      // 2. Fallback Model: gemini-2.5-pro-preview-tts
      if (!rawAudioBase64) {
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro-preview-tts',
            contents: [{ role: 'user', parts: [{ text: formattedPrompt }] }],
            config: multiSpeakerConfig,
          });
          rawAudioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        } catch (proErr: any) {
          console.warn('Fallback model gemini-2.5-pro-preview-tts failed:', proErr?.message || proErr);
        }
      }

      // 3. Fallback: single-speaker voiceConfig without multiSpeaker wrapper
      if (!rawAudioBase64) {
        const activeVoice = isHost ? hostVoice : guestVoice;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-preview-tts',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `اقرأ الحوار التالي بعربية فصحى واضحة، بنبرة بودكاست دافئة وهادئة وسرعة معتدلة:\n${cleanText}`,
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: activeVoice },
              },
            },
          },
        });
        rawAudioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      }

      if (!rawAudioBase64) {
        throw new Error('لم يرجع النموذج بيانات صوتية صالحة.');
      }

      return Buffer.from(rawAudioBase64, 'base64');
    } catch (err: any) {
      attempt++;
      const errMsg = err?.message || '';
      const is429 = errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota');

      if (is429 && attempt <= maxRetries) {
        // Respect retryDelay if specified in the API error
        let waitMs = Math.pow(2, attempt) * 2500; // 5s, 10s, 20s
        const match = errMsg.match(/retryDelay[:\s]+(\d+)/i) || errMsg.match(/after\s+(\d+)\s+second/i);
        if (match && match[1]) {
          waitMs = (parseInt(match[1], 10) + 1) * 1000;
        }
        console.warn(`[TTS 429 Limit] Waiting ${waitMs}ms before attempt ${attempt + 1}/${maxRetries}...`);
        await new Promise((resolve) => setTimeout(resolve, waitMs));
        continue;
      }
      throw err;
    }
  }

  throw new Error('تم تجاوز الحصة المؤقتة لتوليد الصوت (429).');
}

// API Route: Generate or retrieve static Podcast Speech using Gemini TTS
app.post('/api/podcast-tts', async (req: Request, res: Response) => {
  try {
    const { episodeId, episodeNumber, segmentIndex, text, role, guestGender } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({ error: 'نص المقطع الصوتي مطلوب' });
    }

    const segIdx = segmentIndex !== undefined ? parseInt(segmentIndex, 10) : 0;
    const paths = getAudioFilePaths(episodeId || 'ep1', segIdx, episodeNumber);

    // 1. Check permanent disk cache first
    if (fs.existsSync(paths.mp3Path)) {
      return res.json({
        audioUrl: paths.relMp3Url,
        format: 'mp3',
        cached: true,
      });
    }
    if (fs.existsSync(paths.wavPath)) {
      return res.json({
        audioUrl: paths.relWavUrl,
        format: 'wav',
        cached: true,
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'مفتاح Gemini API غير مهيأ على الخادم.',
      });
    }

    // 2. Prevent duplicate parallel requests using segment lock
    if (segmentLocks.has(paths.baseName)) {
      const lockedResult = await segmentLocks.get(paths.baseName)!;
      return res.json({
        ...lockedResult,
        cached: true,
      });
    }

    const cleanText = text.trim();
    const isHost = role === 'host';
    const hostVoice = 'Charon';
    const guestVoice = guestGender === 'female' ? 'Kore' : 'Puck';
    const targetSpeaker = isHost ? 'Host' : 'Guest';

    const formattedPrompt = `اقرأ الحوار التالي بعربية فصحى واضحة، بنبرة بودكاست دافئة وهادئة وسرعة معتدلة:\n${targetSpeaker}: ${cleanText}`;

    const multiSpeakerConfig = {
      responseModalities: ['AUDIO'],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            {
              speaker: 'Host',
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: hostVoice },
              },
            },
            {
              speaker: 'Guest',
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: guestVoice },
              },
            },
          ],
        },
      },
    };

    // Create execution lock
    const generationPromise = (async () => {
      const rawPcmBuffer = await generateAudioCore(
        formattedPrompt,
        multiSpeakerConfig,
        cleanText,
        isHost,
        hostVoice,
        guestVoice
      );

      // Convert to MP3 (64kbps mono) or fallback to WAV
      const { buffer, format } = pcmToMp3(rawPcmBuffer, 24000);
      const targetFilePath = format === 'mp3' ? paths.mp3Path : paths.wavPath;
      const targetRelUrl = format === 'mp3' ? paths.relMp3Url : paths.relWavUrl;

      // Save permanently to public/audio disk
      fs.writeFileSync(targetFilePath, buffer);

      // Also create an alias with full episodeId if different
      if (episodeId && String(episodeId) !== `ep${episodeNumber}`) {
        const aliasPath = path.join(AUDIO_DIR, `ep${episodeId}-${segIdx}.${format}`);
        try {
          fs.writeFileSync(aliasPath, buffer);
        } catch {}
      }

      return {
        audioUrl: targetRelUrl,
        format,
      };
    })();

    segmentLocks.set(paths.baseName, generationPromise);

    const result = await generationPromise;
    segmentLocks.delete(paths.baseName);

    return res.json({
      audioUrl: result.audioUrl,
      format: result.format,
      cached: false,
    });
  } catch (error: any) {
    // Ensure lock is cleared on failure
    const segIdx = req.body?.segmentIndex !== undefined ? parseInt(req.body.segmentIndex, 10) : 0;
    const paths = getAudioFilePaths(req.body?.episodeId || 'ep1', segIdx, req.body?.episodeNumber);
    segmentLocks.delete(paths.baseName);

    console.error('Error in /api/podcast-tts:', error);
    const rawMsg = error?.message || (typeof error === 'string' ? error : JSON.stringify(error));
    let friendlyMessage = 'هذه الحلقة قيد التحضير الصوتي، يمكنك قراءة النص الكامل أدناه.';
    if (rawMsg.includes('API key') || rawMsg.includes('GEMINI_API_KEY')) {
      friendlyMessage = 'مفتاح Gemini API غير متوفر أو غير صالح على الخادم.';
    } else if (rawMsg.includes('quota') || rawMsg.includes('RESOURCE_EXHAUSTED') || rawMsg.includes('429')) {
      friendlyMessage = 'هذه الحلقة قيد التحضير الصوتي، يمكنك قراءة النص الكامل أدناه.';
    }

    return res.status(500).json({
      error: friendlyMessage,
    });
  }
});

// Admin Authentication Middleware
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';

function requireAdmin(req: Request, res: Response, next: express.NextFunction) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'غير مصرح: يرجى إدخال رمز الإدارة الصحيح (ADMIN_TOKEN).' });
  }
  next();
}

// Admin API: Scan audio files status on disk
app.get('/api/admin/audio-status', requireAdmin, (_req: Request, res: Response) => {
  try {
    const files = fs.readdirSync(AUDIO_DIR);
    const audioFiles = files
      .filter((f: string) => f.endsWith('.mp3') || f.endsWith('.wav'))
      .map((f: string) => {
        const stats = fs.statSync(path.join(AUDIO_DIR, f));
        return {
          fileName: f,
          sizeBytes: stats.size,
          mtime: stats.mtime,
          url: `/audio/${f}`,
        };
      });

    return res.json({
      totalFiles: audioFiles.length,
      files: audioFiles,
      audioDir: AUDIO_DIR,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || 'فشل فحص مجلد الصوتيات.' });
  }
});

// Admin API: Generate a specific segment (batch controller calls this)
app.post('/api/admin/generate-segment', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { episodeId, episodeNumber, segmentIndex, text, role, guestGender, overwrite } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'النص مطلوب' });
    }

    const segIdx = segmentIndex !== undefined ? parseInt(segmentIndex, 10) : 0;
    const paths = getAudioFilePaths(episodeId || 'ep1', segIdx, episodeNumber);

    // If file exists and not overwriting, return existing
    if (!overwrite && fs.existsSync(paths.mp3Path)) {
      const stats = fs.statSync(paths.mp3Path);
      return res.json({
        success: true,
        fileName: paths.mp3Name,
        audioUrl: paths.relMp3Url,
        sizeBytes: stats.size,
        alreadyExisted: true,
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'مفتاح Gemini API غير مهيأ على الخادم.' });
    }

    const cleanText = text.trim();
    const isHost = role === 'host';
    const hostVoice = 'Charon';
    const guestVoice = guestGender === 'female' ? 'Kore' : 'Puck';
    const targetSpeaker = isHost ? 'Host' : 'Guest';

    const formattedPrompt = `اقرأ الحوار التالي بعربية فصحى واضحة، بنبرة بودكاست دافئة وهادئة وسرعة معتدلة:\n${targetSpeaker}: ${cleanText}`;

    const multiSpeakerConfig = {
      responseModalities: ['AUDIO'],
      speechConfig: {
        multiSpeakerVoiceConfig: {
          speakerVoiceConfigs: [
            { speaker: 'Host', voiceConfig: { prebuiltVoiceConfig: { voiceName: hostVoice } } },
            { speaker: 'Guest', voiceConfig: { prebuiltVoiceConfig: { voiceName: guestVoice } } },
          ],
        },
      },
    };

    const rawPcm = await generateAudioCore(
      formattedPrompt,
      multiSpeakerConfig,
      cleanText,
      isHost,
      hostVoice,
      guestVoice
    );

    const { buffer, format } = pcmToMp3(rawPcm, 24000);
    const targetFilePath = format === 'mp3' ? paths.mp3Path : paths.wavPath;
    const targetRelUrl = format === 'mp3' ? paths.relMp3Url : paths.relWavUrl;

    fs.writeFileSync(targetFilePath, buffer);

    const stats = fs.statSync(targetFilePath);
    return res.json({
      success: true,
      fileName: format === 'mp3' ? paths.mp3Name : paths.wavName,
      audioUrl: targetRelUrl,
      sizeBytes: stats.size,
      alreadyExisted: false,
    });
  } catch (error: any) {
    console.error('Error generating segment in admin:', error);
    const is429 = error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
    return res.status(is429 ? 429 : 500).json({
      error: error?.message || 'فشل توليد المقطع.',
      is429,
    });
  }
});

// Admin API: Download all podcast audio files as a ZIP archive
app.get('/api/admin/download-all-audio', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const AdmZip = (await import('adm-zip')).default;
    const zip = new AdmZip();

    if (fs.existsSync(AUDIO_DIR)) {
      const files = fs.readdirSync(AUDIO_DIR);
      for (const file of files) {
        if (file.endsWith('.mp3') || file.endsWith('.wav')) {
          const filePath = path.join(AUDIO_DIR, file);
          zip.addLocalFile(filePath);
        }
      }
    }

    const zipBuffer = zip.toBuffer();
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="podcast-audio-stockholm.zip"');
    res.setHeader('Content-Length', zipBuffer.length.toString());
    return res.send(zipBuffer);
  } catch (error: any) {
    console.error('Error creating ZIP archive:', error);
    return res.status(500).json({ error: error?.message || 'فشل إنشاء ملف الـ ZIP.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve production build
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // Vite middleware mode in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
