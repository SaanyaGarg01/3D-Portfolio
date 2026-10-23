import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { BadgeCheck } from 'lucide-react'

interface Props {
  onChapterChange: (ch: number) => void
}

const CERTIFICATIONS = [
  {
    title: 'AWS Certified AI Practitioner',
    issuer: 'Amazon Web Services',
    type: 'Cloud & AI',
    color: '#f59e0b',
  },
  {
    title: 'AWS Certified Solutions Architect',
    issuer: 'Amazon Web Services',
    type: 'Cloud Architecture',
    color: '#f59e0b',
  },
  {
    title: 'Machine Learning Specialization',
    issuer: 'Stanford University · Coursera',
    type: 'AI/ML',
    color: '#60a5fa',
  },
  {
    title: 'Introduction to Java',
    issuer: 'LearnQuest · Coursera',
    type: 'Programming',
    color: '#fb923c',
  },
  {
    title: 'Introduction to Back-End Development',
    issuer: 'Meta · Coursera',
    type: 'Backend',
    color: '#3b82f6',
  },
  {
    title: 'Foundations of Coding Full-Stack',
    issuer: 'Microsoft · Coursera',
    type: 'Full-Stack',
    color: '#60a5fa',
  },
]

export default function ChapterCertifications({ onChapterChange }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { amount: 0.2 })

  useEffect(() => {
    if (isInView) onChapterChange(6)
  }, [isInView])

  return (
    <section
      id="chapter-certs"
      ref={ref}
      className="chapter-section"
      style={{
        minHeight: '80vh',
        padding: '120px 40px',
        position: 'relative',
        display: 'block',
      }}
    >
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 80 }}
        >
          <p className="chapter-number" style={{ marginBottom: 16 }}>06 · Certifications</p>
          <h2 className="display-lg font-display" style={{ color: 'var(--color-ivory)' }}>
            Credentials that
            <br />
            <span style={{ color: 'var(--color-blue-glow)' }}>validate the craft.</span>
          </h2>
        </motion.div>

        {/* Certifications grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 2,
        }}>
          {CERTIFICATIONS.map((cert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                borderColor: cert.color + '30',
              }}
              style={{
                padding: '28px 24px',
                border: '1px solid rgba(255,255,255,0.04)',
                display: 'flex',
                gap: 16,
                alignItems: 'flex-start',
                transition: 'all 0.3s ease',
              }}
            >
              {/* Check icon */}
              <div style={{
                width: 36,
                height: 36,
                border: `1px solid ${cert.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                background: cert.color + '0a',
              }}>
                <BadgeCheck size={18} color={cert.color} />
              </div>

              <div>
                {/* Type tag */}
                <span className="font-mono" style={{
                  fontSize: 9,
                  letterSpacing: '0.3em',
                  color: cert.color,
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: 6,
                }}>
                  {cert.type}
                </span>

                <h3 style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'var(--color-ivory)',
                  fontFamily: 'Space Grotesk, sans-serif',
                  lineHeight: 1.3,
                  marginBottom: 6,
                }}>
                  {cert.title}
                </h3>

                <p className="font-mono" style={{
                  fontSize: 11,
                  color: 'var(--color-ivory-muted)',
                  letterSpacing: '0.05em',
                }}>
                  {cert.issuer}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
