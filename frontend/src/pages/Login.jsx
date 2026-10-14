import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="text-2xl font-display font-bold text-white mb-1">Sign in</h1>
      <p className="text-muted text-sm mb-8">Welcome back to CodeAudit.</p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="text-sm text-muted block mb-1">Email</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-panel border border-line rounded px-3 py-2 text-white focus:outline-none focus:border-accent" />
        </div>
        <div>
          <label className="text-sm text-muted block mb-1">Password</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-panel border border-line rounded px-3 py-2 text-white focus:outline-none focus:border-accent" />
        </div>
        {error && <p className="text-danger text-sm">{error}</p>}
        <button disabled={loading} type="submit"
          className="w-full py-2.5 rounded bg-accent text-ink font-display font-bold hover:bg-accent/90 transition disabled:opacity-50">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="text-muted text-sm mt-6">
        No account? <Link to="/register" className="text-accent2">Create one</Link>
      </p>
    </div>
  )
}
