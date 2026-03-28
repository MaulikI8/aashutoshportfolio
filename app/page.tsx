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
  Instagram, Facebook, Youtube, Music
} from 'lucide-react'

const TiktokIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 004 15.74a6.34 6.34 0 0010.86 4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
  </svg>
)

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
        <span key={i} className="pb-2 -mb-2" style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}>
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
  { title: 'Content Creation', desc: 'Engaging video content, creative social media strategies, and digital storytelling that connects with people.', icon: Monitor, points: ['Video Production', 'Social Media Strategy', 'Digital Storytelling', 'Audience Growth'] },
  { title: 'Digital Products', desc: 'End to end product development, from first concept to live production.', icon: Layers, points: ['MVP Development', 'Cloud Deployment', 'Custom Integrations', 'Ongoing Support'] },
]

const PROJECTS = [
  { id: '01', title: 'Imperial Watch Store', short: 'Luxury ecommerce with a full shopping cart.', long: 'A premium ecommerce experience for luxury timepieces. Custom cart engine, real time inventory simulation, and a visual design that sells.', tech: ['JavaScript', 'CSS3', 'HTML5', 'LocalStorage'], github: 'https://github.com/aashutoshbasnetdotcom/', live: 'https://github.com/aashutoshbasnetdotcom/', done: true },
  { id: '02', title: 'CV Craft Pro', short: 'AI powered resume builder for professionals.', long: 'Helps job seekers create ATS friendly resumes. AI suggestions, formatting adjustments, and clean PDF export, all in one app.', tech: ['React', 'Django', 'PostgreSQL', 'OpenAI'], github: 'https://github.com/aashutoshbasnetdotcom/', live: 'https://cvcraftproapp.vercel.app', done: true },
  { id: '03', title: 'TaskFlow Manager', short: 'Real time collaborative task management.', long: 'Productivity tool for distributed teams. Real time updates via WebSockets, kanban style boards, and team permissions with optimistic UI.', tech: ['Next.js', 'Prisma', 'TypeScript', 'WebSockets'], github: 'https://github.com/aashutoshbasnetdotcom/', live: '#', done: false },
  { id: '04', title: 'Community Platform', short: 'Connecting young people and local communities.', long: 'A platform for organizing events, sharing resources, and enabling secure group communication. Designed for communities that need real tools, not just social feeds.', tech: ['Next.js', 'Supabase', 'TypeScript', 'Tailwind'], github: 'https://github.com/aashutoshbasnetdotcom/', live: '#', done: false },
]

