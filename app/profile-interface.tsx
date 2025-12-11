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
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full backdrop-blur-md border-b z-50 transition-colors duration-300 ${isDarkMode ? 'bg-gray-800/80 border-gray-700' : 'bg-white/80 border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            CC
          </div>
          <div className="flex items-center gap-8">
            <button
              onClick={() => handleTabChange('about')}
              className={`text-sm font-medium transition ${
                activeTab === 'about'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </button>
            <button
              onClick={() => handleTabChange('work')}
              className={`text-sm font-medium transition ${
                activeTab === 'work'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Work
            </button>
            <button
              onClick={() => handleTabChange('skills')}
              className={`text-sm font-medium transition ${
                activeTab === 'skills'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Skills
            </button>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition ${isDarkMode ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-sm font-medium"
            >
              Chat
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`pt-32 pb-20 px-6 transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-white via-blue-50 to-white'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4">
                  {personal.name.split(' ').slice(0, 2).join(' ')}
                </h1>
                <p className="text-2xl text-blue-600 font-semibold">{personal.title}</p>
              </div>
              <p className={`text-lg leading-relaxed max-w-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {personal.summary}
              </p>
              <div className="flex gap-4 pt-4">
                <a
                  href={`mailto:${personal.contact.email}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium"
                >
                  Get in Touch <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right - Avatar */}
            <div className="flex justify-center">
              <div className={`w-80 h-80 rounded-2xl flex items-center justify-center overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-4 border-gray-700' : 'bg-gradient-to-br from-blue-100 to-purple-100 border-4 border-blue-100'}`}>
                <img 
                  src="/avatar.jpg" 
                  alt={personal.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className={`px-6 pb-20 main-content transition-colors duration-300 ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          {/* About Section */}
          {activeTab === 'about' && (
            <div className={`space-y-12 mt-12 ${isTransitioning ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
              <div>
                <h2 className="text-4xl font-bold mb-8">About Me</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                  <div className="space-y-4">
                    <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {personal.elevator_pitch}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Education</h3>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{education.degree}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{education.university}</p>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Graduating {education.graduation_year}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Thesis Project</h3>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{education.thesis_project}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href={`mailto:${personal.contact.email}`}
                  className={`p-6 rounded-lg hover:shadow-lg transition ${isDarkMode ? 'border border-gray-700 hover:border-blue-500 bg-gray-800' : 'border border-gray-200 hover:border-blue-600 bg-white'}`}
                >
                  <Mail className="w-6 h-6 text-blue-600 mb-3" />
                  <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Email</p>
                  <p className="font-semibold">{personal.contact.email}</p>
                </a>
                <a
                  href={personal.contact.linkedin}
                  target="_blank"
                  className={`p-6 rounded-lg hover:shadow-lg transition ${isDarkMode ? 'border border-gray-700 hover:border-blue-500 bg-gray-800' : 'border border-gray-200 hover:border-blue-600 bg-white'}`}
                >
                  <Linkedin className="w-6 h-6 text-blue-600 mb-3" />
                  <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>LinkedIn</p>
                  <p className="font-semibold">My Profile</p>
                </a>
                <a
                  href={personal.contact.github}
                  target="_blank"
                  className={`p-6 rounded-lg hover:shadow-lg transition ${isDarkMode ? 'border border-gray-700 hover:border-blue-500 bg-gray-800' : 'border border-gray-200 hover:border-blue-600 bg-white'}`}
                >
                  <Github className="w-6 h-6 text-blue-600 mb-3" />
                  <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>GitHub</p>
                  <p className="font-semibold">View Code</p>
                </a>
              </div>
            </div>
          )}

          {/* Work Section */}
          {activeTab === 'work' && (
            <div className={`space-y-12 ${isTransitioning ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
              <h2 className="text-4xl font-bold">Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects_portfolio.map((project: any, idx: number) => (
                  <div
                    key={idx}
                    className={`group border rounded-xl overflow-hidden hover:shadow-xl transition flex flex-col ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}
                  >
                    <div className={`aspect-square flex items-center justify-center ${isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-800' : 'bg-gradient-to-br from-blue-50 to-purple-50'}`}>
                      <div className="text-center">
                        <div className="text-6xl mb-3">🧮</div>
                        <p className={`font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{project.name}</p>
                      </div>
                    </div>
                    <div className="p-8 flex-1 flex flex-col">
                      <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                      <p className={`mb-4 flex-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech: string) => (
                          <span
                            key={tech}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-50 text-blue-600'}`}
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
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
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

          {/* Skills Section */}
          {activeTab === 'skills' && (
            <div className={`space-y-12 ${isTransitioning ? 'animate-fadeOut' : 'animate-fadeIn'}`}>
              <h2 className="text-4xl font-bold">Skills & Expertise</h2>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Database Specialties</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {skills.technical.database_specialties?.map((spec: string) => (
                    <div key={spec} className={`p-4 rounded-lg border transition ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-blue-500' : 'bg-blue-50 border-blue-100 hover:border-blue-300'}`}>
                      <p className="font-medium">{spec}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Programming Languages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.technical.programming_languages.map((lang: any) => (
                    <div key={lang.language} className={`p-6 border rounded-lg hover:shadow-lg transition ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold">{lang.language}</p>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                          {lang.proficiency}
                        </span>
                      </div>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{lang.specialization}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Database Systems</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
                      <div key={db} className={`flex flex-col items-center justify-center p-6 rounded-lg border transition hover:shadow-lg ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-purple-500' : 'bg-purple-50 border-purple-100 hover:border-purple-300'}`}>
                        <div className="text-5xl mb-3">{icon}</div>
                        <p className="font-medium text-center text-sm">{db}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Soft Skills</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {skills.soft_skills.map((skill: string) => (
                    <div key={skill} className={`p-4 rounded-lg border transition ${isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-green-500' : 'bg-green-50 border-green-100 hover:border-green-300'}`}>
                      <p className="font-medium">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`p-8 rounded-xl border transition ${isDarkMode ? 'bg-gradient-to-br from-gray-800 to-gray-700 border-gray-700' : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-100'}`}>
                <h3 className="text-xl font-semibold mb-4">Career Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Short-term</p>
                    <p className="font-medium">{career_goals.short_term}</p>
                  </div>
                  <div>
                    <p className={`text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Long-term</p>
                    <p className="font-medium">{career_goals.long_term}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center group"
      >
        <MessageCircle className="w-6 h-6" />
        <span className={`absolute bottom-16 right-0 px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-900 text-white'}`}>
          Ask me anything
        </span>
      </button>

      {/* Chat Dialog */}
      {isChatOpen && <ChatDialog onClose={() => setIsChatOpen(false)} />}
    </div>
  )
}
