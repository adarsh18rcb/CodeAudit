import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import RepositoryDetail from './pages/RepositoryDetail'
import ReviewDetail from './pages/ReviewDetail'

export default function App() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/repositories/:id" element={<ProtectedRoute><RepositoryDetail /></ProtectedRoute>} />
        <Route path="/reviews/:id" element={<ProtectedRoute><ReviewDetail /></ProtectedRoute>} />
      </Routes>
    </div>
  )
}
