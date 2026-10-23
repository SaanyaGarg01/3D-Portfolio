import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Mail, Link2, GitFork, Phone, Download } from 'lucide-react'

interface Props {
  onChapterChange: (ch: number) => void
}

const CONTACTS = [
  {
    label: 'Email',
    value: 'saanyagarg400@gmail.com',
    href: 'mailto:saanyagarg400@gmail.com',
    icon: Mail,
    color: '#60a5fa',
  },
  {
    label: 'LinkedIn',
    value: 'Saanya Garg',
    href: 'https://tinyurl.com/Saanya-linkedin',
    icon: Link2,
    color: '#0ea5e9',
  },
  {
    label: 'GitHub',
    value: 'SaanyaGarg01',
    href: 'https://github.com/SaanyaGarg01',
    icon: GitFork,
    color: '#c8c4bc',
  },
  {
    label: 'Phone',
    value: '+91 7983789937',
    href: 'tel:+917983789937',
    icon: Phone,
    color: '#4ecdc4',
  },
]

export default function ChapterConnect({ onChapterChange }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { amount: 0.2 })

  useEffect(() => {
    if (isInView) onChapterChange(7)
  }, [isInView])

  return (
    <section
      id="chapter-connect"
      ref={ref}
      className="chapter-section"
      style={{
        minHeight: '100vh',
        padding: '120px 40px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 60%, rgba(59,130,246,0.06) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 900, width: '100%', textAlign: 'center' }}>
        {/* Chapter label */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8 }}
          className="chapter-number"
          style={{ marginBottom: 24 }}
        >
          07 · Let's Connect
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="display-xl font-display"
          style={{
            color: 'var(--color-ivory)',
            lineHeight: 0.9,
            marginBottom: 24,
            letterSpacing: '-0.03em',
          }}
        >
          Have an interesting
          <br />
          <span style={{ color: 'var(--color-blue-glow)' }}>
            problem to solve?
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-display"
          style={{
            fontSize: 'clamp(18px, 2.5vw, 28px)',
            color: 'var(--color-ivory-muted)',
            marginBottom: 80,
            fontWeight: 400,
            fontStyle: 'italic',
          }}
        >
          Let's build something meaningful.
        </motion.p>

        {/* Contact links */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 16,
          marginBottom: 64,
        }}>
          {CONTACTS.map((contact, i) => {
            const Icon = contact.icon
            return (
              <motion.a
                key={i}
                href={contact.href}
                target={contact.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.7 }}
                whileHover={{ y: -4 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  padding: '32px 24px',
                  border: `1px solid ${contact.color}20`,
                  textDecoration: 'none',
                  color: 'inherit',
                  background: `${contact.color}05`,
                  transition: 'all 0.3s ease',
                  cursor: 'none',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = contact.color + '50'
                  e.currentTarget.style.background = contact.color + '0f'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = contact.color + '20'
                  e.currentTarget.style.background = contact.color + '05'
                }}
              >
                <div style={{
                  width: 44,
                  height: 44,
                  border: `1px solid ${contact.color}40`,
                  background: `${contact.color}10`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Icon size={20} color={contact.color} />
                </div>
                <div>
                  <div className="font-mono" style={{
                    fontSize: 9,
                    letterSpacing: '0.3em',
                    color: contact.color,
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}>{contact.label}</div>
                  <div style={{
                    fontSize: 13,
                    color: 'var(--color-ivory-dim)',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}>{contact.value}</div>
                </div>
              </motion.a>
            )
          })}
        </div>

        {/* Resume Download */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <a
            href="/resume.pdf"
            download="Saanya_Garg_Resume.pdf"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px 48px',
              background: 'transparent',
              border: '1px solid rgba(96,165,250,0.4)',
              color: 'var(--color-blue-glow)',
              textDecoration: 'none',
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              cursor: 'none',
              transition: 'all 0.3s ease',
              marginBottom: 80,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(59,130,246,0.1)'
              e.currentTarget.style.boxShadow = '0 0 30px rgba(59,130,246,0.2)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.boxShadow = 'none'
            }}
          >
            <Download size={16} />
            Download Resume
          </a>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.8 }}
          style={{
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: 40,
          }}
        >
          <p className="font-mono" style={{
            fontSize: 11,
            color: 'var(--color-ivory-muted)',
            letterSpacing: '0.2em',
            marginBottom: 12,
          }}>
            SAANYA GARG · FULL-STACK DEVELOPER · VIT BHOPAL
          </p>
          <p style={{
            fontSize: 12,
            color: 'rgba(255,255,255,0.2)',
            fontFamily: 'Space Mono, monospace',
          }}>
            Built with React · Three.js · GSAP · Framer Motion
          </p>
        </motion.div>
      </div>
    </section>
  )
}
