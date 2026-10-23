import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ExternalLink, X, ChevronRight } from 'lucide-react'

interface Props {
  onChapterChange: (ch: number) => void
}

const PROJECTS = [
  {
    id: 'saathi',
    index: 'A',
    title: 'SaathiCircle',
    subtitle: 'AI-Powered Senior Care Platform',
    tagline: 'Technology designed to help older adults access support more easily.',
    problem: 'Elderly individuals often struggle to access timely care and support, especially in emergencies or when language barriers exist.',
    tech: ['React.js', 'Node.js', 'REST APIs', 'MongoDB', 'Firebase'],
    features: [
      'SOS emergency alerts',
      'Voice assistance integration',
      'Multilingual support',
      'Mood tracking dashboard',
      'Caregiver connection panels',
      'Firebase authentication',
    ],
    link: 'https://tinyurl.com/SaathiCircle',
    contribution: 'Full-stack development — designed and built the React frontend, Node.js backend, MongoDB data layer, and Firebase auth integration.',
    accent: '#d4956a',
    accentDim: 'rgba(212,149,106,0.1)',
    theme: 'warm',
    visual: {
      bg: 'radial-gradient(ellipse at 30% 50%, rgba(212,149,106,0.08) 0%, transparent 60%)',
      icon: '🌅',
    },
  },
  {
    id: 'laadli',
    index: 'B',
    title: 'LaadliBachao',
    subtitle: 'Female Foeticide Prevention Platform',
    tagline: 'Technology supporting awareness, prevention, and access to help.',
    problem: 'Female foeticide remains a critical social challenge. Access to reporting mechanisms and survivor support resources is often limited.',
    tech: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'REST APIs'],
    features: [
      'Awareness and survivor-support functionality',
      'Real-time alert mechanisms',
      'Response workflows',
      'Backend services and database integration',
    ],
    metric: '45% reduction in manual response effort reported.',
    link: 'https://tinyurl.com/LaadliBachao',
    contribution: 'Built the full application stack — REST API design, Express.js backend, MongoDB schemas, and React-based frontend.',
    accent: '#4ecdc4',
    accentDim: 'rgba(78,205,196,0.08)',
    theme: 'hopeful',
    visual: {
      bg: 'radial-gradient(ellipse at 70% 30%, rgba(78,205,196,0.08) 0%, transparent 60%)',
      icon: '🌸',
    },
  },
  {
    id: 'garg',
    index: 'C',
    title: 'Garg Associates',
    subtitle: 'Legal Services Platform',
    tagline: 'Improving the accessibility and organization of legal services.',
    problem: 'Legal services can be hard to navigate. Clients need clear information, search capability, and an efficient way to connect with attorneys.',
    tech: ['HTML', 'CSS', 'JavaScript', 'Node.js', 'MongoDB'],
    features: [
      'Responsive web experience',
      'Legal-services information presentation',
      'Search and filtering functionality',
      'Backend and database integration',
    ],
    metric: '40% improvement in client-attorney matching accuracy reported.',
    link: 'https://tinyurl.com/GargAssociates',
    contribution: 'Designed and developed the full platform — HTML/CSS/JS frontend, Node.js backend, and MongoDB integration.',
    accent: '#c8c4bc',
    accentDim: 'rgba(200,196,188,0.06)',
    theme: 'editorial',
    visual: {
      bg: 'radial-gradient(ellipse at 50% 80%, rgba(200,196,188,0.06) 0%, transparent 60%)',
      icon: '⚖️',
    },
  },
]

function ProjectCard({ project, index, onOpen }: { project: typeof PROJECTS[0], index: number, onOpen: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.15, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
      style={{
        background: project.visual.bg,
        border: `1px solid ${hovered ? project.accent + '50' : 'rgba(255,255,255,0.06)'}`,
        padding: '48px 40px',
        cursor: 'none',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-4px)' : 'none',
      }}
    >
      {/* Project index */}
      <div style={{
        position: 'absolute',
        top: 24,
        right: 32,
        fontFamily: 'Syne, sans-serif',
        fontSize: 80,
        fontWeight: 800,
        color: 'rgba(255,255,255,0.03)',
        lineHeight: 1,
        userSelect: 'none',
      }}>
        {project.index}
      </div>

      {/* Visual accent line */}
      <motion.div
        animate={{ width: hovered ? '100%' : 40 }}
        transition={{ duration: 0.4 }}
        style={{
          height: 1,
          background: `linear-gradient(90deg, ${project.accent}, transparent)`,
          marginBottom: 32,
        }}
      />

      {/* Emoji icon */}
      <div style={{ fontSize: 32, marginBottom: 20 }}>{project.visual.icon}</div>

      {/* Title */}
      <h3 className="font-display" style={{
        fontSize: 'clamp(22px, 2.5vw, 32px)',
        fontWeight: 700,
        color: 'var(--color-ivory)',
        marginBottom: 8,
        letterSpacing: '-0.02em',
      }}>
        {project.title}
      </h3>

      <p className="font-mono" style={{
        fontSize: 11,
        letterSpacing: '0.15em',
        color: project.accent,
        textTransform: 'uppercase',
        marginBottom: 20,
      }}>
        {project.subtitle}
      </p>

      <p style={{
        fontSize: 14,
        color: 'var(--color-ivory-muted)',
        lineHeight: 1.7,
        marginBottom: 32,
      }}>
        {project.tagline}
      </p>

      {/* Tech tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
        {project.tech.slice(0, 3).map(t => (
          <span key={t} className="tech-tag" style={{ borderColor: project.accent + '40', color: project.accent }}>
            {t}
          </span>
        ))}
        {project.tech.length > 3 && (
          <span className="tech-tag" style={{ borderColor: 'rgba(255,255,255,0.1)', color: 'var(--color-ivory-muted)' }}>
            +{project.tech.length - 3}
          </span>
        )}
      </div>

      {/* Open CTA */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 12,
        fontFamily: 'Space Grotesk, sans-serif',
        fontWeight: 600,
        letterSpacing: '0.1em',
        color: project.accent,
        textTransform: 'uppercase',
        opacity: hovered ? 1 : 0.6,
        transition: 'opacity 0.3s ease',
      }}>
        Explore Project <ChevronRight size={14} />
      </div>
    </motion.div>
  )
}