// ─── NAV ─────────────────────────────────────────────────────────────────────
function Nav() {
  const [active, setActive] = useState('hero')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [onDark, setOnDark] = useState(false)

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40)
      
      let currentDark = false
      document.querySelectorAll('[data-dark]').forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top <= 64 && rect.bottom >= 32) currentDark = true
      })
      setOnDark(currentDark)

      const ids = NAV.map(i => i.href.slice(1)).reverse()
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) { setActive(id); break }
      }
    }
    window.addEventListener('scroll', fn)
    // Run once on mount to check initial position
    fn()
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const tColor = onDark ? 'text-[#f5f0e8]' : 'text-[#1a2e2a]'
  const tMuted = onDark ? 'text-[#a8c0b0]' : 'text-[#7a8a7e]'

  return (
    <>
      <motion.nav initial={{ y: -24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-transparent backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between h-16">
          <a href="#hero" className={`font-bold text-xl tracking-tight transition-colors duration-300 ${tColor}`} style={{ fontFamily: 'var(--font-playfair)' }}>
            aashutoshbasnet<span className="text-[#d4a855]">.com</span>
          </a>
          <div className="hidden md:flex items-center gap-8">
            {NAV.map(item => {
              const isActive = active === item.href.slice(1)
              return (
                <a key={item.label} href={item.href} onClick={() => setActive(item.href.slice(1))}
                  className={`relative text-sm font-medium transition-colors duration-300 pb-0.5 ${isActive ? tColor : `${tMuted} hover:${tColor}`}`}>
                  {item.label}
                  {isActive && <motion.span layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-px bg-[#d4a855] rounded-full" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                </a>
              )
            })}
            <Mag href="mailto:aashutoshbasnet2063@gmail.com" className={`px-5 py-2 text-sm font-medium rounded-full transition-colors duration-300 ${onDark ? 'bg-[#d4a855] text-[#1a2e2a] hover:bg-[#c8b99a]' : 'bg-[#1a2e2a] text-[#f5f0e8] hover:bg-[#243d38]'}`}>Hire Me</Mag>
          </div>
          <button className={`md:hidden transition-colors duration-300 ${tColor}`} onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}
            className="fixed top-16 inset-x-0 z-40 bg-[#f5f0e8]/95 backdrop-blur-md border-b border-[#e8e0d0] py-5 px-6 md:hidden">
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
                  <motion.span className="block text-[#d4a855]" initial={{ y: '110%' }} animate={{ y: 0 }} transition={{ duration: 0.7, delay: 0.32, ease: [0.33, 1, 0.68, 1] }}>Basnet</motion.span>
                </span>
              </h1>
            </div>
            <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.48 }}
              className="text-[#5a6b5e] text-lg leading-relaxed mb-10 max-w-md">
              Web developer, content creator, and artist. I build things and tell stories that matter.
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
              {[
                { href: 'https://github.com/aashutoshbasnetdotcom/', Icon: Github }, 
                { href: 'https://www.linkedin.com/in/aashutoshbasnet/', Icon: Linkedin }, 
                { href: 'https://www.instagram.com/aashutoshbasnetdotcom/', Icon: Instagram }, 
                { href: 'https://www.tiktok.com/@aashutoshbasnetdotcom', Icon: TiktokIcon }, 
                { href: 'https://www.facebook.com/aashutoshbasnetdotcom/', Icon: Facebook }, 
                { href: 'mailto:aashutoshbasnet2063@gmail.com', Icon: Mail }
              ].map(({ href, Icon }, idx) => (
                <a key={idx} href={href} target={href.startsWith('http') ? '_blank' : undefined} className="text-[#9aaa9e] hover:text-[#1a2e2a] transition-colors"><Icon className="w-5 h-5" /></a>
              ))}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.3 }} className="hidden lg:flex flex-col items-center justify-center">
            <div className="relative">
              <div className="w-80 h-80 rounded-full bg-gradient-to-br from-[#d4a855]/20 to-[#1a2e2a]/10 flex items-center justify-center border border-[#d4a855]/20">
                
                  <img src="/profile.png" alt="Aashutosh Basnet" className="w-[82%] h-[82%] object-cover object-[center_10%] rounded-full" />
                
              </div>
              <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-5 -right-10 bg-[#faf7f2] border border-[#e8e0d0] rounded-2xl p-4 shadow-md">
                <div className="text-l font-bold text-[#1a2e2a]" style={{ fontFamily: 'var(--font-playfair)' }}>3+ Years Building</div>
                <div className="text-xs text-[#7a8a7e]">20+ Projects</div>
              </motion.div>
              <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-5 -left-10 bg-[#1a2e2a] rounded-2xl p-4 shadow-md">
                <div className="text-2xl font-bold text-[#d4a855]" style={{ fontFamily: 'var(--font-playfair)' }}>160K+</div>
                <div className="text-xs text-[#a8c0b0]">Followers</div>
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
    { label: 'The Person', text: "I am Aashutosh Basnet from Nepal. I build websites, create content, and enjoy figuring out how things work. Whether it's crafting a sleek UI or exploring new ideas, I love the process of bringing concepts to life." },
    { label: 'The Developer', text: "I like building things that look good and work well. I care about fast load times, clean code, and not cutting corners. When I take on a project, I treat it like my own product, not just a checklist." },
    { label: 'The Creator', text: "I’m a creator who enjoys making content that resonates with me, from learning based ideas to brainrot and internet culture. I like exploring both because that is where real connection happens, while constantly experimenting and evolving my voice. A small incident during the September 2025 Gen Z movement in Nepal brought me a bit of unexpected attention and somehow even AI seems to know who I am now, which is still kind of funny to me." },
    { label: 'The Artist', text: "Music is how I express what code and content cannot. I write, produce, and put out my own music because some ideas are better felt than explained. It is another side of who I am and it all ties back to creating something real." },
    { label: 'The Learner', text: "Currently studying BSc (Hons) Computing at Islington College. I believe the best way to learn is by building real things and putting them out into the world." },
  ]
  return (
    <section id="about" className="py-28 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div className="lg:sticky lg:top-24">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-[#d4a855] text-xs font-mono uppercase tracking-widest mb-6">Who I Am</motion.p>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a2e2a] leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
              <Reveal>Developer. Creator. Artist.</Reveal>
            </h2>
          </div>
          <div className="space-y-10">
            {stories.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.55, ease: [0.33, 1, 0.68, 1] }}>
                <span className="text-xs font-mono text-[#d4a855] uppercase tracking-widest block mb-3">{s.label}</span>
                <p className="text-[#3a5040] text-lg leading-relaxed">{s.text}</p>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="pt-4">
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

