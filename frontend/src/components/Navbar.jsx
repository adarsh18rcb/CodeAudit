import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="border-b border-line bg-panel/80 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display font-bold text-lg tracking-tight text-white">
          <span className="text-accent">&gt;_</span> CodeAudit
        </Link>
        {user ? (
          <div className="flex items-center gap-5 text-sm">
            <Link to="/dashboard" className="text-muted hover:text-white transition">Dashboard</Link>
            <span className="text-muted">{user.name}</span>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="px-3 py-1.5 rounded border border-line text-muted hover:text-white hover:border-accent transition"
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-sm">
            <Link to="/login" className="text-muted hover:text-white transition">Sign in</Link>
            <Link to="/register" className="px-3 py-1.5 rounded bg-accent text-ink font-semibold hover:bg-accent/90 transition">
              Get started
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
