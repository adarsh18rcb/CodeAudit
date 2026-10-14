import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      <div className="scanline max-w-3xl">
        <p className="font-display text-accent text-sm mb-4 tracking-widest">STATIC ANALYSIS + LLM REVIEW</p>
        <h1 className="text-5xl font-display font-extrabold text-white leading-tight mb-6">
          Review <span className="text-accent2">smarter</span>.
        </h1>
        <p className="text-muted text-lg mb-8 max-w-xl">
          Point CodeAudit at a GitHub repository. It parses the AST, finds suspicious
          patterns, and asks an LLM to explain each one like a senior engineer would —
          issue, location, severity, why it matters, and the fix.
        </p>
        <div className="flex gap-4">
          <Link to="/register" className="px-5 py-3 rounded bg-accent text-ink font-display font-bold hover:bg-accent/90 transition">
            Start a review
          </Link>
          <Link to="/login" className="px-5 py-3 rounded border border-line text-white hover:border-accent transition">
            Sign in
          </Link>
        </div>
      </div>

      <div className="mt-20 grid md:grid-cols-3 gap-6">
        {[
          { title: 'Bugs & security', body: 'Null pointer risks, SQL injection, hardcoded secrets, and more — caught before review.' },
          { title: 'Explained, not just flagged', body: 'Every issue gets a plain-English why, a suggested fix, and a confidence score.' },
          { title: 'Complexity aware', body: 'Time/space complexity estimates and a maintainability score for every run.' },
        ].map((f, idx) => (
          <div key={f.title} className="border border-line rounded-lg p-5 bg-panel">
            <div className="font-display text-accent2 text-xs mb-2">0{idx + 1}</div>
            <h3 className="font-display font-bold text-white mb-2">{f.title}</h3>
            <p className="text-muted text-sm">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
