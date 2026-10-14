import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { repoApi, reviewApi } from '../api/client'

export default function Dashboard() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('github') // 'github' | 'paste'
  const [repos, setRepos] = useState([])

  // GitHub mode fields
  const [githubUrl, setGithubUrl] = useState('')
  const [language, setLanguage] = useState('')

  // Paste mode fields
  const [pasteCode, setPasteCode] = useState('')
  const [pasteLanguage, setPasteLanguage] = useState('')

  const [error, setError] = useState('')
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await repoApi.list()
      setRepos(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const addRepo = async (e) => {
    e.preventDefault()
    setError('')
    setAdding(true)
    try {
      await repoApi.add({ githubUrl, language })
      setGithubUrl('')
      setLanguage('')
      await load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add repository')
    } finally {
      setAdding(false)
    }
  }

  const submitPaste = async (e) => {
    e.preventDefault()
    setError('')
    setAdding(true)
    try {
      const { data } = await reviewApi.createFromPaste({
        code: pasteCode,
        language: pasteLanguage,
      })
      // Paste reviews run and complete immediately - jump straight to the results.
      navigate(`/reviews/${data.id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Could not run review')
    } finally {
      setAdding(false)
    }
  }

  const removeRepo = async (id) => {
    await repoApi.remove(id)
    await load()
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-display font-bold text-white mb-1">Your repositories</h1>
      <p className="text-muted text-sm mb-6">Connect a public GitHub repo, or paste a code snippet directly.</p>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => { setMode('github'); setError('') }}
          className={`px-4 py-1.5 rounded text-sm font-display transition ${
            mode === 'github' ? 'bg-accent text-ink font-bold' : 'border border-line text-muted hover:text-white'
          }`}
        >
          GitHub URL
        </button>
        <button
          onClick={() => { setMode('paste'); setError('') }}
          className={`px-4 py-1.5 rounded text-sm font-display transition ${
            mode === 'paste' ? 'bg-accent text-ink font-bold' : 'border border-line text-muted hover:text-white'
          }`}
        >
          Paste code
        </button>
      </div>

      {mode === 'github' ? (
        <form onSubmit={addRepo} className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            required
            placeholder="https://github.com/owner/repo"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="flex-1 bg-panel border border-line rounded px-3 py-2 text-white focus:outline-none focus:border-accent"
          />
          <select value={language} onChange={(e) => setLanguage(e.target.value)}
            className="bg-panel border border-line rounded px-3 py-2 text-white focus:outline-none focus:border-accent">
            <option value="">Auto-detect language</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="cpp">C++</option>
          </select>
          <button disabled={adding} type="submit"
            className="px-5 py-2 rounded bg-accent text-ink font-display font-bold hover:bg-accent/90 transition disabled:opacity-50 whitespace-nowrap">
            {adding ? 'Adding…' : '+ Add repo'}
          </button>
        </form>
      ) : (
        <form onSubmit={submitPaste} className="mb-4 space-y-3">
          <textarea
            required
            placeholder="Paste your code here… language is detected automatically."
            value={pasteCode}
            onChange={(e) => setPasteCode(e.target.value)}
            rows={12}
            className="w-full bg-panel border border-line rounded px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-accent"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-muted text-xs">Language:</label>
              <select value={pasteLanguage} onChange={(e) => setPasteLanguage(e.target.value)}
                className="bg-panel border border-line rounded px-2 py-1 text-white text-sm focus:outline-none focus:border-accent">
                <option value="">Auto-detect</option>
                <option value="java">Java</option>
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="cpp">C++</option>
              </select>
              <span className="text-muted text-xs">(only needed to override detection)</span>
            </div>
          </div>
          <button disabled={adding} type="submit"
            className="px-5 py-2 rounded bg-accent text-ink font-display font-bold hover:bg-accent/90 transition disabled:opacity-50">
            {adding ? 'Running review…' : '▶ Run review'}
          </button>
        </form>
      )}

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : repos.length === 0 ? (
        <div className="border border-dashed border-line rounded-lg p-10 text-center text-muted">
          No repositories yet. Add one above to run your first review.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {repos.map((repo) => (
            <div key={repo.id} className="border border-line rounded-lg bg-panel p-4 flex flex-col">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-bold text-white">{repo.repositoryName}</h3>
                  <p className="text-muted text-xs mt-0.5">{repo.language || 'auto-detect'}</p>
                </div>
                <button onClick={() => removeRepo(repo.id)} className="text-muted hover:text-danger text-xs">
                  Remove
                </button>
              </div>
              {repo.githubUrl ? (
                <a href={repo.githubUrl} target="_blank" rel="noreferrer" className="text-accent2 text-xs mt-2 truncate">
                  {repo.githubUrl}
                </a>
              ) : (
                <p className="text-muted text-xs mt-2 italic">Pasted snippet</p>
              )}
              <Link to={`/repositories/${repo.id}`}
                className="mt-4 text-center py-2 rounded border border-line text-white hover:border-accent transition text-sm">
                View reviews →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
