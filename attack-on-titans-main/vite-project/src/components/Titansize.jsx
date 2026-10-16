import { useEffect, useRef } from 'react'
import './TitanSize.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* Heights are real metres. The rendered size is derived from the single
   `--unit` scale declared in TitanSize.css, where Wall Maria (50 m) is
   43vh tall — so every figure, the ground line and the wall reference
   stay consistent with each other and with their labels. */
const TITANS = [
  {
    id      : 'human',
    name    : 'Human',
    height  : '1.7 m',
    metres  : 1.7,
    color   : '#c4a450',
    desc    : 'Survey Corps soldier. The brave ones who dare to face the giants.',
    img     : '/images/Human.png',
  },
  {
    id      : 'pure',
    name    : 'Pure Titan',
    height  : '4 – 15 m',
    metres  : 15,
    color   : '#b0a090',
    desc    : 'Mindless and relentless. The most common threat beyond the walls.',
    img     : '/images/PureTitan.png',
  },
  {
    id      : 'armored',
    name    : 'Armored Titan',
    height  : '15 m',
    metres  : 15,
    color   : '#8c8c8c',
    desc    : 'Reiner Braun. Hardened plates make it nearly impenetrable.',
    img     : '/images/ArmoredTitan.png',
  },
  {
    id      : 'female',
    name    : 'Female Titan',
    height  : '14 m',
    metres  : 14,
    color   : '#c49090',
    desc    : 'Annie Leonhart. Agile, crystalline, and terrifyingly intelligent.',
    img     : '/images/FemaleTitan.png',
  },
  {
    id      : 'beast',
    name    : 'Beast Titan',
    height  : '17 m',
    metres  : 17,
    color   : '#7a8c6a',
    desc    : 'Zeke Yeager. Ape-like form with devastating projectile attacks.',
    img     : '/images/BeastTitan.png',
  },
  {
    id      : 'colossal',
    name    : 'Colossal Titan',
    height  : '60 m',
    metres  : 60,
    color   : '#c0522a',
    desc    : 'Bertholdt Hoover. The one who broke the gate. Steam Incarnate.',
    img     : '/images/col.png',
  },
]

export default function TitanSize() {
  const sectionRef = useRef(null)
  const stickyRef  = useRef(null)
  const titanRefs  = useRef([])
  const labelRefs  = useRef([])
  const headerRef  = useRef(null)
  const fogRef     = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !stickyRef.current) return

    let ctx = null

    const build = () => {
      ctx?.revert()

      ctx = gsap.context(() => {
        /* CSS `position: sticky` already pins `.ts-sticky` for the whole
           section, so no GSAP `pin` here — pinning on top of it made the
           section jump when the range ended. */
        const scrollLen = window.innerHeight * (TITANS.length + 1.5)
        section.style.height = `${scrollLen + window.innerHeight}px`

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger   : section,
            start     : 'top top',
            end       : `+=${scrollLen}`,
            scrub     : 1.2,
            invalidateOnRefresh: true,
          },
        })

        tl.fromTo(headerRef.current,
          { opacity: 0, y: -30 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' },
          0)

        tl.fromTo(fogRef.current,
          { opacity: 0.9 },
          { opacity: 0.15, duration: 1, ease: 'none' },
          0)

        TITANS.forEach((_, i) => {
          const el    = titanRefs.current[i]
          const label = labelRefs.current[i]
          if (!el) return

          const start = 0.12 + i * 0.15

          tl.fromTo(el,
            { yPercent: 110, opacity: 0, filter: 'blur(4px)' },
            { yPercent: 0,   opacity: 1, filter: 'blur(0px)', duration: 0.18, ease: 'power3.out' },
            start)

          if (label) {
            tl.fromTo(label,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.1, ease: 'power2.out' },
              start + 0.14)
          }
        })
      }, section)
    }

    build()

    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        build()
        ScrollTrigger.refresh()
      })
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      /* Revert only what this component created — `ScrollTrigger.getAll()
         .forEach(kill)` would also take down the Hero section's triggers. */
      ctx?.revert()
      section.style.height = ''
    }
  }, [])

  return (
    <section className="ts-section" id="titans" ref={sectionRef}>
      <div className="ts-sticky" ref={stickyRef}>

        <div className="ts-sky" />
        <div className="ts-ground" />
        <div className="ts-fog" ref={fogRef} />

        <div className="ts-header" ref={headerRef}>
          <span className="ts-header-rule" />
          <div>
            <p className="ts-header-eyebrow">Scale of Terror</p>
            <h2 className="ts-header-title">Titan Size Comparison</h2>
          </div>
          <span className="ts-header-rule" />
        </div>

        <div className="ts-stage">
          {TITANS.map((titan, i) => (
            <div
              key={titan.id}
              className="ts-titan-slot"
              style={{ '--color': titan.color }}
            >
              <div
                className="ts-figure"
                ref={el => { titanRefs.current[i] = el }}
              >
                <img
                  src={titan.img}
                  alt={titan.name}
                  className="ts-figure-img"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                  style={{ height: `calc(var(--unit) * ${titan.metres})` }}
                />

                <span
                  className="ts-measure-line"
                  style={{ height: `calc(var(--unit) * ${titan.metres})` }}
                />
              </div>

              <div
                className="ts-label"
                ref={el => { labelRefs.current[i] = el }}
              >
                <span className="ts-label-height">{titan.height}</span>
                <span className="ts-label-name">{titan.name}</span>
                <span className="ts-label-desc">{titan.desc}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="ts-wall-line">
          <span className="ts-wall-label">Wall Maria · 50 m</span>
        </div>

        <div className="ts-grain" />
      </div>
    </section>
  )
}
