'use client'

import { useState, useEffect, useRef, ReactNode } from 'react'
import {
  motion, useScroll, useTransform, useMotionValue, useMotionTemplate,
  useSpring, AnimatePresence, useInView,
} from 'framer-motion'
import {
  Github, Linkedin, Mail, ExternalLink, Code2, Database, Layers, Globe,
  Terminal, Server, Layout, Menu, X, ArrowRight, GitBranch, Briefcase,
  Monitor, Cloud, MapPin, Heart, Box, Zap, GraduationCap, BookOpen,
} from 'lucide-react'

// ─── LENIS SMOOTH SCROLL ──────────────────────────────────────────────────────
function useLenis() {
  useEffect(() => {
    let rafId: number, lenis: any
    import('lenis').then(({ default: Lenis }) => {
      lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
      const raf = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(raf) }
      rafId = requestAnimationFrame(raf)
    })
    return () => { cancelAnimationFrame(rafId); lenis?.destroy() }
  }, [])
}

// ─── CUSTOM CURSOR ────────────────────────────────────────────────────────────
function CustomCursor() {
  const dotX = useMotionValue(-200), dotY = useMotionValue(-200)
  const ringX = useSpring(dotX, { damping: 22, stiffness: 180 })
  const ringY = useSpring(dotY, { damping: 22, stiffness: 180 })
  const [hov, setHov] = useState(false)
  const [onDark, setOnDark] = useState(false)
  useEffect(() => {
    const move = (e: MouseEvent) => {
      dotX.set(e.clientX); dotY.set(e.clientY)
      // Check if cursor is over a dark-bg element
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (el) {
        const bg = window.getComputedStyle(el).backgroundColor
        const dark = el.closest('[data-dark]')
        setOnDark(!!dark || bg === 'rgb(26, 46, 42)')
      }
    }
    const over = (e: MouseEvent) => { if ((e.target as Element).closest('a,button')) setHov(true) }
    const out  = (e: MouseEvent) => { if ((e.target as Element).closest('a,button')) setHov(false) }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    window.addEventListener('mouseout', out)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); window.removeEventListener('mouseout', out) }
  }, [])

  const dotColor = onDark ? '#f5f0e8' : '#1a2e2a'
  const ringDefault = onDark ? 'rgba(245,240,232,0.3)' : 'rgba(26,46,42,0.3)'

  return (
    <div className="hidden lg:block">
      <motion.div className="fixed top-0 left-0 z-[999] pointer-events-none" style={{ x: dotX, y: dotY, translateX: '-50%', translateY: '-50%' }}>
        <motion.div className="rounded-full" animate={{ width: hov ? 10 : 6, height: hov ? 10 : 6, backgroundColor: dotColor }} transition={{ duration: 0.15 }} />
      </motion.div>
      <motion.div className="fixed top-0 left-0 z-[998] pointer-events-none" style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}>
        <motion.div className="rounded-full"
          animate={{ width: hov ? 48 : 34, height: hov ? 48 : 34, borderColor: hov ? '#d4a855' : ringDefault, borderWidth: hov ? 2 : 1 }}
          style={{ border: `1px solid ${ringDefault}` }}
          transition={{ duration: 0.25 }} />
      </motion.div>
    </div>
  )
}

// ─── WORD REVEAL ──────────────────────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0 }: { children: string; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.28em] ${className}`}>
      {children.split(' ').map((w, i) => (
        <span key={i} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
          <motion.span style={{ display: 'inline-block' }}
            initial={{ y: '105%', opacity: 0 }}
            animate={inView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.55, delay: delay + i * 0.055, ease: [0.33, 1, 0.68, 1] }}>
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  )
}

// ─── MAGNETIC BUTTON ──────────────────────────────────────────────────────────
function Mag({ children, href, className = '' }: { children: ReactNode; href: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0), y = useMotionValue(0)
  const sx = useSpring(x, { damping: 12, stiffness: 120 })
  const sy = useSpring(y, { damping: 12, stiffness: 120 })
  const move = (e: React.MouseEvent) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - r.left - r.width / 2) * 0.28)
    y.set((e.clientY - r.top - r.height / 2) * 0.28)
  }
  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={() => { x.set(0); y.set(0) }} className="inline-block">
      <motion.a href={href} style={{ x: sx, y: sy }} className={className}>{children}</motion.a>
    </div>
  )
}

