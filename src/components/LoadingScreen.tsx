import { useState, useEffect, useRef } from 'react'
import './Preloader.css'
import { audioEngine } from '../utils/audio'

interface Props {
  onComplete: (soundEnabled?: boolean) => void
}

export default function LoadingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0)
  const [isReady, setIsReady] = useState(false)
  const [isDeparting, setIsDeparting] = useState(false)
  const [awardsVisible, setAwardsVisible] = useState(true)
  const [cookieVisible, setCookieVisible] = useState(false)
  const [cookieDismissed, setCookieDismissed] = useState(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('cookie-accepted') === '1'
  })
  const motorbikeRef = useRef<HTMLDivElement>(null)

  // Progress simulation matching resource loading
  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      // Accelerate towards 100
      const increment = Math.max(1, Math.floor((100 - current) / 6) + Math.floor(Math.random() * 4))
      current = Math.min(100, current + increment)
      setProgress(current)

      if (current >= 100) {
        clearInterval(interval)
        setTimeout(() => {
          setIsReady(true)
          if (!cookieDismissed) {
            setCookieVisible(true)
          }
        }, 300)
      }
    }, 45)

    return () => clearInterval(interval)
  }, [cookieDismissed])

  // Activate motorbike on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (motorbikeRef.current) {
        motorbikeRef.current.classList.add('active')
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const handleStart = () => {
    // Play start sound chime and start ambient synth
    audioEngine.playStartChime()
    audioEngine.playAmbient()

    setIsDeparting(true)
    setAwardsVisible(false)
    setCookieVisible(false)

    // Complete transition after motorbike speeds off
    setTimeout(() => {
      onComplete(true)
    }, 900)
  }

  const handleCookie = () => {
    sessionStorage.setItem('cookie-accepted', '1')
    setCookieDismissed(true)
    setCookieVisible(false)
  }

  // Format code display as 3 digits: "000", "042", "100"
  const formattedProgress = String(progress).padStart(3, '0')

  return (
    <>
      <div
        id="preloader"
        className={`preloader--france ${isReady ? 'end' : ''} ${isDeparting ? 'departing' : ''}`}
        data-progress={progress}
      >
        {/* Motorbike and driver */}
        <div ref={motorbikeRef} className="motorbike">
          <img
            src="/image/motorbike.svg"
            width="312"
            height="260"
            alt="Motorbike"
          />
        </div>

        {/* Big subtle background progress counter in Zen Dots font */}
        <code>{formattedProgress}</code>

        {/* Infinitely scrolling city silhouette */}
        <div className="city" />

        {/* Loading progress bar */}
        {!isReady && (
          <div className="preloader-progress-track">
            <div
              className="preloader-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Interactive Enter section */}
        <div className="preloader-enter">
          <a
            href="javascript:void(0)"
            className="button-start"
            onClick={handleStart}
            onMouseEnter={() => audioEngine.playHoverBlip()}
            role="button"
            tabIndex={0}
          >
            START
          </a>
          <p>For the best experience</p>
          <p>Turn your sound on / Switch to desktop</p>
        </div>
      </div>

      {/* Awards Ribbon at bottom */}
      <div id="awards" className={!awardsVisible ? 'end' : ''}>
        <div>
          <a
            href="https://www.awwwards.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Awwwards Site of the Day"
          >
            <img
              src="/image/award-awwwards.svg"
              width="73"
              height="70"
              alt="Awwwards Site of the Day"
            />
          </a>
          <a
            href="https://thefwa.com"
            target="_blank"
            rel="noopener noreferrer"
            title="FWA of the Day"
          >
            <img
              src="/image/award-fwa.svg"
              width="100"
              height="38"
              alt="FWA of the Day"
            />
          </a>
          <a
            href="https://www.cssdesignawards.com"
            target="_blank"
            rel="noopener noreferrer"
            title="CSS Design Awards Special Kudos"
          >
            <img
              src="/image/award-cssda.svg"
              width="86"
              height="86"
              alt="CSS Design Awards"
            />
          </a>
          <a
            href="https://orpetron.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Orpetron Site of the Day"
          >
            <img
              src="/image/award-orpetron.svg"
              width="68"
              height="69"
              alt="Orpetron Web Design"
            />
          </a>
          <a
            href="https://wdawards.com"
            target="_blank"
            rel="noopener noreferrer"
            title="World Design Awards Excellence"
          >
            <img
              src="/image/award-wd.svg"
              width="98"
              height="31"
              alt="WD Awards"
            />
          </a>
        </div>
      </div>

      {/* Analytics & Cookie Consent Banner */}
      {!cookieDismissed && (
        <div
          id="cookie"
          className={`${cookieVisible && isReady && !isDeparting ? 'visible' : ''}`}
        >
          <p>
            I use Analytics to collect anonymous data about how visitors use my site. This data helps me improve my website and provide a better user experience.
            <br />
            You can choose to accept or reject cookies by clicking the buttons below.
          </p>
          <div className="cookie-cta">
            <button className="cookie-cta-accept" onClick={handleCookie}>
              Accept
            </button>
            <button className="cookie-cta-reject" onClick={handleCookie}>
              Reject
            </button>
          </div>
        </div>
      )}
    </>
  )
}
