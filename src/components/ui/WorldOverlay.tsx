import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Mail, Phone, RotateCcw, Award, Briefcase, GraduationCap, Code, CheckCircle, Sparkles } from 'lucide-react'
import { journeyStore, type JourneyState } from '../game/journeyStore'
import { RESUME_DATA } from '../game/resumeData'

function CategoryHeader({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 8,
          background: 'rgba(14, 165, 233, 0.15)',
          border: '1px solid rgba(14, 165, 233, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8',
        }}
      >
        <Icon size={17} />
      </div>
      <div>
        <h2
          style={{
            fontFamily: '"Space Grotesk", sans-serif',
            fontSize: 'clamp(18px, 1.8vw, 22px)',
            fontWeight: 800,
            margin: 0,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            textShadow: '0 2px 12px rgba(0, 0, 0, 0.85)',
          }}
        >
          {title}
        </h2>
        <div
          style={{
            fontSize: 11.5,
            color: '#38bdf8',
            letterSpacing: '0.06em',
            fontWeight: 700,
            textTransform: 'uppercase',
            fontFamily: '"Space Grotesk", sans-serif',
            marginTop: 2,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  )
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(10, 15, 28, 0.92)',
  backdropFilter: 'blur(32px)',
  WebkitBackdropFilter: 'blur(32px)',
  border: '1.5px solid rgba(56, 189, 248, 0.35)',
  borderRadius: 16,
  padding: 'clamp(20px, 3vw, 28px)',
  pointerEvents: 'auto',
  color: '#ffffff',
  boxShadow: '0 24px 70px rgba(0, 0, 0, 0.75), 0 0 35px rgba(56, 189, 248, 0.12)',
  maxHeight: '74vh',
  overflowY: 'auto',
  fontFamily: '"Space Grotesk", sans-serif',
}