// ─── SOCIALS BAND ─────────────────────────────────────────────────────────────
function SocialsBand() {
  const links = [
    { name: 'Instagram', href: 'https://www.instagram.com/aashutoshbasnetdotcom/', Icon: Instagram },
    { name: 'TikTok', href: 'https://www.tiktok.com/@aashutoshbasnetdotcom', Icon: TiktokIcon },
    { name: 'Facebook', href: 'https://www.facebook.com/aashutoshbasnetdotcom/', Icon: Facebook },
    { name: 'YouTube (Self)', href: 'https://www.youtube.com/@AashutoshBasnetRaw', Icon: Youtube },
    { name: 'YouTube (Music)', href: 'https://www.youtube.com/watch?v=raw4eNUUzb4', Icon: Music },
  ]
  return (
    <section className="bg-[#f0ebe0] border-y border-[#e8dfd0]">
      <div className="grid grid-cols-2 md:grid-cols-5">
        {links.map((s, i) => (
          <a key={i} href={s.href} target="_blank"
            className="group flex flex-col items-center justify-center py-16 px-4 border-b md:border-b-0 md:border-r border-[#e8dfd0] last:border-0 hover:bg-[#e8d5b5]/30 transition-colors">
            <s.Icon className="w-10 h-10 md:w-12 md:h-12 text-[#1a2e2a] mb-5 group-hover:-translate-y-2 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
            <span className="text-xs md:text-sm font-bold text-[#1a2e2a] uppercase tracking-widest text-center">{s.name}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

// ─── MISSION / WHAT I STAND FOR ───────────────────────────────────────────────
function Mission() {
  const lines = [
    'I build digital products that solve real problems.',
    'I create content that connects with people.',
    'I use technology to support meaningful change.'
  ]
  const values = [
    { n: '01', title: 'Authenticity', desc: "I believe in being genuine online and offline. I don't hide behind corporate jargon or pretend to be something I am not. I carry that same unfiltered transparency into every product I build and every piece of content I create." },
    { n: '02', title: 'Access', desc: "The best technology removes barriers. I build products and content that serve real people, not just those who can afford premium tools." },
    { n: '03', title: 'Impact', desc: "Every project is a choice. I choose to build things that matter, whether it is a website for a local business or a platform that connects communities." },
  ]
  return (
    <section id="mission" className="py-28 px-6 bg-[#1a2e2a]" data-dark>
      <div className="max-w-5xl mx-auto">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-[#d4a855] text-xs font-mono uppercase tracking-widest mb-6">What I Stand For</motion.p>
        <h2 className="text-2xl md:text-4xl font-bold text-[#f5f0e8] mb-14 max-w-3xl leading-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
          <Reveal>Building technology and content that help ideas reach people and create real impact.</Reveal>
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
          Whether you have a project or video in mind, want to collaborate, or just want to say hi, my inbox is always open.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.45 }}>
          <Mag href="mailto:aashutoshbasnet2063@gmail.com" className="inline-flex items-center gap-3 px-8 py-4 bg-[#1a2e2a] text-[#f5f0e8] font-medium rounded-full hover:bg-[#243d38] transition-all shadow-lg shadow-[#1a2e2a]/20 group">
            <Mail className="w-5 h-5 text-[#d4a855]" />
            aashutoshbasnet2063@gmail.com
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Mag>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.55 }} className="flex justify-center gap-4 mt-10">
          {[
            { href: 'https://github.com/aashutoshbasnetdotcom/', Icon: Github },
            { href: 'https://www.linkedin.com/in/aashutoshbasnet/', Icon: Linkedin }
          ].map(({ href, Icon }, idx) => (
            <a key={idx} href={href} target="_blank"
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
              {[
                { href: 'https://github.com/aashutoshbasnetdotcom/', Icon: Github }, 
                { href: 'https://www.linkedin.com/in/aashutoshbasnet/', Icon: Linkedin }, 
                { href: 'https://www.instagram.com/aashutoshbasnetdotcom/', Icon: Instagram }, 
                { href: 'https://www.tiktok.com/@aashutoshbasnetdotcom', Icon: TiktokIcon }, 
                { href: 'https://www.facebook.com/aashutoshbasnetdotcom/', Icon: Facebook }, 
                { href: 'mailto:aashutoshbasnet2063@gmail.com', Icon: Mail }
              ].map(({ href, Icon }, idx) => (
                <a key={idx} href={href} target={href.startsWith('http') ? '_blank' : undefined}
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

// ─── EXPERIENCE ───────────────────────────────────────────────────────────────
function Experience() {
  const experiences = [
    {
      role: 'Freelance Web Developer',
      org: 'Independent',
      period: '2024 to Present',
      desc: 'Building custom websites and web apps for clients across Nepal and beyond. Everything from business landing pages to full stack applications with payment integration and dashboards.',
      tags: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'Tailwind'],
    },
    {
      role: 'Content Creator',
      org: 'Self Published',
      period: '2023 to Present',
      desc: 'Creating content with a community of over 160K followers across TikTok and Instagram. From exploring learning-based ideas to internet culture and brainrot, I constantly experiment with formats and storytelling to see what connects with people.',
      tags: ['Video Production', 'Social Media', 'Storytelling', 'Community Building'],
    },
    {
      role: 'Tech Community Volunteer',
      org: 'Local Dev Communities, Kathmandu',
      period: '2024 to Present',
      desc: 'Helping organize meetups, workshops, and hackathons for young developers in Nepal. Contributing to a growing local tech scene.',
      tags: ['Event Organization', 'Public Speaking', 'Community'],
    },
    {
      role: 'Open Source Contributor',
      org: 'GitHub',
      period: '2023 to Present',
      desc: 'Contributing to open source projects, building reusable components, and sharing code that other developers can learn from and use in their own work.',
      tags: ['Open Source', 'React Components', 'Documentation', 'Code Review'],
    },
    {
      role: 'Web Development Intern',
      org: 'Local Tech Startup, Nepal',
      period: '2023 to 2024',
      desc: 'Built and maintained client facing features for a SaaS product. Worked in a small team shipping weekly updates, writing tests, and learning how production codebases actually work.',
      tags: ['React', 'TypeScript', 'REST APIs', 'Agile', 'Git'],
    },
  ]
  return (
    <section className="py-28 px-6 bg-[#1a2e2a]" data-dark>
      <div className="max-w-4xl mx-auto">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-[#d4a855] text-xs font-mono uppercase tracking-widest mb-4">My Journey</motion.p>
        <h2 className="text-3xl md:text-5xl font-bold text-[#f5f0e8] tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          <Reveal>Experience</Reveal>
        </h2>
        <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
          className="h-1 w-16 bg-[#d4a855] rounded-full mb-14 origin-left" />

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

          <div className="space-y-8">
            {experiences.map((exp, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.55, ease: [0.33, 1, 0.68, 1] }}
                className="relative pl-12">

                <div className="absolute left-[9px] top-[20px] w-3.5 h-3.5 rounded-full border-2 border-[#1a2e2a] bg-[#d4a855]" />

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#d4a855]/30 hover:bg-white/8 transition-all duration-300 group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                    <h3 className="text-base font-bold text-[#f5f0e8] group-hover:text-[#d4a855] transition-colors duration-300">{exp.role}</h3>
                    <span className="text-xs font-mono text-[#d4a855] bg-[#d4a855]/10 px-3 py-1 rounded-full border border-[#d4a855]/20 whitespace-nowrap">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-[#7a9a84] text-xs font-medium mb-3">{exp.org}</p>
                  <p className="text-[#a8c0b0] text-sm leading-relaxed mb-4">{exp.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.tags.map(t => (
                      <span key={t} className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[#7a9a84] font-mono group-hover:border-white/20 transition-colors duration-300">{t}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── BUCKET LIST ──────────────────────────────────────────────────────────────
function BucketList() {
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const toggle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const leftItems = [
    "Horse riding",
    "1600 ELO",
    "Learn to draw",
    "Learn Newari",
    "Scram the blur",
    "Learn Skateboard and 5 tricks",
    "Sky Diving",
    "Read 20 different books and 1 Constitution of Nepal",
    "Plasma Cannon",
    "Bungee Jumping",
    "Start a tech company and get into 30% tax bracket and one exatra companu for fun, just for fun",
    "Upload atleast 4 music videos",
    "25% of superman physique ",
    "Hand Stand",
    "City management software for Itahari with proper research on ground level",
    "Make a discord group with growth minded people with atleast 30K members"
  ]
  const rightItems = [
    "River rafting",
    "Dive in the middle of phewa lake",
    "3 foreign country",
    "50K Youtube Subscriber combined",
    "67K Facebook followers",
    "67K Instagram followers",
    "250K Tiktok followers on main account and 60K on new account",
    "3 treks",
    "Backflip",
    "Learn to freestyle of the top",
    "Learn DevOPS in depth",
    "1 research paper",
    "Reach 150 WPM",
    "Learn music and improve vocals",
    "Start Aashutosh Basnet Online School yt channel upload atleast 5 different helpful course for free",
    "Do everything with own earned money"
  ]

  const Item = ({ text, id }: { text: string; id: string }) => {
    const isChecked = !!checked[id]
    return (
      <label className="flex items-start gap-4 mb-5 cursor-pointer group select-none" onClick={(e) => e.stopPropagation()}>
        <div className="relative mt-0.5" onClick={(e) => toggle(id, e)}>
          <input type="checkbox" className="peer sr-only" readOnly checked={isChecked} />
          <div className="w-4 h-4 rounded border border-[#475569] bg-[#1e293b] peer-checked:bg-[#22c55e] peer-checked:border-[#22c55e] flex items-center justify-center transition-colors">
            {isChecked && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </div>
        <span className={`text-sm leading-snug flex-1 transition-all duration-300 ${isChecked ? 'line-through text-[#64748b] opacity-60' : 'text-[#e2e8f0] group-hover:text-white'}`} onClick={(e) => toggle(id, e)}>
          {text}
        </span>
      </label>
    )
  }

  return (
    <section className="py-24 px-6 bg-[#0f172a]" data-dark>
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1e293b] rounded-2xl overflow-hidden shadow-2xl border border-white/5">
          <div onClick={() => setOpen(!open)} className="px-6 py-5 md:px-8 md:py-6 flex justify-between items-center bg-[#111827] cursor-pointer hover:bg-[#151c2c] transition-colors">
            <h2 className="text-lg md:text-xl font-bold text-white tracking-wide">
              Bucket List for 2083 <span className="block md:inline mt-1 md:mt-0 text-[#94a3b8] font-normal text-sm md:text-base opacity-80">( April, 2026 to April, 2027 )</span>
            </h2>
            <div className={`text-[#94a3b8] text-3xl font-light transform transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
              +
            </div>
          </div>
          
          <AnimatePresence>
            {open && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <div className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
                    <div>
                      {leftItems.map((item, i) => <Item key={`l-${i}`} id={`l-${i}`} text={item} />)}
                    </div>
                    <div className="mt-2 md:mt-0">
                      {rightItems.map((item, i) => <Item key={`r-${i}`} id={`r-${i}`} text={item} />)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

// ─── MUSIC VIDEO ──────────────────────────────────────────────────────────────
function MusicVideo() {
  return (
    <section className="py-28 px-6 bg-[#0f172a]" data-dark>
      <div className="max-w-4xl mx-auto text-center">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="text-[#d4a855] text-xs font-mono uppercase tracking-widest mb-6">Latest Music Video</motion.p>
        <h2 className="text-3xl md:text-5xl font-bold text-[#f5f0e8] tracking-tight mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>
          <Reveal>Shahid haru lai aatankari</Reveal>
        </h2>
        <motion.p initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="text-[#94a3b8] text-lg max-w-2xl mx-auto mb-16">
          A tribute to martyrs. Music is how I express what code and content cannot.
        </motion.p>
        
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}
          className="relative bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/5 aspect-video w-full max-w-4xl mx-auto">
          <iframe 
            width="100%" 
            height="100%" 
            src="https://www.youtube.com/embed/raw4eNUUzb4" 
            title="Shahid haru lai aatankari" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          ></iframe>
        </motion.div>
      </div>
    </section>
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
      <MusicVideo />
      <SocialsBand />
      <Mission />
      <WhatIBuild />
      <Experience />
      <Education />
      <Projects />
      <BucketList />
      <Contact />
      <Footer />
    </main>
  )
}