"""Static checks: Python AST rules and regex heuristics for other languages."""
import ast
import re
from typing import Dict, List

def run_static_analysis(files: Dict[str,str], languages: Dict[str,str]) -> List[dict]:
    findings=[]
    for path,content in files.items():
        findings.extend(_analyze_python(path,content) if languages.get(path)=="python" else _analyze_generic(path,content))
    return findings

def _line(content: str, number: int) -> str:
    lines=content.splitlines()
    return lines[number-1].strip() if 1<=number<=len(lines) else ""

def _analyze_python(path: str, content: str) -> List[dict]:
    findings=[]
    try: tree=ast.parse(content)
    except SyntaxError as e: return [{"fileName":path,"lineNumber":e.lineno or 1,"category":"BUG","hint":f"Syntax error: {e.msg}","snippet":_line(content,e.lineno or 1)}]
    for node in ast.walk(tree):
        if isinstance(node,ast.ExceptHandler) and node.type is None:
            findings.append({"fileName":path,"lineNumber":node.lineno,"category":"CODE_SMELL","hint":"Bare except clause swallows all exceptions","snippet":_line(content,node.lineno)})
        if isinstance(node,ast.Call) and isinstance(node.func,ast.Name) and node.func.id in ("eval","exec"):
            findings.append({"fileName":path,"lineNumber":node.lineno,"category":"SECURITY","hint":f"Use of {node.func.id}() can allow arbitrary code execution","snippet":_line(content,node.lineno)})
        if isinstance(node,ast.FunctionDef):
            for default in node.args.defaults:
                if isinstance(default,(ast.List,ast.Dict,ast.Set)): findings.append({"fileName":path,"lineNumber":node.lineno,"category":"BUG","hint":"Mutable default argument","snippet":_line(content,node.lineno)})
        if isinstance(node,(ast.For,ast.While)) and any(child is not node and isinstance(child,(ast.For,ast.While)) for child in ast.walk(node)):
            findings.append({"fileName":path,"lineNumber":node.lineno,"category":"PERFORMANCE","hint":"Nested loop, check time complexity","snippet":_line(content,node.lineno)})
        if isinstance(node,ast.BinOp) and isinstance(node.op,(ast.Div,ast.FloorDiv,ast.Mod)) and isinstance(node.right,ast.Constant) and isinstance(node.right.value,(int,float,complex)) and node.right.value==0:
            findings.append({"fileName":path,"lineNumber":node.lineno,"category":"BUG","hint":"Division/modulo by zero will cause a runtime error","snippet":_line(content,node.lineno)})
    return findings

_PATTERNS=[(r"\bcatch\s*\([^)]*\)\s*\{\s*\}","CODE_SMELL","Empty catch block swallows exceptions"),(r"==\s*null|null\s*==","BUG","Consider null-safety checks"),(r"SELECT\s+.*\+\s*\w+|String\s+query\s*=.*\+","SECURITY","Possible SQL injection via string concatenation"),(r"System\.out\.println|console\.log","CODE_SMELL","Debug print left in code"),(r"TODO|FIXME","DOCUMENTATION","Unresolved TODO/FIXME left in code"),(r"\.get\w*\(\)\.get\w*\(\)","BUG","Chained calls may risk a null pointer")]
def _analyze_generic(path: str, content: str) -> List[dict]:
    findings=[]
    for i,line in enumerate(content.splitlines(),1):
        clean=re.sub(r"//.*$","",line)
        for pattern,category,hint in _PATTERNS:
            if re.search(pattern,clean): findings.append({"fileName":path,"lineNumber":i,"category":category,"hint":hint,"snippet":clean.strip()})
    return _deduplicate(findings)
def _deduplicate(findings: List[dict]) -> List[dict]:
    seen=set(); result=[]
    for f in findings:
        key=(f.get("fileName"),f.get("lineNumber"),f.get("category"),f.get("hint"))
        if key not in seen: seen.add(key); result.append(f)
    return result
