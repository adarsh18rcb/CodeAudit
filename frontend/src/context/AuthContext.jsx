import React, { createContext, useContext, useState } from 'react'
import { authApi } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  })

  const persist = (data) => {
    localStorage.setItem('token', data.token)
    const u = { id: data.userId, name: data.name, email: data.email }
    localStorage.setItem('user', JSON.stringify(u))
    setUser(u)
  }

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password })
    persist(data)
  }

  const register = async (name, email, password) => {
    const { data } = await authApi.register({ name, email, password })
    persist(data)
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
