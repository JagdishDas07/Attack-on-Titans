import { useCallback, useEffect, useRef, useState } from 'react'
import './Navbar.css'

/* Only sections that actually exist are listed — a link to a missing id
   silently scrolls nowhere. `CTA_HREF` is the hero, which holds the video. */
const LINKS = [
  { label: 'Story',  href: '#story'  },
  { label: 'Titans', href: '#titans' },
]

const CTA_HREF = '#story'

const Navbar = () => {
  const [scrolled,    setScrolled]    = useState(false)
  const [menuOpen,    setMenuOpen]    = useState(false)
  const [activeLink,  setActiveLink]  = useState(null)
  const indicatorRef = useRef(null)
  const linksRef     = useRef([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* Keep the mobile drawer from scrolling the page behind it. */
  useEffect(() => {
    if (!menuOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = e => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const moveIndicator = useCallback(i => {
    const el  = linksRef.current[i]
    const bar = indicatorRef.current
    if (!el || !bar) return
    const parent = el.closest('.navbar__links')
    if (!parent) return
    const rect = el.getBoundingClientRect()
    const parentRect = parent.getBoundingClientRect()
    bar.style.width = `${rect.width}px`
    bar.style.transform = `translateX(${rect.left - parentRect.left}px)`
    bar.style.opacity = '1'
  }, [])

  const hideIndicator = () => {
    if (indicatorRef.current) indicatorRef.current.style.opacity = '0'
    setActiveLink(null)
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${menuOpen ? 'navbar--open' : ''}`}>

        <div className="navbar__rule navbar__rule--left" />

        <a href="#story" className="navbar__logo" onClick={() => setMenuOpen(false)}>
          <span className="navbar__logo-wings" aria-hidden="true">⸸</span>
          <span className="navbar__logo-text">
            <span className="navbar__logo-main">ATTACK</span>
            <span className="navbar__logo-sub">ON TITAN</span>
          </span>
          <span className="navbar__logo-wings" aria-hidden="true">⸸</span>
        </a>

        <div className="navbar__links-wrap">
          <ul className="navbar__links" onMouseLeave={hideIndicator}>
            {LINKS.map((link, i) => (
              <li key={link.label}>
                <a
                  ref={el => { linksRef.current[i] = el }}
                  href={link.href}
                  className={`navbar__link ${activeLink === i ? 'navbar__link--active' : ''}`}
                  onMouseEnter={() => { setActiveLink(i); moveIndicator(i) }}
                  onFocus={() => { setActiveLink(i); moveIndicator(i) }}
                >
                  <span className="navbar__link-num">0{i + 1}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {/* Only <li> may live inside a <ul>, so the indicator sits outside it. */}
          <span className="navbar__indicator" ref={indicatorRef} />
        </div>

        <a href={CTA_HREF} className="navbar__cta">
          <span className="navbar__cta-inner">
            <span>Watch Now</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="navbar__cta-bg" />
        </a>

        <div className="navbar__rule navbar__rule--right" />

        <button
          className={`navbar__burger ${menuOpen ? 'navbar__burger--open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="navbar-drawer"
        >
          <span /><span /><span />
        </button>

      </nav>

      <div
        id="navbar-drawer"
        className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="navbar__drawer-inner">
          {LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              className="navbar__drawer-link"
              style={{ '--i': i }}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
            >
              <span className="navbar__drawer-num">0{i + 1}</span>
              {link.label}
            </a>
          ))}
          <a
            href={CTA_HREF}
            className="navbar__drawer-cta"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            Watch Now
          </a>
        </div>
      </div>
    </>
  )
}

export default Navbar