// ─── WARM CARD ────────────────────────────────────────────────────────────────
function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  const mx = useMotionValue(0), my = useMotionValue(0)
  const onMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect()
    mx.set(clientX - left); my.set(clientY - top)
  }
  return (
    <div className={`group relative overflow-hidden bg-[#faf7f2] border border-[#e8e0d0] rounded-2xl transition-all duration-300 hover:border-[#c8b99a] hover:shadow-xl hover:-translate-y-1 ${className}`} onMouseMove={onMove}>
      <motion.div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
        style={{ background: useMotionTemplate`radial-gradient(440px circle at ${mx}px ${my}px, rgba(212,168,85,0.08), transparent 80%)` }} />
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#d4a855] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const NAV = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Mission', href: '#mission' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

function ContainerIcon(props: any) { return <Box {...props} /> }

const SKILLS = [
  'React.js', 'Next.js', 'TypeScript', 'Tailwind CSS',
  'Node.js', 'Python', 'PostgreSQL', 'MongoDB',
  'Git / GitHub', 'Docker', 'AWS', 'Linux',
]

const SERVICES = [
  { title: 'Web Development', desc: 'Modern, fast, responsive websites built for real users and real performance.', icon: Globe, points: ['Responsive Design', 'Performance Optimized', 'SEO Ready', 'Accessible'] },
  { title: 'Web Applications', desc: 'Full stack apps with clean architecture, solid backends, and polished frontends.', icon: Layers, points: ['React / Next.js', 'REST APIs', 'Database Design', 'Auth Systems'] },
  { title: 'Digital Products', desc: 'End to end product development — from first concept to live production.', icon: Monitor, points: ['MVP Development', 'Cloud Deployment', 'Scalable Architecture', 'Ongoing Support'] },
]

const PROJECTS = [
  { id: '01', title: 'Imperial Watch Store', short: 'Luxury ecommerce with a full shopping cart.', long: 'A premium ecommerce experience for luxury timepieces. Custom cart engine, real time inventory simulation, and a visual design that sells.', tech: ['JavaScript', 'CSS3', 'HTML5', 'LocalStorage'], github: 'https://github.com/', live: 'https://github.com/', done: true },
  { id: '02', title: 'CV Craft Pro', short: 'AI powered resume builder for professionals.', long: 'Helps job seekers create ATS friendly resumes. AI suggestions, formatting adjustments, and clean PDF export — all in one app.', tech: ['React', 'Django', 'PostgreSQL', 'OpenAI'], github: 'https://github.com/', live: 'https://cvcraftproapp.vercel.app', done: true },
  { id: '03', title: 'TaskFlow Manager', short: 'Real time collaborative task management.', long: 'Productivity tool for distributed teams. Real time updates via WebSockets, kanban style boards, and team permissions with optimistic UI.', tech: ['Next.js', 'Prisma', 'TypeScript', 'WebSockets'], github: 'https://github.com/', live: '#', done: false },
  { id: '04', title: 'Community Platform', short: 'Connecting activists and youth organizers.', long: 'Built for civic engagement — event tools, petitions, resource sharing, and secure messaging for community groups pushing for change.', tech: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind'], github: 'https://github.com/', live: '#', done: false },
]

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [active, setActive] = useState('hero')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40)
      const ids = NAV.map(i => i.href.slice(1)).reverse()
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) { setActive(id); break }
      }
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <>
      <motion.nav initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#f5f0e8]/92 backdrop-blur-md shadow-sm border-b border-[#e8e0d0]' : 'bg-transparent'}`}>
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="#hero" className="font-bold text-xl text-[#1a2e2a] tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
            AB<span className="text-[#d4a855]">.</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {NAV.map(item => {
              const isActive = active === item.href.slice(1)
              return (
                <a key={item.label} href={item.href} onClick={() => setActive(item.href.slice(1))}
                  className={`relative text-sm font-medium transition-colors duration-200 pb-0.5 ${isActive ? 'text-[#1a2e2a]' : 'text-[#7a8a7e] hover:text-[#1a2e2a]'}`}>
                  {item.label}
                  {isActive && <motion.span layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-px bg-[#d4a855] rounded-full" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                </a>
              )
            })}
            <Mag href="mailto:aashutoshbasnet2063@gmail.com" className="px-5 py-2 bg-[#1a2e2a] text-[#f5f0e8] text-sm font-medium rounded-full hover:bg-[#243d38] transition-colors">Hire Me</Mag>
          </div>
          <button className="md:hidden text-[#1a2e2a]" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 bg-[#f5f0e8]/98 backdrop-blur-md border-b border-[#e8e0d0] py-5 px-6 md:hidden">
            {NAV.map(item => (
              <a key={item.label} href={item.href} onClick={() => setOpen(false)}
                className="block text-[#1a2e2a] font-medium py-3 border-b border-[#e8e0d0] last:border-0 text-sm">{item.label}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 100])
  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-16 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #c8b99a 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.35 }} />
      <div className="absolute top-[-8%] right-[-4%] w-[520px] h-[520px] rounded-full bg-[#d4a855]/10 blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-8%] left-[-4%] w-[420px] h-[420px] rounded-full bg-[#1a2e2a]/8 blur-[90px] pointer-events-none" />
      <motion.div style={{ y }} className="max-w-5xl w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1a2e2a]/8 border border-[#1a2e2a]/12 text-[#1a2e2a] text-xs font-medium mb-8">
              <MapPin className="w-3.5 h-3.5 text-[#d4a855]" /> Based in Nepal
            </motion.div>
            <div className="mb-6">
              <p className="text-[#7a8a7e] text-lg mb-1">
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>Hi, I&apos;m</motion.span>
              </p>
              <h1 className="text-5xl md:text-7xl font-black text-[#1a2e2a] tracking-tight leading-none" style={{ fontFamily: 'var(--font-playfair)' }}>
                <span className="block" style={{ overflow: 'hidden' }}>
                  <motion.span className="block" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}>Aashutosh</motion.span>
                </span>
                <span className="block" style={{ overflow: 'hidden' }}>
                  <motion.span className="block text-[#d4a855]" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.32, ease: [0.33, 1, 0.68, 1] }}>Basnet.</motion.span>
                </span>
              </h1>
            </div>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.48 }}
              className="text-[#5a6b5e] text-lg leading-relaxed mb-10 max-w-md">
              Web developer. Civic tech advocate. Building tools that make a difference.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.58 }} className="flex flex-wrap gap-4">
              <Mag href="#projects" className="px-7 py-3.5 bg-[#1a2e2a] text-[#f5f0e8] font-medium rounded-full hover:bg-[#243d38] transition-colors flex items-center gap-2 group shadow-lg shadow-[#1a2e2a]/20">
                View My Work <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Mag>
              <Mag href="#about" className="px-7 py-3.5 border border-[#c8b99a] text-[#1a2e2a] font-medium rounded-full hover:bg-[#f0ebe0] transition-colors">
                My Story
              </Mag>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center gap-5 mt-10">
              {[{ href: 'https://github.com/', Icon: Github }, { href: 'https://linkedin.com', Icon: Linkedin }, { href: 'mailto:aashutoshbasnet2063@gmail.com', Icon: Mail }].map(({ href, Icon }) => (
                <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined} className="text-[#9aaa9e] hover:text-[#1a2e2a] transition-colors"><Icon className="w-5 h-5" /></a>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden lg:flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-[#d4a855]/20 to-[#1a2e2a]/10 flex items-center justify-center border border-[#d4a855]/20">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#f5f0e8] to-[#e8dfd0] flex items-center justify-center shadow-inner">
                  <div className="text-center">
                    <div className="text-6xl font-black text-[#1a2e2a] mb-1" style={{ fontFamily: 'var(--font-playfair)' }}>AB</div>
                    <div className="text-[#d4a855] text-sm font-medium tracking-wide">Web Developer</div>
                  </div>
                </div>
              </div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -right-10 bg-[#faf7f2] border border-[#e8e0d0] rounded-2xl p-4 shadow-md">
                <div className="text-2xl font-bold text-[#1a2e2a]" style={{ fontFamily: 'var(--font-playfair)' }}>3+</div>
                <div className="text-xs text-[#7a8a7e]">Years Building</div>
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-5 -left-10 bg-[#1a2e2a] rounded-2xl p-4 shadow-md">
                <div className="text-2xl font-bold text-[#d4a855]" style={{ fontFamily: 'var(--font-playfair)' }}>20+</div>
                <div className="text-xs text-[#a8c0b0]">Projects Done</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#a8b4aa] text-[10px] uppercase tracking-widest">
        <span>Scroll</span>
        <motion.div animate={{ scaleY: [1, 0.4, 1], opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }}
          className="w-px h-10 bg-gradient-to-b from-[#d4a855]/60 to-transparent" />
      </motion.div>
    </section>
  )
}

// ─── IDENTITY / WHO I AM ──────────────────────────────────────────────────────
function Identity() {
  const stories = [
    { label: 'The Person', text: "I am Aashutosh Basnet, a web developer based in Nepal. I build things that work for real people and leave something worthwhile behind." },
    { label: 'The Developer', text: "I like building things that look good and work well. I care about fast load times, clean code, and not cutting corners. When I take on a project, I treat it like my own product, not just a checklist." },
    { label: 'The Learner', text: "Currently a BSc (Hons) Computing student, I am constantly expanding my knowledge in software engineering, system design, and modern development practices. I believe in learning by building." },
  ]
  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[#d4a855] text-xs font-mono uppercase tracking-widest mb-6">Who I Am</motion.p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a2e2a] leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              <Reveal>Developer. Learner. Builder of things that matter.</Reveal>
            </h2>
          </div>
          <div className="space-y-10">
            {stories.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.55, ease: [0.33, 1, 0.68, 1] }}>
                <span className="text-xs font-mono text-[#d4a855] uppercase tracking-widest block mb-3">{s.label}</span>
                <p className="text-[#3a5040] text-lg leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <Mag href="mailto:aashutoshbasnet2063@gmail.com" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a2e2a] text-[#f5f0e8] font-medium rounded-full hover:bg-[#243d38] transition-colors">
                <Mail className="w-4 h-4" /> Say Hello
              </Mag>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── MISSION / WHAT I STAND FOR ───────────────────────────────────────────────
function Mission() {
  const lines = ['I write code that works.', 'I design experiences that feel right.', 'I build for those who need it most.']
  const values = [
    { n: '01', title: 'Quality', desc: "Every project deserves thoughtful architecture. I write clean, maintainable, and well tested code because shortcuts today become problems tomorrow." },
    { n: '02', title: 'Access', desc: "The best technology removes barriers. I build products that serve real people — especially those left out of the digital revolution." },
    { n: '03', title: 'Impact', desc: "Every line of code is a choice. I choose to build things that matter, products that solve real problems and are built to last." },
  ]
  return (
    <section id="mission" className="py-28 px-6 bg-[#1a2e2a]" data-dark>
      <div className="max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-[#d4a855] text-xs font-mono uppercase tracking-widest mb-6">What I Stand For</motion.p>
        <h2 className="text-3xl md:text-5xl font-bold text-[#f5f0e8] mb-14 max-w-2xl leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
          <Reveal>Technology should serve people, not just profit.</Reveal>
        </h2>

        {/* Manifesto lines */}
        <div className="border-t border-white/10 mb-16">
          {lines.map((line, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
              className="border-b border-white/10 py-6 flex items-center gap-6 group">
              <span className="text-[#d4a855] font-mono text-xs w-6 flex-shrink-0">0{i + 1}</span>
              <span className="text-2xl md:text-3xl font-bold text-[#f5f0e8] group-hover:text-[#d4a855] transition-colors duration-300" style={{ fontFamily: 'var(--font-playfair)' }}>{line}</span>
            </motion.div>
          ))}
        </div>

        {/* Values grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {values.map((v, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4a855]/30 hover:bg-white/8 transition-all duration-300 group">
              <div className="text-4xl font-black text-[#d4a855]/20 mb-4 font-mono group-hover:text-[#d4a855]/40 transition-colors duration-300">{v.n}</div>
              <h3 className="text-lg font-bold text-[#f5f0e8] mb-3">{v.title}</h3>
              <p className="text-[#a8c0b0] text-sm leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── EDUCATION ────────────────────────────────────────────────────────────────
function Education() {
  const edu = [
    {
      degree: 'BSc (Hons) Computing',
      school: 'Islington College',
      period: '2024 to Present',
      desc: 'Currently pursuing an honors degree with a focus on Software Engineering, Data Structures, and System Architecture. Building real world projects alongside coursework.',
      tags: ['Algorithms', 'System Design', 'Agile', 'Team Leadership'],
      current: true,
    },
    {
      degree: 'Self Directed Learning Intensive',
      school: 'Various Platforms',
      period: '2022 to 2024',
      desc: 'Completed rigorous coursework in JavaScript, React, Python, and Web Development. Built over 15 practice projects to solidify core computer science concepts.',
      tags: ['JavaScript', 'React', 'Python', 'Web Standards'],
      current: false,
    },
  ]
  return (
    <section className="py-28 px-6 bg-[#f0ebe0]">
      <div className="max-w-4xl mx-auto">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-[#d4a855] text-xs font-mono uppercase tracking-widest mb-4">Background</motion.p>
        <h2 className="text-3xl md:text-5xl font-bold text-[#1a2e2a] tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          <Reveal>Education</Reveal>
        </h2>
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
          className="h-1 w-16 bg-[#d4a855] rounded-full mb-14 origin-left" />

        <div className="space-y-6">
          {edu.map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.55, ease: [0.33, 1, 0.68, 1] }}>
              <Card className="p-7">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#1a2e2a]/8 border border-[#1a2e2a]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <GraduationCap className="w-6 h-6 text-[#1a2e2a]" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                      <h3 className="text-lg font-bold text-[#1a2e2a]">{e.degree}</h3>
                      <span className="text-xs font-mono text-[#d4a855] bg-[#d4a855]/10 px-3 py-1 rounded-full border border-[#d4a855]/20 whitespace-nowrap">
                        {e.period}
                      </span>
                    </div>
                    <p className="text-sm text-[#7a8a7e] font-medium mb-3 flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5" /> {e.school}
                      {e.current && <span className="ml-2 inline-flex items-center gap-1 text-[10px] text-[#d4a855] font-medium uppercase tracking-wider"><span className="w-1.5 h-1.5 rounded-full bg-[#d4a855] animate-pulse" />Current</span>}
                    </p>
                    <p className="text-[#5a6b5e] text-sm leading-relaxed mb-4">{e.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {e.tags.map(t => (
                        <span key={t} className="px-3 py-1 rounded-full bg-[#f0ebe0] border border-[#d8ceb8] text-[10px] font-medium text-[#6b5e3e] uppercase tracking-wider">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── WHAT I BUILD ─────────────────────────────────────────────────────────────
function WhatIBuild() {
  return (
    <section id="services" className="py-28 px-6 bg-[#f0ebe0]">
      <div className="max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-[#d4a855] text-xs font-mono uppercase tracking-widest mb-4">Capabilities</motion.p>
        <h2 className="text-3xl md:text-5xl font-bold text-[#1a2e2a] tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          <Reveal>What I Build</Reveal>
        </h2>
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
          className="h-1 w-16 bg-[#d4a855] rounded-full mb-14 origin-left" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
          {SERVICES.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.55, ease: [0.33, 1, 0.68, 1] }}>
              <Card className="p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-[#1a2e2a]/8 flex items-center justify-center mb-6 border border-[#1a2e2a]/10 group-hover:bg-[#1a2e2a]/12 transition-colors">
                  <s.icon className="w-6 h-6 text-[#1a2e2a]" />
                </div>
                <h3 className="text-lg font-bold text-[#1a2e2a] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>{s.title}</h3>
                <p className="text-[#7a8a7e] text-sm leading-relaxed mb-6">{s.desc}</p>
                <ul className="space-y-2">
                  {s.points.map((p, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm text-[#5a6b5e]">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d4a855] flex-shrink-0" />{p}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Tech stack tags */}
        <div>
          <p className="text-xs font-mono text-[#7a8a7e] uppercase tracking-widest mb-5">Tech Stack</p>
          <div className="flex flex-wrap gap-2.5">
            {SKILLS.map((skill, i) => (
              <motion.span key={skill} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                whileHover={{ backgroundColor: '#1a2e2a', color: '#f5f0e8', borderColor: '#1a2e2a', scale: 1.04 }}
                className="px-4 py-2 rounded-full border border-[#c8b99a] text-sm text-[#3a4a3e] font-medium bg-[#faf7f2] transition-colors duration-200">
                {skill}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── PROJECT CARD with hover-reveal overlay ───────────────────────────────────
function ProjectCard({ p, i }: { p: typeof PROJECTS[0]; i: number }) {
  const [hov, setHov] = useState(false)
  return (
    <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
      className="relative overflow-hidden rounded-2xl border border-[#2a4040] bg-[#1e3535] h-72"
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>

      {/* Default state */}
      <div className="p-7 h-full flex flex-col">
        <div className="flex justify-between items-start mb-5">
          <span className="font-mono text-xs text-[#7a9a84] bg-white/5 px-2.5 py-1 rounded-full border border-white/8">{p.id}</span>
          {!p.done && (
            <span className="flex items-center gap-1.5 text-[10px] text-[#d4a855] font-medium uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4a855] animate-pulse" />In Progress
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-[#f5f0e8] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>{p.title}</h3>
        <p className="text-[#a8c0b0] text-sm leading-relaxed flex-grow">{p.short}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {p.tech.map(t => (
            <span key={t} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-[#7a9a84] font-mono">{t}</span>
          ))}
        </div>
      </div>

      {/* Hover overlay — slides up */}
      <motion.div initial={false} animate={{ y: hov ? 0 : '100%' }} transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        className="absolute inset-0 bg-[#d4a855] p-7 flex flex-col">
        <h3 className="text-xl font-bold text-[#1a2e2a] mb-3" style={{ fontFamily: 'var(--font-playfair)' }}>{p.title}</h3>
        <p className="text-[#2a4030] text-sm leading-relaxed flex-grow">{p.long}</p>
        <div className="flex gap-3 mt-5">
          <a href={p.github} target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-[#1a2e2a] text-[#f5f0e8] text-sm font-medium rounded-full hover:bg-[#243d38] transition-colors">
            <Github className="w-3.5 h-3.5" /> Code
          </a>
          {p.live !== '#' && (
            <a href={p.live} target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-white/30 text-[#1a2e2a] text-sm font-medium rounded-full hover:bg-white/40 transition-colors">
              <ExternalLink className="w-3.5 h-3.5" /> Live
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── PROJECTS GRID ────────────────────────────────────────────────────────────
function Projects() {
  return (
    <section id="projects" className="py-28 px-6 bg-[#1a2e2a]" data-dark>
      <div className="max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-[#d4a855] text-xs font-mono uppercase tracking-widest mb-4">Selected Work</motion.p>
        <h2 className="text-3xl md:text-5xl font-bold text-[#f5f0e8] mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          <Reveal>Projects</Reveal>
        </h2>
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
          className="h-1 w-16 bg-[#d4a855] rounded-full mb-4 origin-left" />
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.35 }}
          className="text-[#a8c0b0] text-sm mb-12">Hover a card to see the full story.</motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PROJECTS.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
        </div>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="mt-10 text-center">
          <Mag href="https://github.com/" className="inline-flex items-center gap-2 px-7 py-3 border border-white/20 text-[#f5f0e8] rounded-full hover:bg-white/5 transition-all text-sm font-medium">
            <Github className="w-4 h-4" /> More on GitHub
          </Mag>
        </motion.div>
      </div>
    </section>
  )
}

// ─── CONTACT ──────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" className="py-28 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-[#d4a855] text-xs font-mono uppercase tracking-widest mb-6">Get In Touch</motion.p>
        <h2 className="text-3xl md:text-5xl font-bold text-[#1a2e2a] tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          <Reveal>Let&apos;s Work Together</Reveal>
        </h2>
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
          className="h-1 w-16 bg-[#d4a855] rounded-full mb-8 mx-auto" />
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.35 }}
          className="text-[#5a6b5e] text-lg mb-12 leading-relaxed">
          Whether you have a project in mind, want to collaborate, or just want to say hi — my inbox is always open.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.45 }}>
          <Mag href="mailto:aashutoshbasnet2063@gmail.com" className="inline-flex items-center gap-3 px-8 py-4 bg-[#1a2e2a] text-[#f5f0e8] font-medium rounded-full hover:bg-[#243d38] transition-all shadow-lg shadow-[#1a2e2a]/20 group">
            <Mail className="w-5 h-5 text-[#d4a855]" />
            aashutoshbasnet2063@gmail.com
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Mag>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.55 }} className="flex justify-center gap-4 mt-10">
          {[{ href: 'https://github.com/', Icon: Github }, { href: 'https://linkedin.com', Icon: Linkedin }].map(({ href, Icon }) => (
            <a key={href} href={href} target="_blank"
              className="p-3.5 rounded-full border border-[#c8b99a] text-[#7a8a7e] hover:text-[#1a2e2a] hover:border-[#1a2e2a] hover:bg-[#f0ebe0] transition-all duration-200">
              <Icon className="w-5 h-5" />
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#1a2e2a] pt-20 pb-10 px-6" data-dark>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="#hero" className="text-2xl font-bold text-[#f5f0e8] tracking-tight block mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
              Aashutosh Basnet<span className="text-[#d4a855]">.</span>
            </a>
            <p className="text-[#7a9a84] text-sm leading-relaxed mb-6 max-w-xs">
              Web developer based in Nepal, focused on building modern, high performance websites and web applications.
            </p>
            <div className="flex gap-3">
              {[{ href: 'https://github.com/', Icon: Github }, { href: 'https://linkedin.com', Icon: Linkedin }, { href: 'mailto:aashutoshbasnet2063@gmail.com', Icon: Mail }].map(({ href, Icon }) => (
                <a key={href} href={href} target={href.startsWith('http') ? '_blank' : undefined}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#7a9a84] hover:text-[#d4a855] hover:border-[#d4a855]/30 transition-all duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-[#f5f0e8] uppercase tracking-widest mb-5">Navigate</h4>
            <ul className="space-y-3">
              {NAV.map(item => (
                <li key={item.label}>
                  <a href={item.href} className="text-sm text-[#7a9a84] hover:text-[#d4a855] transition-colors duration-200">{item.label}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-bold text-[#f5f0e8] uppercase tracking-widest mb-5">Info</h4>
            <ul className="space-y-3 text-sm text-[#7a9a84]">
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#d4a855]" /> Nepal</li>
              <li className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5 text-[#d4a855]" /> Available for Work</li>
              <li className="flex items-center gap-2"><GraduationCap className="w-3.5 h-3.5 text-[#d4a855]" /> Islington College</li>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-[#d4a855]" /> aashutoshbasnet2063@gmail.com</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#5a7a64] text-xs">© {new Date().getFullYear()} Aashutosh Basnet. All rights reserved.</p>
          <a href="#hero" className="text-xs text-[#5a7a64] hover:text-[#d4a855] transition-colors duration-200 flex items-center gap-1">
            Back to top <ArrowRight className="w-3 h-3 rotate-[-90deg]" />
          </a>
        </div>
      </div>
    </footer>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  useLenis()
  return (
    <main className="bg-[#f5f0e8] min-h-screen text-[#1a2e2a]">
      <CustomCursor />
      <Nav />
      <Hero />
      <Identity />
      <Mission />
      <WhatIBuild />
      <Education />
      <Projects />
      <Contact />
      <Footer />
    </main>
  )
}