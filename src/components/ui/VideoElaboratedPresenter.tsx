import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Volume2, VolumeX, Sparkles, Award, Briefcase, GraduationCap, Code2, ShieldCheck, RotateCcw } from 'lucide-react'
import { audioEngine } from '../../utils/audio'

interface TimeSyncedPhrase {
  start: number
  end: number
  phrase: string
  elaborationTitle: string
  elaborationBadge: string
  highlights: string[]
  icon: any
}

const VIDEO_TIMELINE: TimeSyncedPhrase[] = [
  {
    start: 0.0,
    end: 1.8,
    phrase: "Hi, I'm Saanya.",
    elaborationTitle: 'Saanya Garg · Computer Science Engineer',
    elaborationBadge: 'VIT BHOPAL · CGPA 9.19',
    highlights: [
      'B.Tech CSE at Vellore Institute of Technology (2023–2027)',
      'Top tier academic standing with consistent 9.19 / 10.0 CGPA',
      'Specializing in Data Structures, Cloud Architecture & AI Systems',
    ],
    icon: GraduationCap,
  },
  {
    start: 1.8,
    end: 3.2,
    phrase: "I'm a full-stack developer.",
    elaborationTitle: '3 Industry Internships & Architecture',
    elaborationBadge: 'PRODUCTION FULL-STACK',
    highlights: [
      'AmasQIS.ai: Built banking apps & REST microservices with Node.js',
      'UPTOSKILLS (AICTE): Optimized rendering, cutting load time by 35%',
      'Codveda Technologies: Atomic React design, cut redundancy by 25%',
    ],
    icon: Briefcase,
  },
  {
    start: 3.2,
    end: 4.5,
    phrase: 'I build responsive web applications,',
    elaborationTitle: 'High-Impact Web Engineering',
    elaborationBadge: 'PERFORMANCE & SCALE',
    highlights: [
      'Modern responsive layouts with accessibility and cross-device fluidity',
      'Automated CI/CD pipelines via GitHub Actions for zero-downtime releases',
      'Enterprise state management and API response caching for swift UX',
    ],
    icon: Code2,
  },
  {
    start: 4.5,
    end: 5.8,
    phrase: 'interactive websites,',
    elaborationTitle: 'Social Impact & Flagship Platforms',
    elaborationBadge: 'INTERACTIVE PLATFORMS',
    highlights: [
      'SaathiCircle: AI elder care with instant emergency SOS telemetry',
      'LaadliBachao: Survivor support reducing response effort by 45%',
      'Garg Associates: Legaltech portal boosting lawyer matching by 40%',
    ],
    icon: Sparkles,
  },
  {
    start: 5.8,
    end: 7.5,
    phrase: 'and AI powered platforms.',
    elaborationTitle: 'Dual AWS Certified & Hackathon Winner',
    elaborationBadge: 'AWS AI & HACKATHONS',
    highlights: [
      'Dual AWS Certified: AI Practitioner & Solutions Architect',
      '3rd Place · MP Police Hackathon among 300+ competitive teams',
      'Top 0.5% · Samsung Solve for Tomorrow out of 20,000+ teams',
    ],
    icon: ShieldCheck,
  },
]

