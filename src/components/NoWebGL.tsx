// NoWebGL fallback component

export default function NoWebGL() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0d0d0f',
      color: '#f0ece4',
      fontFamily: 'Space Grotesk, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px',
      textAlign: 'center',
    }}>
      <div style={{
        width: 60,
        height: 60,
        border: '1px solid rgba(96,165,250,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        fontSize: 24,
      }}>⚠️</div>

      <h1 style={{
        fontFamily: 'Syne, sans-serif',
        fontSize: 'clamp(28px, 4vw, 48px)',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        marginBottom: 16,
      }}>Saanya Garg</h1>

      <h2 style={{
        fontSize: 18,
        fontWeight: 400,
        color: '#60a5fa',
        marginBottom: 24,
        fontStyle: 'italic',
      }}>Full-Stack Developer · Portfolio</h2>

      <p style={{
        fontSize: 14,
        color: '#8a8680',
        maxWidth: 480,
        lineHeight: 1.7,
        marginBottom: 40,
      }}>
        This portfolio uses WebGL for its 3D environment, which isn't supported by your browser or device.
        You can still reach Saanya through the links below.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
        <a href="mailto:saanyagarg400@gmail.com" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: 14 }}>
          saanyagarg400@gmail.com
        </a>
        <a href="https://tinyurl.com/Saanya-linkedin" target="_blank" rel="noopener noreferrer"
          style={{ color: '#60a5fa', textDecoration: 'none', fontSize: 14 }}>
          LinkedIn
        </a>
        <a href="https://github.com/SaanyaGarg01" target="_blank" rel="noopener noreferrer"
          style={{ color: '#60a5fa', textDecoration: 'none', fontSize: 14 }}>
          GitHub
        </a>
      </div>
    </div>
  )
}
