'use client'

import { useState, useEffect } from 'react'
import { Mail, Linkedin, Github, MessageCircle, ArrowRight } from 'lucide-react'
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-800">Loading profile...</div>
      </div>
    )
  }

  const { personal, skills, education, projects_portfolio, career_goals } = profileData

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            JDA
          </div>
          <div className="flex items-center gap-8">
            <button
              onClick={() => setActiveTab('about')}
              className={`text-sm font-medium transition ${
                activeTab === 'about'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </button>
            <button
              onClick={() => setActiveTab('work')}
              className={`text-sm font-medium transition ${
                activeTab === 'work'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Work
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`text-sm font-medium transition ${
                activeTab === 'skills'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Skills
            </button>
          </div>
          <button
            onClick={() => setIsChatOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-sm font-medium"
          >
            Chat
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
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
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
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

            {/* Right - Avatar Placeholder */}
            <div className="flex justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">👨‍💻</div>
                  <p className="text-gray-600 font-medium">{personal.name}</p>
                  <p className="text-gray-500 text-sm">{personal.location}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* About Section */}
          {activeTab === 'about' && (
            <div className="space-y-12 animate-fadeIn">
              <div>
                <h2 className="text-4xl font-bold mb-8">About Me</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {personal.elevator_pitch}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Education</h3>
                      <p className="text-gray-600">{education.degree}</p>
                      <p className="text-gray-500 text-sm">{education.university}</p>
                      <p className="text-gray-500 text-sm">Graduating {education.graduation_year}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Thesis Project</h3>
                      <p className="text-gray-600">{education.thesis_project}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href={`mailto:${personal.contact.email}`}
                  className="p-6 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-lg transition group"
                >
                  <Mail className="w-6 h-6 text-blue-600 mb-3 group-hover:scale-110 transition" />
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-semibold text-gray-900">{personal.contact.email}</p>
                </a>
                <a
                  href={personal.contact.linkedin}
                  target="_blank"
                  className="p-6 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-lg transition group"
                >
                  <Linkedin className="w-6 h-6 text-blue-600 mb-3 group-hover:scale-110 transition" />
                  <p className="text-sm text-gray-500 mb-1">LinkedIn</p>
                  <p className="font-semibold text-gray-900">My Profile</p>
                </a>
                <a
                  href={personal.contact.github}
                  target="_blank"
                  className="p-6 border border-gray-200 rounded-lg hover:border-blue-600 hover:shadow-lg transition group"
                >
                  <Github className="w-6 h-6 text-blue-600 mb-3 group-hover:scale-110 transition" />
                  <p className="text-sm text-gray-500 mb-1">GitHub</p>
                  <p className="font-semibold text-gray-900">View Code</p>
                </a>
              </div>
            </div>
          )}

          {/* Work Section */}
          {activeTab === 'work' && (
            <div className="space-y-12 animate-fadeIn">
              <h2 className="text-4xl font-bold">Featured Projects</h2>
              <div className="grid grid-cols-1 gap-8">
                {projects_portfolio.map((project: any, idx: number) => (
                  <div
                    key={idx}
                    className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition"
                  >
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 h-64 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-5xl mb-3">📱</div>
                        <p className="font-semibold text-gray-600">{project.name}</p>
                      </div>
                    </div>
                    <div className="p-8">
                      <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
                      <p className="text-gray-600 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech: string) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
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
            <div className="space-y-12 animate-fadeIn">
              <h2 className="text-4xl font-bold">Skills & Expertise</h2>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Design Specialties</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {skills.technical.design_specialties.map((spec: string) => (
                    <div key={spec} className="p-4 bg-blue-50 rounded-lg border border-blue-100 hover:border-blue-300 transition">
                      <p className="font-medium text-gray-900">{spec}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Programming Languages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skills.technical.programming_languages.map((lang: any) => (
                    <div key={lang.language} className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-gray-900">{lang.language}</p>
                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-600 rounded-full">
                          {lang.proficiency}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{lang.specialization}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Design Tools</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {skills.technical.design_tools.map((tool: string) => (
                    <div key={tool} className="p-4 bg-purple-50 rounded-lg border border-purple-100 text-center hover:border-purple-300 transition">
                      <p className="font-medium text-gray-900">{tool}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Soft Skills</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {skills.soft_skills.map((skill: string) => (
                    <div key={skill} className="p-4 bg-green-50 rounded-lg border border-green-100 hover:border-green-300 transition">
                      <p className="font-medium text-gray-900">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Career Goals</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Short-term</p>
                    <p className="text-gray-900 font-medium">{career_goals.short_term}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Long-term</p>
                    <p className="text-gray-900 font-medium">{career_goals.long_term}</p>
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
        <span className="absolute bottom-16 right-0 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Ask me anything
        </span>
      </button>

      {/* Chat Dialog */}
      {isChatOpen && <ChatDialog onClose={() => setIsChatOpen(false)} />}
    </div>
  )
}
