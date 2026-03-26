'use client'

import { Github, Linkedin, Mail, MapPin, Briefcase, GraduationCap, ArrowRight } from 'lucide-react'

const NAV = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Mission', href: '#mission' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="bg-[#1a2e2a] pt-20 pb-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          <div className="md:col-span-2">
            <span className="text-2xl font-bold text-[#f5f0e8] tracking-tight block mb-4">
              Aashutosh Basnet<span className="text-[#d4a855]">.</span>
            </span>
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
