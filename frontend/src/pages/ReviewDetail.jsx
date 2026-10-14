import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { reviewApi } from '../api/client'
import IssueCard from '../components/IssueCard'

export default function ReviewDetail() {
  const { id } = useParams()
  const [review, setReview] = useState(null)
  const [issues, setIssues] = useState([])
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    (async () => {
      const [{ data: r }, { data: i }] = await Promise.all([
        reviewApi.get(id),
        reviewApi.issues(id),
      ])
      setReview(r)
      setIssues(i)
    })()
  }, [id])

  if (!review) return <div className="max-w-4xl mx-auto px-6 py-12 text-muted">Loading…</div>

  const metrics = review.metrics
  const categories = ['ALL', 'BUG', 'SECURITY', 'PERFORMANCE', 'CODE_SMELL', 'MAINTAINABILITY', 'DOCUMENTATION']
  const filtered = filter === 'ALL' ? issues : issues.filter((i) => i.category === filter)

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to={`/repositories/${review.repository?.id ?? ''}`} className="text-muted text-sm hover:text-white">← Back to repository</Link>

      <div className="flex items-center justify-between mt-4 mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Review #{review.id}</h1>
          <p className="text-muted text-sm">{new Date(review.createdAt).toLocaleString()} · {review.status}</p>
        </div>
        {review.score != null && (
          <div className="text-right">
            <p className="font-display font-extrabold text-4xl text-accent">{review.score}</p>
            <p className="text-muted text-xs">overall score</p>
          </div>
        )}
      </div>

      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
          {[
            ['Bugs', metrics.bugs],
            ['Security', metrics.securityIssues],
            ['Code smells', metrics.codeSmells],
            ['Complexity', metrics.complexityScore],
            ['Maintainability', metrics.maintainabilityScore],
          ].map(([label, val]) => (
            <div key={label} className="border border-line rounded-lg bg-panel p-3 text-center">
              <p className="font-display font-bold text-xl text-white">{val ?? '—'}</p>
              <p className="text-muted text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map((c) => (
          <button key={c} onClick={() => setFilter(c)}
            className={`text-xs font-display px-3 py-1.5 rounded-full border transition ${
              filter === c ? 'bg-accent text-ink border-accent font-bold' : 'border-line text-muted hover:text-white'
            }`}>
            {c.replace('_', ' ')}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-line rounded-lg p-10 text-center text-muted">
          No issues in this category. 🎉
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((issue) => <IssueCard key={issue.id} issue={issue} />)}
        </div>
      )}
    </div>
  )
}