export default function WorldOverlay() {
  const [jState, setJState] = useState<JourneyState>(() => journeyStore.getState())
  const [activeInternship, setActiveInternship] = useState(0)

  useEffect(() => {
    return journeyStore.subscribe(setJState)
  }, [])

  if (jState.phase === 'opening') return null

  const worldIndex = jState.activeWorldIndex

  return (
    <div
      style={{
        position: 'fixed',
        left: 'clamp(16px, 4vw, 48px)',
        top: '18%',
        width: 'min(460px, 90vw)',
        maxHeight: '76vh',
        zIndex: 30,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <AnimatePresence mode="wait">
        {/* =========================================================
            WORLD 1 · IDENTITY & PROFESSIONAL PROFILE
        ========================================================= */}
        {worldIndex === 1 && (
          <motion.div
            key="world-1"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={cardStyle}
          >
            <CategoryHeader icon={Sparkles} title="About Saanya Garg" subtitle="FULL STACK DEVELOPER · B.TECH CSE" />

            <div style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(255, 255, 255, 0.9)' }}>
              <p style={{ margin: '0 0 10px' }}>
                Full Stack Developer and Computer Science Engineering student at <strong>VIT Bhopal (CGPA 9.19)</strong> with three industry internships engineering responsive, resilient web applications using React.js, Node.js, Express.js, MongoDB, and MySQL.
              </p>
              <p style={{ margin: '0 0 10px' }}>
                Strong foundations in <strong>Java, Python, OOP, DBMS, and REST APIs</strong>. Awarded <strong>3rd position among 300+ teams</strong> at the MP Police Cyber Safety Hackathon, and dual <strong>AWS Certified</strong> (AI Practitioner, Solutions Architect).
              </p>
              <p style={{ margin: 0, fontStyle: 'italic', color: '#38bdf8', fontSize: 12 }}>
                Scroll forward to explore education, experience, projects, and achievements.
              </p>
            </div>
          </motion.div>
        )}

        {/* =========================================================
            WORLD 2 · EDUCATION · VIT BHOPAL
        ========================================================= */}
        {worldIndex === 2 && (
          <motion.div
            key="world-2"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            style={cardStyle}
          >
            <CategoryHeader icon={GraduationCap} title="Education" subtitle="ACADEMIC EXCELLENCE · 2023–2027" />

            <div style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(255, 255, 255, 0.9)' }}>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#ffffff', marginBottom: 2 }}>
                {RESUME_DATA.education.institution}
              </div>
              <div style={{ fontSize: 12, color: '#38bdf8', marginBottom: 12 }}>
                {RESUME_DATA.education.degree} · Aug 2023 – May 2027
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  borderRadius: 6,
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  color: '#fbbf24',
                  fontSize: 13,
                  fontWeight: 700,
                  marginBottom: 12,
                }}
              >
                <span>Cumulative GPA:</span>
                <span>{RESUME_DATA.education.cgpa}</span>
              </div>

              <p style={{ margin: '0 0 10px', fontSize: 12.5, color: 'rgba(255, 255, 255, 0.75)' }}>
                <strong>Core Focus:</strong> {RESUME_DATA.education.focus}
              </p>
              <p style={{ margin: 0, fontStyle: 'italic', color: '#38bdf8', fontSize: 12 }}>
                Scroll forward to explore professional internships.
              </p>
            </div>
          </motion.div>
        )}

        {/* =========================================================
            WORLD 3 · INTERNSHIP DISTRICT
        ========================================================= */}
        {worldIndex === 3 && (
          <motion.div
            key="world-3"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            style={cardStyle}
          >
            <CategoryHeader icon={Briefcase} title="Experience" subtitle="3 INDUSTRY FULL-STACK INTERNSHIPS" />

            {/* Company Tabs */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
              {RESUME_DATA.internships.map((intern, i) => (
                <button
                  key={i}
                  onClick={() => setActiveInternship(i)}
                  style={{
                    flex: 1,
                    padding: '8px 6px',
                    background: activeInternship === i ? '#0ea5e9' : 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid ' + (activeInternship === i ? '#38bdf8' : 'rgba(255, 255, 255, 0.16)'),
                    borderRadius: 6,
                    color: '#ffffff',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontSize: 11.5,
                    fontWeight: activeInternship === i ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {intern.company.split(' ')[0]}
                </button>
              ))}
            </div>

            {(() => {
              const intern = RESUME_DATA.internships[activeInternship]
              return (
                <div style={{ fontSize: 12.5, lineHeight: 1.6, color: 'rgba(255, 255, 255, 0.9)' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{intern.company}</div>
                  <div style={{ fontSize: 11.5, color: '#38bdf8', marginBottom: 10 }}>
                    {intern.role} · {intern.period}
                  </div>
                  <ul style={{ paddingLeft: 18, margin: '0 0 14px' }}>
                    {intern.highlights.map((h, idx) => (
                      <li key={idx} style={{ marginBottom: 6 }}>{h}</li>
                    ))}
                  </ul>
                  <p style={{ margin: 0, fontStyle: 'italic', color: '#38bdf8', fontSize: 12 }}>
                    Scroll forward to explore featured projects.
                  </p>
                </div>
              )
            })()}
          </motion.div>
        )}

        {/* =========================================================
            WORLD 4 · PROJECTS
        ========================================================= */}
        {worldIndex === 4 && (
          <motion.div
            key="world-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            style={cardStyle}
          >
            <CategoryHeader icon={Code} title="Featured Projects" subtitle="AI, SOCIAL IMPACT & ENTERPRISE" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {RESUME_DATA.projects.map((proj, i) => (
                <div
                  key={i}
                  style={{
                    padding: 12,
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: 8,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5, color: '#ffffff' }}>{proj.title}</div>
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#38bdf8', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' }}
                    >
                      {proj.linkText} <ExternalLink size={12} />
                    </a>
                  </div>
                  <div style={{ fontSize: 11, color: '#fbbf24', marginBottom: 6 }}>{proj.subtitle}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 8 }}>
                    {proj.tech.map((t, idx) => (
                      <span key={idx} style={{ padding: '2px 6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 4, fontSize: 10, color: 'rgba(255, 255, 255, 0.8)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <ul style={{ paddingLeft: 16, margin: 0, fontSize: 11.5, lineHeight: 1.55, color: 'rgba(255, 255, 255, 0.85)' }}>
                    {proj.points.slice(0, 2).map((pt, pIdx) => (
                      <li key={pIdx} style={{ marginBottom: 3 }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* =========================================================
            WORLD 5 · HACKATHONS & ACHIEVEMENTS
        ========================================================= */}
        {worldIndex === 5 && (
          <motion.div
            key="world-5"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            style={cardStyle}
          >
            <CategoryHeader icon={Award} title="Achievements" subtitle="HACKATHONS & INNOVATION AWARDS" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {RESUME_DATA.achievements.map((ach, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: 8,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                    <div style={{ fontWeight: 700, fontSize: 13.5 }}>{ach.title}</div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24' }}>{ach.metric}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.5 }}>
                    {ach.description}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* =========================================================
            WORLD 6 · TECHNICAL SKILLS
        ========================================================= */}
        {worldIndex === 6 && (
          <motion.div
            key="world-6"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            style={cardStyle}
          >
            <CategoryHeader icon={Code} title="Technical Arsenal" subtitle="LANGUAGES, CLOUD, DATABASES & TOOLS" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 12 }}>
              <div>
                <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: 4 }}>PROGRAMMING LANGUAGES</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {RESUME_DATA.skills.languages.map((s, i) => (
                    <span key={i} style={{ padding: '3px 8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 4 }}>{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: 4 }}>WEB & BACKEND FRAMEWORKS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {[...RESUME_DATA.skills.frontend, ...RESUME_DATA.skills.backend].map((s, i) => (
                    <span key={i} style={{ padding: '3px 8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 4 }}>{s}</span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: 4 }}>CLOUD, DEVOPS & DATABASES</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {[...RESUME_DATA.skills.databases, ...RESUME_DATA.skills.cloudAndTools].map((s, i) => (
                    <span key={i} style={{ padding: '3px 8px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 4 }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* =========================================================
            WORLD 7 · CERTIFICATIONS
        ========================================================= */}
        {worldIndex === 7 && (
          <motion.div
            key="world-7"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            style={cardStyle}
          >
            <CategoryHeader icon={CheckCircle} title="Certifications" subtitle="INDUSTRY-RECOGNIZED CREDENTIALS" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {RESUME_DATA.certifications.map((cert, i) => (
                <div
                  key={i}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    borderRadius: 6,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 12.5 }}>{cert.name}</div>
                    <div style={{ fontSize: 11, color: '#38bdf8' }}>{cert.issuer}</div>
                  </div>
                  <span style={{ fontSize: 10, padding: '2px 6px', background: 'rgba(14, 165, 233, 0.15)', borderRadius: 4, color: '#38bdf8' }}>
                    Verified
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* =========================================================
            WORLD 8 · JOURNEY COMPLETE & CONTACT HORIZON
        ========================================================= */}
        {worldIndex === 8 && (
          <motion.div
            key="world-8"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.4 }}
            style={cardStyle}
          >
            <CategoryHeader icon={Sparkles} title="Journey Complete" subtitle="HORIZON REACHED · SUMMARY OF ADVENTURE" />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '8px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#38bdf8' }}>3.2 km</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>Distance</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '8px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#f59e0b' }}>
                  {jState.collectedSparks.length} / 8
                </div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>Sparks Collected</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 8, padding: '8px 4px', textAlign: 'center' }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#34d399' }}>8 / 8</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>Milestones</div>
              </div>
            </div>

            <p style={{ fontSize: 12.5, lineHeight: 1.55, color: 'rgba(255, 255, 255, 0.85)', margin: '0 0 14px' }}>
              You have completed the cinematic journey through Saanya Garg's interactive world! From B.Tech at VIT Bhopal to 3 industry internships, dual AWS certifications, and state hackathon victories.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              <a
                href={`mailto:${RESUME_DATA.contact.email}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: 8,
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: 12.5,
                }}
              >
                <Mail size={15} color="#38bdf8" />
                <span>{RESUME_DATA.contact.email}</span>
              </a>

              <a
                href={`tel:${RESUME_DATA.contact.phone}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  borderRadius: 8,
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: 12.5,
                }}
              >
                <Phone size={15} color="#38bdf8" />
                <span>{RESUME_DATA.contact.phone}</span>
              </a>

              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={RESUME_DATA.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px',
                    background: '#0ea5e9',
                    borderRadius: 8,
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  LinkedIn
                </a>
                <a
                  href={RESUME_DATA.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '10px',
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: 8,
                    color: '#ffffff',
                    textDecoration: 'none',
                    fontSize: 12.5,
                    fontWeight: 600,
                  }}
                >
                  GitHub
                </a>
              </div>

              {/* Direct Resume PDF Link */}
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                download="Saanya_Garg_Resume.pdf"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '10px 14px',
                  background: 'rgba(255, 255, 255, 0.14)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: 8,
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: 12.5,
                  fontWeight: 600,
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                }}
              >
                <span>Download Saanya's Resume (PDF)</span>
              </a>
            </div>

            <button
              onClick={() => journeyStore.restartJourney()}
              style={{
                width: '100%',
                padding: '10px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: 8,
                color: '#ffffff',
                fontFamily: '"Space Grotesk", sans-serif',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <RotateCcw size={14} /> Replay Journey
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
