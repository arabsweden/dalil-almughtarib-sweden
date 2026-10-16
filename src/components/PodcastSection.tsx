import React, { useState, useEffect, useRef } from 'react';
import { PODCAST_EPISODES, PodcastEpisode, PodcastDialogue } from '../data/podcastData';
import { 
  Play, Pause, RotateCcw, Volume2, VolumeX, FastForward, 
  Mic, Radio, Sparkles, MessageSquare, CheckCircle2, User, UserCheck, 
  Share2, Check, Headphones, Clock, RefreshCw, AlertCircle
} from 'lucide-react';

export const PodcastSection: React.FC = () => {
  const [selectedEpisode, setSelectedEpisode] = useState<PodcastEpisode>(PODCAST_EPISODES[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeDialogueIndex, setActiveDialogueIndex] = useState<number>(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'dialogue' | 'takeaways' | 'guest'>('dialogue');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isLoadingAudio, setIsLoadingAudio] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Audio element and cache refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCacheRef = useRef<Map<string, string>>(new Map());
  const isPlayingRef = useRef<boolean>(false);
  isPlayingRef.current = isPlaying;

  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // When selected episode changes, stop audio and reset
  useEffect(() => {
    stopPlayback();
    setActiveDialogueIndex(0);
    setErrorMessage(null);
  }, [selectedEpisode.id]);

  // Update playback speed if audio is currently playing
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsLoadingAudio(false);
  };

  // Helper: Check if a static audio file exists on the server
  const checkStaticAudioExists = async (url: string): Promise<boolean> => {
    try {
      const res = await fetch(url, { method: 'HEAD' });
      const contentType = res.headers.get('content-type') || '';
      return res.ok && !contentType.includes('text/html');
    } catch {
      return false;
    }
  };

  // Fetch or retrieve from cache / static disk file
  const fetchSegmentAudioUrl = async (episode: PodcastEpisode, index: number): Promise<string> => {
    const cacheKey = `${episode.id}_seg_${index}`;
    if (audioCacheRef.current.has(cacheKey)) {
      return audioCacheRef.current.get(cacheKey)!;
    }

    // 1. Try static files first: /audio/ep{number}-{index}.mp3, then .wav, then /audio/ep{id}-{index}.mp3
    const staticCandidates = [
      `/audio/ep${episode.number}-${index}.mp3`,
      `/audio/ep${episode.number}-${index}.wav`,
      `/audio/ep${episode.id}-${index}.mp3`,
    ];

    for (const candidate of staticCandidates) {
      const exists = await checkStaticAudioExists(candidate);
      if (exists) {
        audioCacheRef.current.set(cacheKey, candidate);
        return candidate;
      }
    }

    // 2. Only if no static file exists on disk, call /api/podcast-tts
    const segment = episode.dialogue[index];
    const res = await fetch('/api/podcast-tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        episodeId: episode.id,
        episodeNumber: episode.number,
        segmentIndex: index,
        text: segment.text,
        role: segment.role,
        guestGender: episode.guestGender,
        speaker: segment.speaker,
      }),
    });

    if (!res.ok) {
      throw new Error('هذه الحلقة قيد التحضير الصوتي، يمكنك قراءة النص الكامل أدناه');
    }

    const data = await res.json();
    if (!data.audioUrl && !data.audioBase64) {
      throw new Error('هذه الحلقة قيد التحضير الصوتي، يمكنك قراءة النص الكامل أدناه');
    }

    const audioUrl = data.audioUrl || `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
    audioCacheRef.current.set(cacheKey, audioUrl);
    return audioUrl;
  };

  // Preload ONLY static files for visitors - NEVER call /api/podcast-tts in preloading
  const preloadNextSegment = (episode: PodcastEpisode, currentIndex: number) => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < episode.dialogue.length) {
      const staticCandidate = `/audio/ep${episode.number}-${nextIndex}.mp3`;
      checkStaticAudioExists(staticCandidate).then((exists) => {
        if (exists) {
          const pre = new Audio();
          pre.src = staticCandidate;
          pre.preload = 'auto';
        }
      }).catch(() => {});
    }
  };

  const playSegment = async (index: number, episode = selectedEpisode) => {
    if (index >= episode.dialogue.length) {
      setIsPlaying(false);
      setActiveDialogueIndex(0);
      return;
    }

    setActiveDialogueIndex(index);
    setIsLoadingAudio(true);
    setErrorMessage(null);

    try {
      const audioUrl = await fetchSegmentAudioUrl(episode, index);

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      const audio = audioRef.current;
      audio.src = audioUrl;
      audio.playbackRate = playbackSpeed;

      audio.onended = () => {
        if (isPlayingRef.current) {
          playSegment(index + 1, episode);
        }
      };

      audio.onerror = () => {
        setIsLoadingAudio(false);
        setIsPlaying(false);
        setErrorMessage('هذه الحلقة قيد التحضير الصوتي، يمكنك قراءة النص الكامل أدناه');
      };

      await audio.play();
      setIsLoadingAudio(false);
      setIsPlaying(true);

      // Preload next segment ONLY if static file is already on disk
      preloadNextSegment(episode, index);
    } catch (err: any) {
      console.warn('Playback note:', err);
      setIsLoadingAudio(false);
      setIsPlaying(false);
      setErrorMessage('هذه الحلقة قيد التحضير الصوتي، يمكنك قراءة النص الكامل أدناه');
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
    } else {
      if (audioRef.current && audioRef.current.src && !audioRef.current.ended) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(() => {
          playSegment(activeDialogueIndex);
        });
      } else {
        playSegment(activeDialogueIndex);
      }
    }
  };

  const jumpToSegment = (index: number) => {
    playSegment(index);
  };

  const handleRestart = () => {
    playSegment(0);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const changeSpeed = () => {
    const speeds = [1, 1.25, 1.5];
    const nextSpeed = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    setPlaybackSpeed(nextSpeed);
  };

  const currentSegment = selectedEpisode.dialogue[activeDialogueIndex] || selectedEpisode.dialogue[0];
  const coverImg = selectedEpisode.coverImage || '/src/assets/images/podcast_sweden_cover_1792141747815.jpg';

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden" id="podcast-section">
      {/* Top Header of Podcast Section */}
      <div className="p-6 md:p-8 border-b border-stone-100 bg-[#FBF9F5]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
              <Radio className="w-4 h-4 text-amber-700" />
              <span>بودكاست حوارات صدى السويد</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 font-mono text-emerald-800">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Gemini Studio TTS (صوت طبيعي فائق الجودة)
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900 font-['Cairo',sans-serif]">
              حوارات الأسرة، الهوية، والاندماج في ستوكهولم
            </h2>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              جلسات حوارية معمقة بصوت نقي متقن عبر تقنية Gemini TTS من Google AI Studio؛ أصوات طبيعية متمايزة بين المحاور والضيف مع نص الحوار الكامل والتوجيهات العملية.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'تم نسخ الرابط' : 'مشاركة البودكاست'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Player & Interactive Dialogue (Left Column) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Player Card */}
            <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                {/* Cover Art */}
                <div className="sm:col-span-4 relative aspect-square rounded-xl overflow-hidden bg-stone-800 border border-stone-700">
                  <img
                    src={coverImg}
                    alt={selectedEpisode.titleAr}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center">
                      <div className="flex items-end gap-1 h-8">
                        <span className="w-1 bg-amber-400 animate-pulse h-4" />
                        <span className="w-1 bg-amber-400 animate-pulse h-8" />
                        <span className="w-1 bg-amber-400 animate-pulse h-6" />
                        <span className="w-1 bg-amber-400 animate-pulse h-7" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Details & Controls */}
                <div className="sm:col-span-8 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
                      <span>الحلقة {selectedEpisode.number}</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedEpisode.durationMinutes} دقيقة</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-400">Gemini TTS</span>
                    </div>
                    <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
                      {selectedEpisode.titleAr}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
                      الضيف: <strong className="text-stone-200">{selectedEpisode.guestName}</strong>
                    </p>
                  </div>

                  {/* Player Controls Bar */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={togglePlay}
                          disabled={isLoadingAudio}
                          className="w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 disabled:bg-stone-700 text-stone-950 flex items-center justify-center transition-all shadow-md cursor-pointer shrink-0"
                          aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل الحوار الصوتي'}
                        >
                          {isLoadingAudio ? (
                            <RefreshCw className="w-5 h-5 animate-spin text-stone-900" />
                          ) : isPlaying ? (
                            <Pause className="w-5 h-5 fill-current" />
                          ) : (
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          )}
                        </button>

                        <div>
                          <span className="text-xs font-semibold block text-white">
                            {isLoadingAudio
                              ? 'جارٍ توليد الصوت الطبيعي عبر Gemini TTS...'
                              : isPlaying
                              ? 'جاري الاستماع للحوار بصوت الاستوديو...'
                              : 'استمع للحوار بصوت Gemini الطبيعي'}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">
                            المقطع {activeDialogueIndex + 1} من {selectedEpisode.dialogue.length} · {currentSegment?.speaker}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={changeSpeed}
                          className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-mono text-xs font-bold"
                          title="سرعة التشغيل"
                        >
                          {playbackSpeed}x
                        </button>
                        <button
                          type="button"
                          onClick={handleRestart}
                          className="p-2 text-stone-400 hover:text-white"
                          title="إعادة من البداية"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar of Segments */}
                    <div className="flex gap-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                      {selectedEpisode.dialogue.map((_, idx) => (
                        <div
                          key={idx}
                          onClick={() => jumpToSegment(idx)}
                          className={`flex-1 transition-all cursor-pointer ${
                            idx === activeDialogueIndex
                              ? 'bg-amber-400'
                              : idx < activeDialogueIndex
                              ? 'bg-amber-600/70'
                              : 'bg-stone-700 hover:bg-stone-600'
                          }`}
                          title={`مقطع ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Calm notice if audio is being prepared */}
            {errorMessage && (
              <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-xl text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Headphones className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('dialogue')}
                  className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-amber-950 font-semibold text-[11px] hover:bg-amber-100 transition-colors shrink-0 cursor-pointer text-center"
                >
                  قراءة النص الكامل للحوار
                </button>
              </div>
            )}

            {/* Tabs for Selected Episode */}
            <div className="border-b border-stone-200 flex gap-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('dialogue')}
                className={`pb-2.5 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'dialogue'
                    ? 'text-amber-900 border-b-2 border-amber-900 font-bold'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>نص الحوار الصوتي الكامل ({selectedEpisode.dialogue.length} مقطعاً)</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('takeaways')}
                className={`pb-2.5 transition-colors flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'takeaways'
                    ? 'text-amber-900 border-b-2 border-amber-900 font-bold'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>الخلاصة والتوجيهات العملية</span>
              </button>
            </div>

            {/* Tab 1: Full Dialogue Transcript with click to play */}
            {activeTab === 'dialogue' && (
              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                <div className="text-[11px] text-stone-500 bg-[#FBF9F5] p-2.5 rounded-lg border border-stone-200 flex items-center justify-between">
                  <span>💡 <strong>ملاحظة:</strong> اضغط على أي مقطع لبدء استماعه مباشرة بصوت Gemini TTS النقي.</span>
                  <span className="font-mono text-emerald-800 font-semibold">صوت استوديو طبيعي</span>
                </div>

                {selectedEpisode.dialogue.map((item, idx) => {
                  const isActive = idx === activeDialogueIndex;
                  const isHost = item.role === 'host';

                  return (
                    <div
                      key={idx}
                      onClick={() => jumpToSegment(idx)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isActive
                          ? 'border-amber-900 bg-amber-50/70 shadow-xs ring-1 ring-amber-900/20'
                          : 'border-stone-200/80 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isHost ? 'bg-stone-900 text-white' : 'bg-amber-800 text-white'
                          }`}>
                            {isHost ? 'م' : 'ض'}
                          </div>
                          <span className="text-xs font-bold text-stone-900">
                            {item.speaker}
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono">
                            {isHost ? '(صوت المقدم Charon)' : `(صوت الضيف ${selectedEpisode.guestGender === 'female' ? 'Kore' : 'Puck'})`}
                          </span>
                        </div>
                        {isActive && (
                          <span className="text-[10px] font-bold text-amber-900 flex items-center gap-1 font-mono">
                            <Headphones className="w-3 h-3 text-amber-800" />
                            <span>المقطع قيد التشغيل</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-700 leading-relaxed pr-8">
                        {item.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab 2: Key Takeaways */}
            {activeTab === 'takeaways' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-stone-900">
                  أهم ما جاء في حوار الحلقة:
                </h4>
                <div className="space-y-2.5">
                  {selectedEpisode.keyTakeaways.map((point, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3.5 bg-[#FBF9F5] rounded-xl border border-stone-200 text-xs text-stone-800 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-amber-800 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Episode Selector Catalog (Right Column - All 8 Episodes) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-900 font-['Cairo',sans-serif]">
                حلقات البودكاست المتاحة
              </h3>
              <span className="text-xs text-stone-500 font-mono font-bold text-amber-900">
                {PODCAST_EPISODES.length} حلقات كاملة
              </span>
            </div>

            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {PODCAST_EPISODES.map((ep) => {
                const isSelected = ep.id === selectedEpisode.id;

                return (
                  <div
                    key={ep.id}
                    onClick={() => setSelectedEpisode(ep)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex gap-3 items-start ${
                      isSelected
                        ? 'border-amber-900 bg-amber-50/50 shadow-xs ring-1 ring-amber-900/20'
                        : 'border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-stone-100 border border-stone-200">
                      <img
                        src={ep.coverImage || '/src/assets/images/podcast_sweden_cover_1792141747815.jpg'}
                        alt={ep.titleAr}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[10px] text-stone-500 mb-0.5 font-mono">
                        <span className="font-bold text-amber-950">الحلقة {ep.number}</span>
                        <span>{ep.durationMinutes} دقيقة</span>
                      </div>

                      <h4 className="text-xs font-bold text-stone-900 leading-snug mb-1 line-clamp-2">
                        {ep.titleAr}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-100">
                        <span className="truncate">الضيف: <strong>{ep.guestName}</strong></span>
                        <span className="text-amber-900 font-bold shrink-0">
                          {isSelected ? 'محددة' : 'استمع ←'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Guest Spotlight Card */}
            <div className="bg-[#FBF9F5] p-4 rounded-xl border border-stone-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                <UserCheck className="w-4 h-4 text-amber-700" />
                <span>عن ضيف الحلقة الحالية</span>
              </div>
              <div className="text-xs text-stone-800 font-bold">
                {selectedEpisode.guestName} ({selectedEpisode.guestGender === 'female' ? 'ضيفة' : 'ضيف'})
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                {selectedEpisode.guestRole}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
