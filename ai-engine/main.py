"""FastAPI AI Code Review Engine: static analysis, optional LLM explanations, and scoring."""
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
from analyzers.language_detector import detect_language
from analyzers.static_analyzer import run_static_analysis
from analyzers.llm_client import explain_issues_with_llm
from analyzers.scoring import compute_scores

app = FastAPI(title="AI Code Review Engine", version="1.0.0")
class AnalyzeRequest(BaseModel):
    files: Dict[str, str]
    language: Optional[str] = None
class Issue(BaseModel):
    fileName: str
    lineNumber: Optional[int] = None
    severity: str
    category: str
    description: str
    suggestion: str
    correctedCode: Optional[str] = None
    complexity: Optional[str] = None
    confidence: Optional[float] = None
class AnalyzeResponse(BaseModel):
    issues: List[Issue]
    score: float
    bugs: int
    securityIssues: int
    codeSmells: int
    complexityScore: float
    maintainabilityScore: float

@app.get("/health")
def health(): return {"status": "ok"}

@app.post("/api/analyze", response_model=AnalyzeResponse)
def analyze(request: AnalyzeRequest):
    if not request.files: raise HTTPException(status_code=400, detail="No files provided")
    files_with_lang = {path: (request.language or detect_language(path, content=content)) for path, content in request.files.items()}
    static_findings = run_static_analysis(request.files, files_with_lang)
    enriched = explain_issues_with_llm(request.files, static_findings)
    severity_rank = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}
    enriched.sort(key=lambda i: (severity_rank.get(i["severity"], 4), -(i.get("confidence") or 0)))
    return AnalyzeResponse(issues=[Issue(**i) for i in enriched], **compute_scores(enriched))

@app.post("/api/explain")
def explain_single_issue(issue: Dict):
    from analyzers.llm_client import explain_single
    return explain_single(issue)

@app.post("/api/optimize")
def optimize_snippet(payload: Dict):
    from analyzers.llm_client import optimize_code
    return optimize_code(payload.get("code", ""), payload.get("language", ""))

@app.post("/api/generate-tests")
def generate_tests(payload: Dict):
    from analyzers.llm_client import generate_tests as gen_tests
    return gen_tests(payload.get("code", ""), payload.get("language", ""))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