// Extended deep dive chapters from the resume
const RESUME_CHAPTERS = [
  {
    id: 'intro',
    title: 'Profile & Education',
    icon: GraduationCap,
    badge: 'VIT BHOPAL 9.19',
    summary: 'B.Tech in Computer Science & Engineering with 9.19 CGPA. Passionate about AI, full-stack systems, and high-impact social software.',
    details: [
      'Institution: Vellore Institute of Technology, Bhopal (2023 - 2027)',
      'Degree: B.Tech Computer Science and Engineering',
      'Core focus: Data Structures, Distributed Systems, Cloud Architecture',
    ],
  },
  {
    id: 'internships',
    title: '3 Industry Internships',
    icon: Briefcase,
    badge: 'FINTECH & ENTERPRISE',
    summary: 'Proven track record in FinTech microservices, performance engineering, and modular design components.',
    details: [
      'AmasQIS.ai (May - Oct 2025): Banking applications, Node.js microservices & CI/CD',
      'UPTOSKILLS AICTE (Feb - May 2025): Optimized assets, slashed page load time by 35%',
      'Codveda (Feb - Mar 2025): Reusable React architecture, slashed dev redundancy by 25%',
    ],
  },
  {
    id: 'projects',
    title: 'Flagship Projects',
    icon: Code2,
    badge: 'REACT · NODE · AI',
    summary: 'Production-ready web applications solving healthcare, social safety, and legal services challenges.',
    details: [
      'SaathiCircle: AI senior care with emergency SOS dispatch & multilingual voice assistance',
      'LaadliBachao: Incident reporting platform reducing manual emergency response by 45%',
      'Garg Associates: Legal services client portal with 40% matching improvement',
    ],
  },
  {
    id: 'hackathons',
    title: 'Hackathons & Honors',
    icon: Award,
    badge: '3RD / 300+ TEAMS',
    summary: 'Ranked in the top echelon in competitive state and national developer hackathons.',
    details: [
      'MP Police Cyber Safety Hackathon: 3rd Place Winner among 300+ teams',
      'Samsung Solve for Tomorrow: Top 100 Ideation Round (Top 0.5% of 20,000+)',
      'Epsilon Texpedition Hackathon 2026: Elite Top 10 National Finalist',
      'Flipkart GRiD 8.0: National Semifinalist in flagship technical challenge',
    ],
  },
  {
    id: 'certs',
    title: 'AWS Certifications & Tech',
    icon: ShieldCheck,
    badge: 'DUAL AWS CERTIFIED',
    summary: 'Cloud architecture credentials and production mastery in React, Node, Docker, and Python.',
    details: [
      'AWS Certified AI Practitioner (Amazon Web Services)',
      'AWS Certified Solutions Architect (Amazon Web Services)',
      'Stanford University: Machine Learning Specialization (Coursera)',
      'Meta: Back-End Development | Microsoft: Full-Stack Coding',
    ],
  },
]

