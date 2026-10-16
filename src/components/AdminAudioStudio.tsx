import React, { useState, useEffect, useRef } from 'react';
import { PODCAST_EPISODES, PodcastEpisode, PodcastDialogue } from '../data/podcastData';
import {
  Mic, Play, Pause, RefreshCw, Download, CheckCircle2, AlertTriangle,
  Clock, ShieldAlert, KeyRound, ArrowRight, Eye, Volume2, Database,
  Sliders, Square, Check, X, FileAudio, Sparkles
} from 'lucide-react';

interface AudioFileStatus {
  fileName: string;
  sizeBytes: number;
  mtime: string;
  url: string;
}

interface SegmentStatus {
  episodeId: string;
  episodeNumber: number;
  episodeTitle: string;
  segmentIndex: number;
  speaker: string;
  role: 'host' | 'guest';
  guestGender: 'male' | 'female';
  text: string;
  expectedFileName: string;
  isReady: boolean;
  sizeBytes?: number;
  url?: string;
  isGenerating?: boolean;
  error?: string;
}

export const AdminAudioStudio: React.FC<{ onCloseAdmin?: () => void }> = ({ onCloseAdmin }) => {
  const [token, setToken] = useState<string>(() => {
    return sessionStorage.getItem('admin_podcast_token') || '';
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [existingFiles, setExistingFiles] = useState<AudioFileStatus[]>([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [selectedEpisodeFilter, setSelectedEpisodeFilter] = useState<number | 'all'>('all');

  // Batch generation state
  const [delaySeconds, setDelaySeconds] = useState<number>(7);
  const [isBatchRunning, setIsBatchRunning] = useState<boolean>(false);
  const [isBatchPaused, setIsBatchPaused] = useState<boolean>(false);
  const [batchProgress, setBatchProgress] = useState<{ current: number; total: number; message: string }>({
    current: 0,
    total: 0,
    message: '',
  });
  const [pauseCountdown, setPauseCountdown] = useState<number | null>(null);

  // Audio preview playback
  const [previewPlayingKey, setPreviewPlayingKey] = useState<string | null>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);

  // Cancellation and pause refs for running loop
  const cancelBatchRef = useRef<boolean>(false);
  const isPausedRef = useRef<boolean>(false);
  isPausedRef.current = isBatchPaused;

  // Build flat list of all segments across all 8 episodes
  const allSegments: SegmentStatus[] = React.useMemo(() => {
    const list: SegmentStatus[] = [];
    const fileMap = new Map<string, AudioFileStatus>();
    existingFiles.forEach((f) => fileMap.set(f.fileName, f));

    PODCAST_EPISODES.forEach((ep) => {
      ep.dialogue.forEach((dia, idx) => {
        const mp3Name = `ep${ep.number}-${idx}.mp3`;
        const wavName = `ep${ep.number}-${idx}.wav`;
        const match = fileMap.get(mp3Name) || fileMap.get(wavName);

        list.push({
          episodeId: ep.id,
          episodeNumber: ep.number,
          episodeTitle: ep.titleAr,
          segmentIndex: idx,
          speaker: dia.speaker,
          role: dia.role,
          guestGender: ep.guestGender,
          text: dia.text,
          expectedFileName: mp3Name,
          isReady: !!match,
          sizeBytes: match?.sizeBytes,
          url: match?.url,
        });
      });
    });

    return list;
  }, [existingFiles]);

  const readyCount = allSegments.filter((s) => s.isReady).length;
  const missingCount = allSegments.length - readyCount;
  const completionPercent = allSegments.length > 0 ? Math.round((readyCount / allSegments.length) * 100) : 0;

  // Check auth and load files
  const loadAudioStatus = async (userToken = token) => {
    setIsLoadingStatus(true);
    setAuthError(null);

    try {
      const res = await fetch('/api/admin/audio-status', {
        headers: {
          'x-admin-token': userToken,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          setIsAuthenticated(false);
          setAuthError('رمز الدخول غير صحيح. يرجى إدخال ADMIN_TOKEN الصحيح.');
          return;
        }
        throw new Error('فشل فحص حالة الصوتيات.');
      }

      const data = await res.json();
      setExistingFiles(data.files || []);
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_podcast_token', userToken);
    } catch (err: any) {
      setAuthError(err?.message || 'حدث خطأ أثناء الاتصال بالخادم.');
      setIsAuthenticated(false);
    } finally {
      setIsLoadingStatus(false);
    }
  };

  useEffect(() => {
    loadAudioStatus(token);
  }, []);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadAudioStatus(token);
  };

  const handlePlayPreview = (url: string, key: string) => {
    if (!audioPreviewRef.current) {
      audioPreviewRef.current = new Audio();
    }
    const audio = audioPreviewRef.current;

    if (previewPlayingKey === key) {
      audio.pause();
      setPreviewPlayingKey(null);
      return;
    }

    audio.src = url;
    audio.play();
    setPreviewPlayingKey(key);

    audio.onended = () => {
      setPreviewPlayingKey(null);
    };
    audio.onerror = () => {
      setPreviewPlayingKey(null);
    };
  };

  // Generate single segment
  const generateSingleSegment = async (seg: SegmentStatus, overwrite = true): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/generate-segment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify({
          episodeId: seg.episodeId,
          episodeNumber: seg.episodeNumber,
          segmentIndex: seg.segmentIndex,
          text: seg.text,
          role: seg.role,
          guestGender: seg.guestGender,
          overwrite,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 429 || data.is429) {
          throw new Error('429_RATE_LIMIT');
        }
        throw new Error(data.error || 'فشل التوليد');
      }

      const data = await res.json();
      // Update local file list
      setExistingFiles((prev) => {
        const filtered = prev.filter((f) => f.fileName !== data.fileName);
        return [
          ...filtered,
          {
            fileName: data.fileName,
            sizeBytes: data.sizeBytes,
            mtime: new Date().toISOString(),
            url: data.audioUrl,
          },
        ];
      });

      return true;
    } catch (err: any) {
      throw err;
    }
  };

  // Batch generation loop (strictly sequential with delay & 429 auto-pause)
  const startBatchGeneration = async () => {
    const missingSegments = allSegments.filter((s) => !s.isReady);
    if (missingSegments.length === 0) {
      alert('جميع المقاطع مكتملة وموجودة على القرص!');
      return;
    }

    setIsBatchRunning(true);
    setIsBatchPaused(false);
    cancelBatchRef.current = false;

    setBatchProgress({
      current: 0,
      total: missingSegments.length,
      message: 'بدء التوليد المتسلسل...',
    });

    for (let i = 0; i < missingSegments.length; i++) {
      if (cancelBatchRef.current) {
        setBatchProgress((prev) => ({ ...prev, message: 'تم إلغاء التوليد من قِبل المستخدم.' }));
        break;
      }

      // Check if paused
      while (isPausedRef.current && !cancelBatchRef.current) {
        setBatchProgress((prev) => ({ ...prev, message: 'التوليد متوقف مؤقتاً...' }));
        await new Promise((r) => setTimeout(r, 1000));
      }

      if (cancelBatchRef.current) break;

      const seg = missingSegments[i];
      setBatchProgress({
        current: i + 1,
        total: missingSegments.length,
        message: `جاري توليد حلقة ${seg.episodeNumber} - مقطع ${seg.segmentIndex + 1} (${seg.speaker})...`,
      });

      let success = false;
      let attempts = 0;

      while (!success && attempts < 3 && !cancelBatchRef.current) {
        try {
          attempts++;
          await generateSingleSegment(seg, false);
          success = true;
        } catch (err: any) {
          if (err?.message === '429_RATE_LIMIT') {
            // Auto pause for 20 seconds on 429
            setBatchProgress((prev) => ({
              ...prev,
              message: `تم الوصول لحد الحصة (429). جاري التوقف والانتظار التلقائي لمدة 20 ثانية...`,
            }));

            for (let c = 20; c > 0; c--) {
              if (cancelBatchRef.current) break;
              setPauseCountdown(c);
              await new Promise((r) => setTimeout(r, 1000));
            }
            setPauseCountdown(null);
          } else {
            console.error('Error in segment, skipping after retry:', err);
            break;
          }
        }
      }

      // Inter-request delay (defaults to 7s) to protect Gemini quota
      if (i < missingSegments.length - 1 && !cancelBatchRef.current) {
        setBatchProgress((prev) => ({
          ...prev,
          message: `اكتمل المقطع بنجاح. انتظار ${delaySeconds} ثوانٍ لحماية الحصة...`,
        }));
        await new Promise((r) => setTimeout(r, delaySeconds * 1000));
      }
    }

    setIsBatchRunning(false);
    setIsBatchPaused(false);
    setPauseCountdown(null);
    setBatchProgress((prev) => ({
      ...prev,
      message: 'اكتملت عملية المعالجة.',
    }));
    await loadAudioStatus();
  };

  const stopBatchGeneration = () => {
    cancelBatchRef.current = true;
    setIsBatchRunning(false);
    setIsBatchPaused(false);
  };

  const togglePauseBatch = () => {
    setIsBatchPaused(!isBatchPaused);
  };

  // Filtered segments for display table
  const displayedSegments = selectedEpisodeFilter === 'all'
    ? allSegments
    : allSegments.filter((s) => s.episodeNumber === selectedEpisodeFilter);

  return (
    <div className="bg-stone-900 text-stone-100 min-h-screen p-4 sm:p-8 font-['Cairo',sans-serif]">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <span>استوديو الصوتيات الإداري</span>
                <span aria-hidden="true">·</span>
                <span>Gemini Studio TTS Batch Engine</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                إدارة وتوليد الملفات الصوتية الثابتة للبودكاست
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onCloseAdmin && (
              <button
                type="button"
                onClick={onCloseAdmin}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-xs font-semibold rounded-lg text-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
                <span>العودة للموقع الرئيسي</span>
              </button>
            )}
          </div>
        </div>

        {/* Authentication Form if not logged in */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto my-12 bg-stone-800/90 border border-stone-700 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <KeyRound className="w-6 h-6" />
              <h2 className="text-lg font-bold">تسجيل دخول المشرف</h2>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              هذه اللوحة مخصصة لإدارة وتوليد ملفات البودكاست الثابتة لحمايتها من استهلاك حصة الـ API. أدخل رمز الإدارة (<code className="text-amber-300 font-mono">ADMIN_TOKEN</code>).
            </p>

            <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  رمز الإدارة (ADMIN_TOKEN):
                </label>
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="أدخل رمز ADMIN_TOKEN..."
                  className="w-full px-3.5 py-2.5 bg-stone-900 border border-stone-700 rounded-lg text-sm text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              {authError && (
                <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-lg text-xs text-rose-300 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoadingStatus}
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 text-stone-950 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoadingStatus ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                <span>دخول لوحة الصوتيات</span>
              </button>
            </form>
          </div>
        ) : (
          /* Main Admin Workspace */
          <div className="space-y-6">
            {/* Overview Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-4 space-y-1">
                <span className="text-xs text-stone-400 font-medium">إجمالي الحلقات والمقاطع</span>
                <div className="text-2xl font-extrabold text-white font-mono">
                  8 حلقات <span className="text-sm font-normal text-stone-400">({allSegments.length} مقطعاً)</span>
                </div>
              </div>

              <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-4 space-y-1">
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>المقاطع الجاهزة على القرص</span>
                </span>
                <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                  {readyCount} <span className="text-xs text-stone-400 font-normal">/ {allSegments.length}</span>
                </div>
              </div>

              <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-4 space-y-1">
                <span className="text-xs text-amber-400 font-medium flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>المقاطع الناقصة</span>
                </span>
                <div className="text-2xl font-extrabold text-amber-400 font-mono">
                  {missingCount}
                </div>
              </div>

              <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-4 space-y-1">
                <span className="text-xs text-stone-400 font-medium">نسبة الجاهزية</span>
                <div className="text-2xl font-extrabold text-white font-mono flex items-center justify-between">
                  <span>{completionPercent}%</span>
                  <div className="w-16 h-2 bg-stone-700 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${completionPercent}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar & Batch Controller */}
            <div className="bg-stone-800/90 border border-stone-700 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-400" />
                    <span>لوحة التحكم بالتوليد الدفعي (Batch Controller)</span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    توليد متسلسل آمن واحد تلو الآخر مع تأخير قابل للضبط لتفادي خطأ تجاوز الحصة (429) نهائياً.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Delay config */}
                  <div className="flex items-center gap-2 bg-stone-900 border border-stone-700 px-3 py-1.5 rounded-lg text-xs">
                    <span className="text-stone-400">الانتظار بين كل مقطع:</span>
                    <input
                      type="number"
                      min={3}
                      max={30}
                      value={delaySeconds}
                      disabled={isBatchRunning}
                      onChange={(e) => setDelaySeconds(parseInt(e.target.value, 10) || 7)}
                      className="w-12 bg-stone-800 text-white font-mono text-center rounded px-1 py-0.5"
                    />
                    <span className="text-stone-400">ثوانٍ</span>
                  </div>

                  {/* Batch Trigger Buttons */}
                  {!isBatchRunning ? (
                    <button
                      type="button"
                      onClick={startBatchGeneration}
                      disabled={missingCount === 0}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-stone-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>توليد المقاطع الناقصة ({missingCount})</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={togglePauseBatch}
                        className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        {isBatchPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                        <span>{isBatchPaused ? 'استئناف' : 'إيقاف مؤقت'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={stopBatchGeneration}
                        className="px-3 py-2 bg-rose-700 hover:bg-rose-600 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Square className="w-4 h-4" />
                        <span>إلغاء</span>
                      </button>
                    </div>
                  )}

                  {/* Download All as ZIP */}
                  <a
                    href={`/api/admin/download-all-audio?token=${encodeURIComponent(token)}`}
                    download="podcast-audio-stockholm.zip"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>تنزيل كل الملفات كـ ZIP ({readyCount} ملف)</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => loadAudioStatus(token)}
                    disabled={isLoadingStatus}
                    className="p-2 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded-lg cursor-pointer"
                    title="تحديث الحالة"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingStatus ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Live Batch Progress Bar */}
              {isBatchRunning && (
                <div className="p-4 bg-stone-950/70 border border-stone-700 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-400">
                      {batchProgress.message}
                    </span>
                    <span className="font-mono text-stone-300">
                      {batchProgress.current} من {batchProgress.total}
                    </span>
                  </div>

                  {pauseCountdown !== null && (
                    <div className="text-xs text-amber-300 bg-amber-950/60 p-2 rounded border border-amber-800 flex items-center gap-2">
                      <Clock className="w-4 h-4 animate-spin text-amber-400" />
                      <span>توقف مؤقت تلقائي بسبب حد الـ API: متبقي {pauseCountdown} ثانية...</span>
                    </div>
                  )}

                  <div className="w-full h-2 bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{
                        width: `${batchProgress.total > 0 ? (batchProgress.current / batchProgress.total) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Filter by Episode */}
            <div className="flex flex-wrap items-center gap-2 border-b border-stone-800 pb-3">
              <span className="text-xs font-bold text-stone-400 ml-2">فلترة الحلقات:</span>
              <button
                type="button"
                onClick={() => setSelectedEpisodeFilter('all')}
                className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedEpisodeFilter === 'all'
                    ? 'bg-amber-500 text-stone-950'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                كافة الحلقات (8)
              </button>
              {PODCAST_EPISODES.map((ep) => (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => setSelectedEpisodeFilter(ep.number)}
                  className={`px-3 py-1 text-xs rounded-lg font-semibold transition-colors cursor-pointer ${
                    selectedEpisodeFilter === ep.number
                      ? 'bg-amber-500 text-stone-950'
                      : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                  }`}
                >
                  الحلقة {ep.number}
                </button>
              ))}
            </div>

            {/* Segments Table */}
            <div className="bg-stone-800/60 border border-stone-700 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead className="bg-stone-900/90 text-stone-400 border-b border-stone-700">
                    <tr>
                      <th className="p-3">الحلقة</th>
                      <th className="p-3">المقطع</th>
                      <th className="p-3">اسم الملف</th>
                      <th className="p-3">المتحدث</th>
                      <th className="p-3">نص الحوار</th>
                      <th className="p-3">الحجم / الحالة</th>
                      <th className="p-3 text-center">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-700/60">
                    {displayedSegments.map((seg) => {
                      const isReady = seg.isReady;
                      const sizeKb = seg.sizeBytes ? Math.round(seg.sizeBytes / 1024) : 0;
                      const previewKey = `${seg.episodeId}_${seg.segmentIndex}`;
                      const isPlayingThis = previewPlayingKey === previewKey;

                      return (
                        <tr
                          key={`${seg.episodeId}-${seg.segmentIndex}`}
                          className={`hover:bg-stone-800/90 transition-colors ${
                            !isReady ? 'bg-stone-900/40' : ''
                          }`}
                        >
                          <td className="p-3 font-bold text-stone-300 whitespace-nowrap">
                            حلقة {seg.episodeNumber}
                          </td>
                          <td className="p-3 font-mono text-stone-400 whitespace-nowrap">
                            #{seg.segmentIndex + 1}
                          </td>
                          <td className="p-3 font-mono text-stone-300 text-[11px] whitespace-nowrap">
                            {seg.expectedFileName}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                seg.role === 'host'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}
                            >
                              {seg.speaker}
                            </span>
                          </td>
                          <td className="p-3 max-w-md text-stone-300 leading-relaxed line-clamp-2">
                            {seg.text}
                          </td>
                          <td className="p-3 whitespace-nowrap">
                            {isReady ? (
                              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>جاهز ({sizeKb} KB)</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-stone-400 text-[11px]">
                                <Clock className="w-3.5 h-3.5" />
                                <span>ناقص (غير مولّد)</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              {isReady && seg.url && (
                                <button
                                  type="button"
                                  onClick={() => handlePlayPreview(seg.url!, previewKey)}
                                  className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                    isPlayingThis
                                      ? 'bg-amber-500 text-stone-950 border-amber-500'
                                      : 'bg-stone-700 hover:bg-stone-600 text-stone-200 border-stone-600'
                                  }`}
                                  title={isPlayingThis ? 'إيقاف' : 'استماع'}
                                >
                                  {isPlayingThis ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => generateSingleSegment(seg, true)}
                                className="px-2 py-1 bg-stone-700 hover:bg-stone-600 text-[11px] font-semibold text-stone-200 rounded border border-stone-600 cursor-pointer"
                                title="توليد أو إعادة توليد هذا المقطع"
                              >
                                {isReady ? 'إعادة توليد' : 'توليد الآن'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
