import { useId } from 'react'
import styles from './styles.module.css'

export default function RevionJsLanding() {
  const clipPathId = useId()
  const logoTitleId = useId()
  const features = [
    {
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      ),
      title: 'Simplicity First',
      description: 'Minimal boilerplate and clear APIs keep your focus on domain logic'
    },
    {
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      ),
      title: 'Type-Safe Functional Programming',
      description: 'Declarative, composable, and strongly typed with TypeScript'
    },
    {
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M10 12a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4" />
          <path d="M16 12v6" />
        </svg>
      ),
      title: 'Effortless Testing',
      description: 'Built-in tools for BDD-style, domain-focused testing'
    },
    {
      icon: (
        <svg
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          aria-hidden="true">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      title: 'Lightweight and Fast',
      description: 'Zero heavy dependencies, ideal for production environments'
    }
  ]

  return (
    <div className={styles['revion-container']}>
      <div className={styles['revion-wrapper']}>
        <div className={styles['revion-hero']}>
          <div className={styles['revion-logo-container']}>
            <svg
              className={styles['revion-logo']}
              viewBox="0 0 400 400"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-labelledby={logoTitleId}>
              <title id={logoTitleId}>Revion logo</title>
              <defs>
                <clipPath id={clipPathId}>
                  <circle cx="200" cy="200" r="180" />
                </clipPath>
              </defs>
              <circle cx="200" cy="200" r="180" fill="#2D3132" />
              <g clipPath={`url(#${clipPathId})`}>
                <line
                  x1="287.46"
                  y1="131.24"
                  x2="112.54"
                  y2="268.76"
                  stroke="#494F50"
                  strokeWidth="9.06"
                  strokeLinecap="round"
                  opacity="0.85"
                />
                <line
                  x1="112.54"
                  y1="131.24"
                  x2="112.54"
                  y2="268.76"
                  stroke="#E4E6E7"
                  strokeWidth="14.66"
                  strokeLinecap="round"
                  opacity="0.95"
                />
                <line
                  x1="112.54"
                  y1="131.24"
                  x2="287.46"
                  y2="268.76"
                  stroke="#E4E6E7"
                  strokeWidth="14.66"
                  strokeLinecap="round"
                  opacity="0.95"
                />
              </g>
              <circle cx="112.54" cy="131.24" r="38.4" fill="#E4E6E7" />
              <circle cx="287.46" cy="131.24" r="23.76" fill="#798386" />
              <circle cx="112.54" cy="268.76" r="38.4" fill="#E4E6E7" />
              <circle cx="287.46" cy="268.76" r="30.96" fill="#C6D6DA" />
            </svg>
          </div>

          <h1 className={styles['revion-title']}>revion.js</h1>

          <p className={styles['revion-subtitle']}>
            A lightweight TypeScript framework for building systems based on
            <br />
            <span>CQRS</span> and <span>Event Sourcing</span>
          </p>

          <div className={styles['revion-cta-buttons']}>
            <a
              href="./docs/quick_start"
              className={`${styles['revion-btn']} ${styles['revion-btn-primary']}`}>
              Get Started
            </a>
            <a
              href="./docs/introduction"
              className={`${styles['revion-btn']} ${styles['revion-btn-secondary']}`}>
              Documentation
            </a>
          </div>

          <div className={styles['revion-features']}>
            {features.map((feature, index) => (
              <div key={index} className={styles['revion-feature-card']}>
                <div className={styles['revion-feature-icon']}>{feature.icon}</div>
                <h3 className={styles['revion-feature-title']}>{feature.title}</h3>
                <p className={styles['revion-feature-description']}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
