"""Detect a language from file extension or lightweight content heuristics."""
import re
EXTENSION_MAP={".java":"java",".py":"python",".js":"javascript",".jsx":"javascript",".ts":"typescript",".tsx":"typescript",".cpp":"cpp",".cc":"cpp",".c":"c",".go":"go"}
CONTENT_PATTERNS={"java":[r"\bpublic\s+(final\s+)?class\b",r"\bpublic\s+static\s+void\s+main\b",r"\bSystem\.out\.println\b",r"^\s*import\s+java\.",r";\s*$"],"python":[r"^\s*def\s+\w+\s*\(.*\)\s*:",r"^\s*import\s+\w+\s*$",r"\bself\b",r"^\s*elif\b",r":\s*$"],"javascript":[r"\bfunction\s+\w+\s*\(",r"=>",r"\bconst\s+\w+\s*=",r"\blet\s+\w+\s*=",r"\bconsole\.log\b",r"\brequire\("],"typescript":[r":\s*(string|number|boolean|any)\b",r"\binterface\s+\w+",r"\bexport\s+type\b"],"cpp":[r"#include\s*<",r"\bstd::",r"\bcout\s*<<",r"\bint\s+main\s*\("],"c":[r"#include\s*<stdio\.h>",r"\bprintf\s*\(",r"\bint\s+main\s*\("],"go":[r"^\s*package\s+main",r"\bfunc\s+main\s*\(",r"\bfmt\.Println\b"]}
def detect_language_from_content(code: str) -> str:
    scores={lang:sum(1 for pattern in patterns if re.search(pattern,code,re.MULTILINE)) for lang,patterns in CONTENT_PATTERNS.items()}
    best=max(scores,key=scores.get)
    return best if scores[best]>0 else "unknown"
def detect_language(file_path: str, content: str=None) -> str:
    for ext,lang in EXTENSION_MAP.items():
        if file_path.endswith(ext): return lang
    return detect_language_from_content(content) if content else "unknown"