export default function VideoElaboratedPresenter({
  onExploreFullPortfolio,
}: {
  onExploreFullPortfolio?: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(7.2)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)
  const [showChapterDrawer, setShowChapterDrawer] = useState(false)

  // Track video playback time and coordinate background music ducking
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const cur = videoRef.current.currentTime
      setCurrentTime(cur)
      if (videoRef.current.duration) {
        setDuration(videoRef.current.duration)
      }

      // Dynamic Background Music Ducking during key technical explanations
      if (!isMuted && isPlaying) {
        if (cur >= 1.8 && cur <= 5.8) {
          audioEngine.duckCorporateMusic(0.035) // Duck to 3.5% for vocal clarity
        } else {
          audioEngine.restoreCorporateMusic(0.09) // Restore warm ambient piano
        }
      }
    }
  }

  // Handle Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
      audioEngine.stopCorporateMusic()
    } else {
      videoRef.current.play().catch(() => {})
      setIsPlaying(true)
      if (!isMuted) {
        audioEngine.startCorporateMusic(0.09)
      }
    }
  }

  // Handle Mute/Unmute
  const toggleMute = () => {
    if (!videoRef.current) return
    const nextMuted = !isMuted
    videoRef.current.muted = nextMuted
    setIsMuted(nextMuted)

    if (nextMuted) {
      audioEngine.stopCorporateMusic()
    } else {
      if (isPlaying) {
        audioEngine.startCorporateMusic(0.09)
      }
    }
  }

  const handleReplay = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    videoRef.current.play().catch(() => {})
    setIsPlaying(true)
    if (!isMuted) {
      audioEngine.startCorporateMusic(0.09)
    }
  }

  // Find active phrase synced with video time
  const activeSyncedPhrase = VIDEO_TIMELINE.find(
    (item) => currentTime >= item.start && currentTime < item.end
  ) || VIDEO_TIMELINE[0]

  const selectChapter = (index: number) => {
    setActiveChapterIndex(index)
    setShowChapterDrawer(true)
  }

  const activeChapter = RESUME_CHAPTERS[activeChapterIndex]

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopCorporateMusic()
    }
  }, [])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        width: '100%',
        maxWidth: 560,
      }}
    >
      {/* Top Status Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '8px 14px',
          borderRadius: 12,
          border: '1px solid rgba(56, 189, 248, 0.25)',
          backdropFilter: 'blur(16px)',
          flexWrap: 'wrap',
          gap: 6,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px #22c55e',
              animation: 'cursor-blink 1.4s ease-in-out infinite',
            }}
          />
          <span style={{ fontSize: 11.5, color: '#ffffff', fontWeight: 700, letterSpacing: '0.04em', fontFamily: '"Space Grotesk", sans-serif' }}>
            Saanya Garg · Introduction Video
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9.5, color: '#38bdf8', fontWeight: 700, letterSpacing: '0.08em', fontFamily: '"Space Grotesk", sans-serif' }}>
            {isMuted ? 'MUTED' : 'VOICE + AMBIENT PIANO ACTIVE'}
          </span>
        </div>
      </div>

      {/* Main Video Viewport: 16:9 Aspect Ratio with No Cropping! */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: 16,
          overflow: 'hidden',
          background: '#ffffff',
          border: '1.5px solid rgba(56, 189, 248, 0.35)',
          boxShadow: '0 20px 50px rgba(0,0,0,0.65), 0 0 35px rgba(56, 189, 248, 0.15)',
        }}
      >
        <video
          ref={videoRef}
          src="/intro.mp4"
          autoPlay
          muted={isMuted}
          loop
          playsInline
          onTimeUpdate={handleTimeUpdate}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'center',
            display: 'block',
            background: '#ffffff',
          }}
        />

        {/* Tap to Unmute Overlay Prompt (if muted) */}
        {isMuted && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={toggleMute}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '10px 18px',
              borderRadius: 30,
              background: 'rgba(10, 15, 29, 0.85)',
              border: '1.5px solid rgba(56, 189, 248, 0.5)',
              color: '#38bdf8',
              fontFamily: '"Space Grotesk", sans-serif',
              fontSize: 12,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(12px)',
              zIndex: 15,
            }}
          >
            <Volume2 size={16} /> Tap to Hear Voice & Music
          </motion.button>
        )}

        {/* Video Controls Bar (Bottom Overlay, Touch Friendly) */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '8px 12px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 70%, transparent 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          {/* Progress bar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: 'rgba(255,255,255,0.2)',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${(currentTime / duration) * 100}%`,
                background: 'linear-gradient(90deg, #38bdf8, #818cf8)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>

          {/* Left: Play/Pause, Replay & Live Spoken Sentence */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause introduction video' : 'Play introduction video'}
              style={{
                minWidth: 36,
                minHeight: 36,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)',
                border: '1px solid rgba(255,255,255,0.3)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} />}
            </button>

            <button
              onClick={handleReplay}
              aria-label="Replay video"
              style={{
                minWidth: 32,
                minHeight: 32,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={12} />
            </button>

            <span
              style={{
                color: '#ffffff',
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 'clamp(10px, 1.1vw, 12px)',
                fontWeight: 600,
                textShadow: '0 1px 3px rgba(0,0,0,0.9)',
                background: 'rgba(0,0,0,0.5)',
                padding: '2px 8px',
                borderRadius: 6,
                maxWidth: 'min(240px, 45vw)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              "{activeSyncedPhrase.phrase}"
            </span>
          </div>

          {/* Right: Audio Volume Button */}
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
            style={{
              minWidth: 36,
              minHeight: 36,
              borderRadius: '50%',
              background: isMuted ? 'rgba(244,63,94,0.3)' : 'rgba(56,189,248,0.3)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
          </button>
        </div>

        {/* Live Synchronized Badge Top-Left */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(10, 15, 29, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            borderRadius: 20,
            padding: '3px 10px',
            backdropFilter: 'blur(8px)',
            zIndex: 10,
          }}
        >
          <span style={{ fontSize: 9.5, color: '#38bdf8', fontWeight: 700, letterSpacing: '0.06em' }}>
            {activeSyncedPhrase.elaborationBadge}
          </span>
        </div>
      </div>

      {/* Synchronized Real-time Resume Elaboration Card (Expands on speech!) */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSyncedPhrase.phrase}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          style={{
            background: 'rgba(15, 23, 42, 0.85)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: 14,
            padding: '12px 16px',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 24,
                  height: 24,
                  borderRadius: 6,
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                }}
              >
                <activeSyncedPhrase.icon size={13} />
              </span>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 12.5, color: '#fff' }}>
                {activeSyncedPhrase.elaborationTitle}
              </span>
            </div>
            <span style={{ fontSize: 9.5, color: '#94a3b8', fontFamily: '"Space Grotesk", sans-serif' }}>
              Speaking now
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {activeSyncedPhrase.highlights.map((h, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 6,
                  fontSize: 11.5,
                  color: 'rgba(255,255,255,0.85)',
                  fontFamily: '"Space Grotesk", sans-serif',
                  lineHeight: 1.4,
                }}
              >
                <span style={{ color: '#38bdf8', marginTop: 1 }}>•</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Chapter Pills: Explore Full Resume in Sync */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: '"Space Grotesk", sans-serif', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>
            Explore Resume Chapters
          </span>
          <span style={{ fontSize: 9.5, color: '#38bdf8' }}>Click to expand</span>
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2, WebkitOverflowScrolling: 'touch' }}>
          {RESUME_CHAPTERS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => selectChapter(idx)}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '7px 12px',
                borderRadius: 8,
                background: activeChapterIndex === idx && showChapterDrawer
                  ? 'rgba(56, 189, 248, 0.22)'
                  : 'rgba(255,255,255,0.05)',
                border: activeChapterIndex === idx && showChapterDrawer
                  ? '1px solid #38bdf8'
                  : '1px solid rgba(255,255,255,0.1)',
                color: activeChapterIndex === idx && showChapterDrawer ? '#38bdf8' : 'rgba(255,255,255,0.7)',
                fontSize: 11,
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <ch.icon size={12} />
              {ch.title}
            </button>
          ))}
        </div>
      </div>

      {/* Detailed Resume Chapter Modal / Drawer when clicked */}
      <AnimatePresence>
        {showChapterDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(10, 15, 30, 0.95)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: 14,
              padding: '14px 18px',
              backdropFilter: 'blur(24px)',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ color: '#38bdf8', fontWeight: 700, fontSize: 13, fontFamily: '"Space Grotesk", sans-serif' }}>
                  {activeChapter.title}
                </span>
                <span
                  style={{
                    padding: '2px 7px',
                    borderRadius: 12,
                    background: 'rgba(56, 189, 248, 0.15)',
                    color: '#38bdf8',
                    fontSize: 9.5,
                    fontWeight: 700,
                  }}
                >
                  {activeChapter.badge}
                </span>
              </div>
              <button
                onClick={() => setShowChapterDrawer(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                ✕ Close
              </button>
            </div>

            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', margin: '0 0 10px', lineHeight: 1.45, fontFamily: '"Space Grotesk", sans-serif' }}>
              {activeChapter.summary}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {activeChapter.details.map((d, i) => (
                <div key={i} style={{ fontSize: 11.5, color: '#cbd5e1', display: 'flex', gap: 6, lineHeight: 1.4 }}>
                  <span style={{ color: '#38bdf8' }}>✓</span>
                  <span>{d}</span>
                </div>
              ))}
            </div>

            {onExploreFullPortfolio && (
              <button
                onClick={onExploreFullPortfolio}
                style={{
                  marginTop: 10,
                  width: '100%',
                  padding: '7px 12px',
                  borderRadius: 8,
                  border: '1px solid rgba(56, 189, 248, 0.35)',
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: '#38bdf8',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  transition: 'all 0.2s ease',
                }}
              >
                <span>Read Full Resume & Credentials</span>
                <span>→</span>
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
