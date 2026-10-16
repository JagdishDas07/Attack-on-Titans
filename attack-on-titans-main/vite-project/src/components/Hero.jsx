import { useEffect, useRef } from 'react'
import './Hero.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const sectionRef = useRef(null)
  const stickyRef  = useRef(null)
  const videoRef   = useRef(null)

  const ch1TitleRef = useRef(null)
  const ch1SubRef   = useRef(null)
  const ch2TitleRef = useRef(null)
  const ch2SubRef   = useRef(null)
  const ch3TitleRef = useRef(null)
  const ch3SubRef   = useRef(null)
  const overlayRef  = useRef(null)
  const hintRef     = useRef(null)

  useEffect(() => {
    const video   = videoRef.current
    const section = sectionRef.current
    if (!video || !section) return

    let ctx = null
    let disposed = false

    video.pause()
    video.currentTime = 0

    /* `duration` is null when the video failed to load / is unsupported:
       the text animation must still run instead of leaving a blank page. */
    const build = duration => {
      if (disposed) return
      ctx?.revert()

      const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : null

      ctx = gsap.context(() => {
        const scrollLen = Math.min(
          Math.max((safeDuration ?? 20) * 150, window.innerHeight * 3),
          window.innerHeight * 8
        )

        section.style.height = `${scrollLen + window.innerHeight}px`

        const tl = gsap.timeline({
          defaults  : { ease: 'power3.out' },
          scrollTrigger: {
            trigger   : section,
            start     : 'top top',
            end       : `+=${scrollLen}`,
            scrub     : true,
            invalidateOnRefresh: true,
            onUpdate  : (self) => {
              if (!safeDuration) return
              const t = Math.min(self.progress * safeDuration, safeDuration - 0.01)
              if (Number.isFinite(t)) video.currentTime = t
            },
          },
        })

        tl.fromTo(hintRef.current,
          { opacity: 1 },
          { opacity: 0, duration: 0.04, ease: 'none', immediateRender: true },
          0)

        tl.fromTo(ch1TitleRef.current,
          { opacity: 0, y: 60, filter: 'blur(12px)' },
          { opacity: 1, y: 0,  filter: 'blur(0px)', duration: 0.12 },
          0.03)
        tl.fromTo(ch1SubRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0,  duration: 0.1 },
          0.1)
        tl.to([ch1TitleRef.current, ch1SubRef.current],
          { opacity: 0, y: -40, filter: 'blur(8px)', duration: 0.08 },
          0.24)

        tl.fromTo(ch2TitleRef.current,
          { opacity: 0, letterSpacing: '0.5em', filter: 'blur(18px)' },
          { opacity: 1, letterSpacing: '0.2em', filter: 'blur(0px)', duration: 0.14 },
          0.30)
        tl.fromTo(ch2SubRef.current,
          { opacity: 0, x: -40 },
          { opacity: 1, x: 0, duration: 0.1 },
          0.40)
        tl.to([ch2TitleRef.current, ch2SubRef.current],
          { opacity: 0, y: -30, duration: 0.08 },
          0.58)

        tl.fromTo(overlayRef.current,
          { opacity: 0.55 },
          { opacity: 0.10, duration: 0.15 },
          0.62)

        tl.fromTo(ch3TitleRef.current,
          { opacity: 0, scale: 1.15, filter: 'blur(14px)' },
          { opacity: 1, scale: 1,    filter: 'blur(0px)', duration: 0.16 },
          0.68)
        tl.fromTo(ch3SubRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.12 },
          0.80)
      }, section)
    }

    const onMeta = () => build(video.duration)
    const onError = () => build(null)

    if (video.readyState >= 1) {
      build(video.duration)
    } else {
      video.addEventListener('loadedmetadata', onMeta)
      video.addEventListener('error', onError)
    }

    let raf = 0
    const onResize = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        build(video.duration)
        ScrollTrigger.refresh()
      })
    }
    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      video.removeEventListener('loadedmetadata', onMeta)
      video.removeEventListener('error', onError)
      /* Only revert this section's own tweens/triggers. Killing everything
         with `ScrollTrigger.getAll()` took down the TitanSize section too. */
      ctx?.revert()
      section.style.height = ''
    }
  }, [])

  return (
    <section className="hero" id="story" ref={sectionRef}>
      <div className="hero__sticky" ref={stickyRef}>

        <video
          ref={videoRef}
          className="hero__video"
          src="/video/one.mp4"
          muted
          playsInline
          preload="auto"
        />

        <div className="hero__overlay" ref={overlayRef} />

        <div className="hero__grain" />

        <div className="hero__chapter hero__ch1">
          <div className="hero__eyebrow">
            <span className="hero__rule" />
            <span className="hero__eyebrow-txt">Year 845 · Wall Maria</span>
            <span className="hero__rule" />
          </div>
          <h1 className="hero__ch1-title" ref={ch1TitleRef}>
            Beyond the <em>Walls</em><br />
            <span>lies the truth</span>
          </h1>
          <p className="hero__ch1-sub" ref={ch1SubRef}>
            Humanity's last refuge — three walls, one consuming dread.
          </p>
        </div>

        <div className="hero__chapter hero__ch2">
          <p className="hero__ch2-title" ref={ch2TitleRef}>SHINGEKI NO KYOJIN</p>
          <p className="hero__ch2-sub"   ref={ch2SubRef}>— The day the wall was breached —</p>
        </div>

        <div className="hero__chapter hero__ch3">
          <h2 className="hero__ch3-title" ref={ch3TitleRef}>
            ATTACK<br /><span>ON TITAN</span>
          </h2>
          <p className="hero__ch3-sub" ref={ch3SubRef}>
            Dedicate your heart. Pledge your life.
          </p>
        </div>

        <div className="hero__scroll-hint" ref={hintRef}>
          <span />
        </div>

      </div>
    </section>
  )
}

export default Hero
