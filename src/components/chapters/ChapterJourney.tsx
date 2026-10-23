import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface Props {
  onChapterChange: (ch: number) => void
}

const EDUCATION = [
  {
    institution: 'Vellore Institute of Technology',
    location: 'Bhopal, Madhya Pradesh, India',
    degree: 'B.Tech · Computer Science Engineering',
    period: 'Aug 2023 – May 2027',
    highlight: 'CGPA: 9.19',
    type: 'education',
  },
]

const EXPERIENCE = [
  {
    company: 'AmasQIS.ai',
    role: 'Full-Stack Developer Intern',
    period: 'May 2025 – October 2025',
    type: 'fullstack',
    contributions: [
      'Built and deployed banking applications using Node.js and JavaScript',
      'Developed backend systems using OOP principles and REST APIs',
      'Worked on scalability, reliability, and performance',
      'Automated CI/CD pipelines with GitHub Actions',
    ],
  },
  {
    company: 'UPTOSKILLS (AICTE)',
    role: 'Full-Stack Developer Intern',
    period: 'February 2025 – May 2025',
    type: 'fullstack',
    contributions: [
      'Developed responsive web applications',
      'Optimized UI components, reducing page load time by 35% across devices',
    ],
  },
  {
    company: 'Codveda Technologies',
    role: 'Frontend Web Developer',
    period: 'February 2025 – March 2025',
    type: 'frontend',
    contributions: [
      'Implemented reusable React components',
      'Developed a modular frontend architecture, reducing development redundancy by 25%',
    ],
  },
]

function TimelineItem({ item, index, isExperience }: { item: any, index: number, isExperience: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ display: 'flex', gap: 32, position: 'relative' }}
    >
      {/* Timeline line + dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 20, flexShrink: 0 }}>
        <div style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: isExperience ? 'var(--color-blue-glow)' : 'var(--color-amber)',
          boxShadow: `0 0 12px ${isExperience ? 'rgba(96,165,250,0.6)' : 'rgba(212,149,106,0.6)'}`,
          flexShrink: 0,
          marginTop: 6,
        }} />
        <div style={{
          width: 1,
          flex: 1,
          background: 'rgba(255,255,255,0.06)',
          marginTop: 8,
        }} />
      </div>

      {/* Content */}
      <div style={{ flex: 1, paddingBottom: 48 }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 4, flexWrap: 'wrap' }}>
            <h3 className="font-display" style={{
              fontSize: 'clamp(18px, 2vw, 22px)',
              fontWeight: 700,
              color: 'var(--color-ivory)',
            }}>
              {isExperience ? item.company : item.institution}
            </h3>
            {item.highlight && (
              <span style={{
                padding: '3px 10px',
                background: 'rgba(212,149,106,0.12)',
                border: '1px solid rgba(212,149,106,0.3)',
                borderRadius: 2,
                fontSize: 11,
                fontFamily: 'Space Mono, monospace',
                color: 'var(--color-amber)',
                letterSpacing: '0.1em',
              }}>{item.highlight}</span>
            )}
          </div>
          <div style={{
            fontSize: 14,
            color: isExperience ? 'var(--color-blue)' : 'var(--color-amber)',
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 600,
            marginBottom: 4,
          }}>
            {isExperience ? item.role : item.degree}
          </div>
          <div className="font-mono" style={{
            fontSize: 11,
            letterSpacing: '0.15em',
            color: 'var(--color-ivory-muted)',
          }}>
            {item.period}{item.location ? ` · ${item.location}` : ''}
          </div>
        </div>

        {item.contributions && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {item.contributions.map((c: string, i: number) => (
              <li key={i} style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                fontSize: 14,
                color: 'var(--color-ivory-muted)',
                lineHeight: 1.6,
              }}>
                <span style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: 'var(--color-blue)',
                  flexShrink: 0,
                  marginTop: 7,
                }} />
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  )
}

export default function ChapterJourney({ onChapterChange }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { amount: 0.2 })

  useEffect(() => {
    if (isInView) onChapterChange(2)
  }, [isInView])

  return (
    <section
      id="chapter-journey"
      ref={ref}
      className="chapter-section"
      style={{
        minHeight: '100vh',
        padding: '120px 40px',
        position: 'relative',
        display: 'block',
      }}
    >
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 80 }}
        >
          <p className="chapter-number" style={{ marginBottom: 16 }}>02 · My Journey</p>
          <h2 className="display-lg font-display" style={{ color: 'var(--color-ivory)' }}>
            Building experience,
            <br />
            <span style={{ color: 'var(--color-blue-glow)' }}>one sprint at a time.</span>
          </h2>
        </motion.div>

        {/* Education */}
        <div style={{ marginBottom: 60 }}>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: '0.4em',
              color: 'var(--color-amber)',
              textTransform: 'uppercase',
              marginBottom: 32,
            }}
          >
            Education
          </motion.p>
          {EDUCATION.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} isExperience={false} />
          ))}
        </div>

        {/* Experience */}
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono"
            style={{
              fontSize: 10,
              letterSpacing: '0.4em',
              color: 'var(--color-blue)',
              textTransform: 'uppercase',
              marginBottom: 32,
            }}
          >
            Professional Experience
          </motion.p>
          {EXPERIENCE.map((item, i) => (
            <TimelineItem key={i} item={item} index={i} isExperience={true} />
          ))}
        </div>
      </div>
    </section>
  )
}
