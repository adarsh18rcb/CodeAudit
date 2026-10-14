"""Aggregate individual issues into review-level metrics + an overall score."""
from typing import List, Dict

def compute_scores(issues: List[dict]) -> Dict:
    bugs=sum(1 for i in issues if i["category"]=="BUG")
    security=sum(1 for i in issues if i["category"]=="SECURITY")
    smells=sum(1 for i in issues if i["category"]=="CODE_SMELL")
    weights={"CRITICAL":10,"HIGH":6,"MEDIUM":3,"LOW":1}
    penalty=sum(weights.get(i["severity"],1) for i in issues)
    score=max(0.0,100.0-penalty)
    complexity=min(10.0,1.0+0.5*sum(1 for i in issues if i["category"]=="PERFORMANCE"))
    maintainability=max(0.0,10.0-0.4*(smells+bugs))
    return {"score":round(score,1),"bugs":bugs,"securityIssues":security,"codeSmells":smells,"complexityScore":round(complexity,1),"maintainabilityScore":round(maintainability,1)}