function ProjectModal({ project, onClose }: { project: typeof PROJECTS[0], onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(13,13,15,0.92)',
        backdropFilter: 'blur(24px)',
        zIndex: 800,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.97 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          maxWidth: 780,
          width: '100%',
          background: 'var(--color-charcoal-light)',
          border: `1px solid ${project.accent}30`,
          padding: 'clamp(32px, 5vw, 64px)',
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close project detail"
          style={{
            position: 'absolute',
            top: 24,
            right: 24,
            background: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'var(--color-ivory)',
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'none',
          }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{
          height: 2,
          background: `linear-gradient(90deg, ${project.accent}, transparent)`,
          marginBottom: 40,
        }} />

        <div style={{ fontSize: 32, marginBottom: 16 }}>{project.visual.icon}</div>

        <h2 className="font-display" style={{
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 800,
          color: 'var(--color-ivory)',
          marginBottom: 8,
          letterSpacing: '-0.02em',
        }}>{project.title}</h2>

        <p className="font-mono" style={{
          fontSize: 11,
          letterSpacing: '0.2em',
          color: project.accent,
          textTransform: 'uppercase',
          marginBottom: 32,
        }}>{project.subtitle}</p>

        {/* Problem */}
        <div style={{ marginBottom: 32 }}>
          <h4 style={{
            fontSize: 11,
            fontFamily: 'Space Mono, monospace',
            letterSpacing: '0.3em',
            color: 'var(--color-ivory-muted)',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>The Problem</h4>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'var(--color-ivory-dim)' }}>
            {project.problem}
          </p>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 32 }}>
          <h4 style={{
            fontSize: 11,
            fontFamily: 'Space Mono, monospace',
            letterSpacing: '0.3em',
            color: 'var(--color-ivory-muted)',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}>Features Implemented</h4>
          <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
            {project.features.map((f, i) => (
              <li key={i} style={{
                display: 'flex',
                gap: 10,
                alignItems: 'flex-start',
                fontSize: 14,
                color: 'var(--color-ivory-dim)',
                lineHeight: 1.5,
              }}>
                <span style={{
                  width: 5, height: 5,
                  borderRadius: '50%',
                  background: project.accent,
                  flexShrink: 0,
                  marginTop: 5,
                }} />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Contribution */}
        <div style={{ marginBottom: 32 }}>
          <h4 style={{
            fontSize: 11,
            fontFamily: 'Space Mono, monospace',
            letterSpacing: '0.3em',
            color: 'var(--color-ivory-muted)',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>My Contribution</h4>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--color-ivory-dim)' }}>
            {project.contribution}
          </p>
        </div>

        {/* Metric */}
        {project.metric && (
          <div style={{
            padding: '16px 20px',
            border: `1px solid ${project.accent}30`,
            background: project.accentDim,
            marginBottom: 32,
          }}>
            <p className="font-mono" style={{
              fontSize: 12,
              color: project.accent,
              letterSpacing: '0.1em',
            }}>
              📊 {project.metric}
            </p>
          </div>
        )}

        {/* Tech */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 40 }}>
          {project.tech.map(t => (
            <span key={t} className="tech-tag" style={{ borderColor: project.accent + '40', color: project.accent }}>
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: project.accent,
              color: '#000',
              textDecoration: 'none',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: 'none',
            }}
          >
            View Project <ExternalLink size={14} />
          </a>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ChapterProjects({ onChapterChange }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { amount: 0.2 })
  const [activeProject, setActiveProject] = useState<typeof PROJECTS[0] | null>(null)

  useEffect(() => {
    if (isInView) onChapterChange(3)
  }, [isInView])

  return (
    <section
      id="chapter-projects"
      ref={ref}
      className="chapter-section"
      style={{
        minHeight: '100vh',
        padding: '120px 40px',
        position: 'relative',
        display: 'block',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 80 }}
        >
          <p className="chapter-number" style={{ marginBottom: 16 }}>03 · Project Worlds</p>
          <h2 className="display-lg font-display" style={{
            color: 'var(--color-ivory)',
            maxWidth: 600,
          }}>
            Each project,
            <br />
            <span style={{ color: 'var(--color-blue-glow)' }}>a distinct world.</span>
          </h2>
        </motion.div>

        {/* Projects grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {PROJECTS.map((project, i) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={i}
              onOpen={() => setActiveProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeProject && (
          <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
        )}
      </AnimatePresence>
    </section>
  )
}
