'use client'

import { useState, useEffect } from 'react'
import { Mail, Linkedin, Github, MessageCircle, ArrowRight, Moon, Sun } from 'lucide-react'
import ChatDialog from './chat-dialog'

interface ProfileData {
  personal: any
  skills: any
  education: any
  projects_portfolio: any[]
  career_goals: any
}

export default function ProfileInterface() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('about')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleTabChange = (newTab: string) => {
    if (newTab !== activeTab) {
      setIsTransitioning(true)
      setTimeout(() => {
        setActiveTab(newTab)
        setIsTransitioning(false)
        // Scroll to the main content area after transition
        setTimeout(() => {
          const contentElement = document.querySelector('.main-content')
          contentElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 100)
      }, 200)
    }
  }

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch('/digitaltwin.json')
        const data = await response.json()
        setProfileData(data)
      } catch (error) {
        console.error('Failed to load profile:', error)
      }
    }
    loadProfile()
  }, [])

  if (!profileData) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'} flex items-center justify-center`}>
        <div className={isDarkMode ? 'text-gray-400' : 'text-gray-800'}>Loading profile...</div>
      </div>
    )
  }

  const { personal, skills, education, projects_portfolio, career_goals } = profileData

  return (
    <div className={`min-h-screen transition-colors duration-300`} style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 50%, #d299c2 100%)' }}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full backdrop-blur-md border-b z-50 transition-colors duration-300 bg-white/80 border-gray-200`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-800">
            Christine
          </div>
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleTabChange('about')}
              className={`text-sm font-medium transition ${
                activeTab === 'about'
                  ? 'text-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleTabChange('about')}
              className={`text-sm font-medium transition ${
                activeTab === 'about'
                  ? 'text-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleTabChange('skills')}
              className={`text-sm font-medium transition ${
                activeTab === 'skills'
                  ? 'text-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => handleTabChange('work')}
              className={`text-sm font-medium transition ${
                activeTab === 'work'
                  ? 'text-pink-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Portfolio
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-6 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition text-sm font-medium"
            >
              Chat
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - About Me */}
      <section className={`pt-32 pb-20 px-6`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full text-pink-500 font-medium mb-4">
              Hello!
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">About me</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Content */}
            <div className="space-y-6 bg-white/80 backdrop-blur-sm p-8 rounded-3xl">
              <h2 className="text-3xl font-bold text-gray-800">
                I am a {personal.title.toLowerCase()}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {personal.summary}
              </p>
              <div className="flex gap-4 pt-4">
                <a
                  href={`https://outlook.office.com/mail/deeplink/compose?to=${personal.contact.email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition font-medium"
                >
                  Get in Touch <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={personal.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-pink-500 text-pink-500 rounded-full hover:bg-pink-50 transition font-medium"
                >
                  Learn More
                </a>
              </div>
            </div>

            {/* Right - Avatar */}
            <div className="flex justify-center">
              <div className="w-80 h-80 rounded-full overflow-hidden bg-white shadow-2xl">
                <img 
                  src="/avatar.jpg" 
                  alt={personal.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">{projects_portfolio.length}+</div>
              <p className="text-gray-600 text-sm">Projects Completed</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">100+</div>
              <p className="text-gray-600 text-sm">Happy Clients</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">{skills.technical.database_systems?.length || 5}</div>
              <p className="text-gray-600 text-sm">Technologies</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl text-center">
              <div className="text-4xl font-bold text-gray-800 mb-2">{education.graduation_year - 2022}</div>
              <p className="text-gray-600 text-sm">Years Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="px-6 pb-20 main-content">
        <div className="max-w-6xl mx-auto">
          {/* Skills Section - My Services */}
          {activeTab === 'skills' && (
            <div className={`space-y-12 ${isTransitioning ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">My database services</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Specialized in designing, implementing, and managing robust database solutions
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.technical.database_specialties?.slice(0, 4).map((spec: string, idx: number) => {
                  const icons = ['🎨', '📊', '⚡', '🔒']
                  return (
                    <div key={spec} className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl hover:shadow-xl transition">
                      <div className="text-4xl mb-4">{icons[idx % 4]}</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{spec}</h3>
                      <p className="text-gray-600 mb-4">
                        Expert-level {spec.toLowerCase()} services for enterprise applications
                      </p>
                    </div>
                  )
                })}
              </div>

              <div className="mt-16">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Technical Expertise</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                  {skills.technical.database_systems?.map((db: string) => {
                    const iconMap: Record<string, string> = {
                      'MySQL': '🐬',
                      'PostgreSQL': '🐘',
                      'SQL Server': '🔷',
                      'Oracle Database': '🦁',
                      'MongoDB': '🍃'
                    }
                    const icon = iconMap[db] || '💾'
                    return (
                      <div key={db} className="flex flex-col items-center justify-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-lg transition">
                        <div className="text-5xl mb-3">{icon}</div>
                        <p className="font-medium text-center text-sm text-gray-800">{db}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Work Section - Portfolio */}
          {activeTab === 'work' && (
            <div className={`space-y-12 ${isTransitioning ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">My featured projects</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Showcasing my best database and development work
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects_portfolio.map((project: any, idx: number) => (
                  <div
                    key={idx}
                    className="group bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden hover:shadow-xl transition flex flex-col"
                  >
                    <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-3">💼</div>
                        <p className="font-semibold text-gray-600">{project.name}</p>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{project.name}</h3>
                      <p className="mb-4 flex-1 text-gray-600">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech: string) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-xs font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium"
                          >
                            GitHub <ArrowRight className="w-4 h-4" />
                          </a>
                        )}
                        {project.live_demo && (
                          <a
                            href={project.live_demo}
                            target="_blank"
                            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                          >
                            Live Demo <ArrowRight className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* About Section */}
          {activeTab === 'about' && (
            <div className={`space-y-12 mt-12 ${isTransitioning ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Background</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <p className="text-lg leading-relaxed text-gray-600">
                      {personal.elevator_pitch}
                    </p>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Education</h3>
                      <p className="text-gray-600">{education.degree}</p>
                      <p className="text-sm text-gray-500">{education.university}</p>
                      <p className="text-sm text-gray-500">Graduating {education.graduation_year}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 mb-2">Thesis Project</h3>
                      <p className="text-gray-600">{education.thesis_project}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Cards */}
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Get in Touch</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <a
                    href={`mailto:${personal.contact.email}`}
                    className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-xl transition text-center"
                  >
                    <Mail className="w-8 h-8 text-pink-500 mb-4 mx-auto" />
                    <p className="text-sm mb-2 text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{personal.contact.email}</p>
                  </a>
                  <a
                    href={personal.contact.linkedin}
                    target="_blank"
                    className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-xl transition text-center"
                  >
                    <Linkedin className="w-8 h-8 text-pink-500 mb-4 mx-auto" />
                    <p className="text-sm mb-2 text-gray-500">LinkedIn</p>
                    <p className="font-semibold text-gray-800">Connect with me</p>
                  </a>
                  <a
                    href={personal.contact.github}
                    target="_blank"
                    className="p-8 bg-white/80 backdrop-blur-sm rounded-2xl hover:shadow-xl transition text-center"
                  >
                    <Github className="w-8 h-8 text-pink-500 mb-4 mx-auto" />
                    <p className="text-sm mb-2 text-gray-500">GitHub</p>
                    <p className="font-semibold text-gray-800">View my code</p>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-sm py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Christine</h3>
              <p className="text-gray-600 text-sm">Database Administrator & Data Specialist</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">My address</h4>
              <p className="text-gray-600 text-sm">{personal.location}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Need Help?</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-600 text-sm hover:text-pink-600">Support</a>
                <a href="#" className="block text-gray-600 text-sm hover:text-pink-600">Contact</a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-4">Follow me</h4>
              <div className="flex gap-3">
                <a href={personal.contact.linkedin} target="_blank" className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition">
                  <Linkedin className="w-4 h-4 text-pink-600" />
                </a>
                <a href={personal.contact.github} target="_blank" className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition">
                  <Github className="w-4 h-4 text-pink-600" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-6 text-center text-sm text-gray-600">
            © 2025 {personal.name}. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 bg-pink-500 hover:bg-pink-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute bottom-16 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Ask me anything
        </span>
      </button>

      {/* Chat Dialog */}
      {isChatOpen && <ChatDialog onClose={() => setIsChatOpen(false)} />}
    </div>
  )
}
