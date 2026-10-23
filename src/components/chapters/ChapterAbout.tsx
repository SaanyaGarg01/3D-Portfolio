import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface Props {
  onChapterChange: (ch: number) => void
}

export default function ChapterAbout({ onChapterChange }: Props) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { amount: 0.3 })

  useEffect(() => {
    if (isInView) onChapterChange(1)
  }, [isInView])

  const scrollToProjects = () => {
    document.getElementById('chapter-projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="chapter-about"
      ref={ref}
      className="chapter-section"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 40px',
        position: 'relative',
      }}
    >
      <div style={{ maxWidth: 1100, width: '100%', margin: '0 auto' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 80,
          alignItems: 'center',
        }} className="about-grid">
          {/* Left column */}
          <div>
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="chapter-number"
              style={{ marginBottom: 24 }}
            >
              01 · Who I Am
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="display-lg font-display"
              style={{ color: 'var(--color-ivory)', marginBottom: 32 }}
            >
              From ideas to
              <br />
              <span style={{ color: 'var(--color-blue-glow)' }}>
                intelligent
              </span>
              <br />
              applications.
            </motion.h2>

            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: 60 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{
                height: 1,
                background: 'linear-gradient(90deg, var(--color-blue), transparent)',
                marginBottom: 32,
              }}
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="body-lg"
              style={{ marginBottom: 24 }}
            >
              I build responsive web experiences, scalable backend systems,
              and technology-driven solutions to real-world problems.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="body-md"
              style={{ marginBottom: 48 }}
            >
              Currently pursuing B.Tech in Computer Science Engineering at VIT Bhopal
              with a CGPA of 9.19. I thrive at the intersection of engineering rigour
              and meaningful human impact — whether building senior-care platforms,
              social-impact tools, or legal services technology.
            </motion.p>

            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.6 }}
              onClick={scrollToProjects}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                background: 'none',
                border: 'none',
                color: 'var(--color-blue-glow)',
                fontSize: 13,
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'none',
                padding: 0,
              }}
            >
              Explore Projects <ArrowRight size={16} />
            </motion.button>
          </div>

          {/* Right column — stat blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {[
              { num: '9.19', label: 'CGPA · VIT Bhopal', desc: 'B.Tech Computer Science Engineering' },
              { num: '3+', label: 'Internships Completed', desc: 'Full-stack, frontend, and backend roles' },
              { num: '4+', label: 'Major Projects', desc: 'AI-powered and social-impact applications' },
              { num: 'Top 10', label: 'Hackathon Finalist', desc: 'Epsilon Texpedition 2026 among others' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  padding: '20px 24px',
                  borderLeft: '1px solid rgba(59,130,246,0.25)',
                  background: 'rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  transition: 'border-color 0.3s ease',
                }}
                whileHover={{
                  borderColor: 'rgba(96,165,250,0.6)',
                  backgroundColor: 'rgba(59,130,246,0.04)',
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: 12,
                }}>
                  <span className="font-display" style={{
                    fontSize: 'clamp(28px, 3vw, 40px)',
                    fontWeight: 800,
                    color: 'var(--color-ivory)',
                    lineHeight: 1,
                  }}>{stat.num}</span>
                  <span className="font-mono" style={{
                    fontSize: 10,
                    letterSpacing: '0.2em',
                    color: 'var(--color-blue)',
                    textTransform: 'uppercase',
                  }}>{stat.label}</span>
                </div>
                <p className="body-md" style={{ fontSize: 13, marginTop: 4 }}>{stat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
