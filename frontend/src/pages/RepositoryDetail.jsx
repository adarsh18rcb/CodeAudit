import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { repoApi, reviewApi } from '../api/client'

const STATUS_STYLES = {
  PENDING: 'text-muted', RUNNING: 'text-warn animate-pulse',
  COMPLETED: 'text-accent', FAILED: 'text-danger',
}

export default function RepositoryDetail() {
  const { id } = useParams()
  const [repo, setRepo] = useState(null)
  const [reviews, setReviews] = useState([])
  const [running, setRunning] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    const [{ data: repoData }, { data: reviewsData }] = await Promise.all([
      repoApi.get(id),
      reviewApi.listForRepo(id),
    ])
    setRepo(repoData)
    setReviews(reviewsData)
  }

  useEffect(() => { load() }, [id])

  const runReview = async () => {
    setRunning(true)
    setError('')
    try {
      await reviewApi.create(id)
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start review')
    } finally {
      setRunning(false)
    }
  }

  if (!repo) return <div className="max-w-4xl mx-auto px-6 py-12 text-muted">Loading…</div>

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/dashboard" className="text-muted text-sm hover:text-white">← Back to dashboard</Link>
      <div className="flex items-center justify-between mt-4 mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">{repo.repositoryName}</h1>
          <a href={repo.githubUrl} target="_blank" rel="noreferrer" className="text-accent2 text-sm">{repo.githubUrl}</a>
        </div>
        <button onClick={runReview} disabled={running}
          className="px-5 py-2.5 rounded bg-accent text-ink font-display font-bold hover:bg-accent/90 transition disabled:opacity-50">
          {running ? 'Running review…' : '▶ Run review'}
        </button>
      </div>
      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      <h2 className="font-display text-sm text-muted mb-3 tracking-widest">REVIEW HISTORY</h2>
      {reviews.length === 0 ? (
        <div className="border border-dashed border-line rounded-lg p-10 text-center text-muted">
          No reviews yet. Run one to see bugs, security issues, and suggestions.
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <Link key={r.id} to={`/reviews/${r.id}`}
              className="flex items-center justify-between border border-line rounded-lg bg-panel p-4 hover:border-accent transition">
              <div>
                <p className={`font-display font-bold text-sm ${STATUS_STYLES[r.status]}`}>{r.status}</p>
                <p className="text-muted text-xs mt-1">{new Date(r.createdAt).toLocaleString()}</p>
              </div>
              {r.score != null && (
                <div className="text-right">
                  <p className="font-display font-extrabold text-2xl text-white">{r.score}</p>
                  <p className="text-muted text-xs">/ 100</p>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
