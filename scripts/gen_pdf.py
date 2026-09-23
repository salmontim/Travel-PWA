# -*- coding: utf-8 -*-
"""
gen_pdf.py — 將行程 Markdown 轉成 PDF

用法（在專案根目錄）：
    .venv\\Scripts\\python.exe scripts\\gen_pdf.py
    .venv\\Scripts\\python.exe scripts\\gen_pdf.py <來源.md> [輸出.pdf]

預設來源為「jeju_7day_itinerary_v2.md」（現行順時針優化版，即 PWA js/data.js 對應版本）；
舊版逆時針行程可用參數指定：scripts\\gen_pdf.py jeju_7day_itinerary.md

原理：
    1. 用 Python markdown 庫把 MD 轉成 HTML（含表格、引用等）
    2. 呼叫系統 Edge/Chrome 的 headless --print-to-pdf 輸出 PDF
   （Edge/Chrome 內建，無需額外安裝 Chromium）

依賴：pip install markdown
"""

import re
import shutil
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
MD = ROOT / "jeju_7day_itinerary_v2.md"
PDF = ROOT / "jeju_7day_itinerary.pdf"
HTML_TMP = ROOT / "_itinerary_tmp.html"

# 候選瀏覽器（優先 Edge，其次 Chrome）
BROWSERS = [
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
]

CSS = """
@page { size: A4; margin: 1.5cm 1.3cm; }
* { box-sizing: border-box; }
body {
  font-family: "Microsoft JhengHei", "PingFang TC", "Noto Sans TC",
               "Malgun Gothic", "Apple SD Gothic Neo", sans-serif;
  color: #2e2c28;
  line-height: 1.62;
  font-size: 10.5pt;
  word-wrap: break-word;
}
h1 { font-size: 19pt; color: #2e2c28; border-bottom: 2px solid #7d8b6f; padding-bottom: 6px; margin: 0 0 0.6em; }
h2 { font-size: 14.5pt; color: #5f6f54; border-bottom: 1px solid #e5e2d9; padding-bottom: 4px; margin: 1.5em 0 0.5em; }
h3 { font-size: 12pt; color: #4a5568; margin: 1.3em 0 0.4em; }
p { margin: 0.4em 0; }
table { border-collapse: collapse; width: 100%; margin: 0.7em 0; font-size: 8.6pt; }
th, td { border: 1px solid #d9d5ca; padding: 4px 7px; text-align: left; vertical-align: top; }
th { background: #efede4; font-weight: 600; }
tr:nth-child(even) td { background: #faf9f4; }
a { color: #4a5f8a; text-decoration: none; word-break: break-all; }
blockquote {
  border-left: 4px solid #7d8b6f; margin: 0.7em 0;
  padding: 6px 12px; background: #f4f2ea; color: #5a574f;
}
code { background: #efede6; padding: 1px 4px; border-radius: 3px; font-size: 8.8pt; font-family: Consolas, monospace; }
ul, ol { padding-left: 1.5em; margin: 0.4em 0; }
li { margin: 2px 0; }
hr { border: none; border-top: 1px solid #e5e2d9; margin: 1.2em 0; }
strong { color: #2e2c28; }
"""


def main() -> None:
    import markdown  # 延遲 import，方便提示缺少依賴

    md_path = Path(sys.argv[1]) if len(sys.argv) > 1 else MD
    if not md_path.is_absolute():
        md_path = ROOT / md_path
    pdf_path = Path(sys.argv[2]) if len(sys.argv) > 2 else PDF
    if not pdf_path.is_absolute():
        pdf_path = ROOT / pdf_path

    if not md_path.exists():
        print(f"找不到 {md_path}")
        sys.exit(1)

    md_text = md_path.read_text(encoding="utf-8")

    title_match = re.search(r'^title:\s*"?([^"\n]+)"?\s*$', md_text, re.MULTILINE)
    doc_title = title_match.group(1).strip() if title_match else md_path.stem

    body = markdown.markdown(
        md_text,
        extensions=["tables", "fenced_code", "sane_lists", "meta"],
        output_format="html5",
    )

    html = (
        '<!DOCTYPE html>\n<html lang="zh-Hant">\n<head>\n'
        '<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
        f"<title>{doc_title}</title>\n<style>{CSS}</style>\n</head>\n"
        f"<body>{body}</body>\n</html>\n"
    )
    HTML_TMP.write_text(html, encoding="utf-8")

    browser = next((b for b in BROWSERS if Path(b).exists()), None)
    if not browser:
        print("找不到 Edge/Chrome，無法生成 PDF")
        sys.exit(1)

    # 先輸出到英文臨時檔，避免 headless 對中文路徑處理不一致，再改名
    tmp_pdf = ROOT / "_itinerary_tmp.pdf"
    tmp_profile = ROOT / "_edge_profile"
    subprocess.run(
        [
            browser,
            "--headless",
            "--disable-gpu",
            "--no-pdf-header-footer",
            f"--user-data-dir={tmp_profile}",
            "--print-to-pdf=" + str(tmp_pdf),
            str(HTML_TMP),
        ],
        check=True,
    )

    # Edge 已有實例時 headless 可能異步生成，輪詢等待 PDF 寫出
    for _ in range(40):
        if tmp_pdf.exists() and tmp_pdf.stat().st_size > 0:
            break
        time.sleep(0.3)

    if not tmp_pdf.exists() or tmp_pdf.stat().st_size == 0:
        print("PDF 未成功生成，請重試")
        sys.exit(1)

    # 覆寫目標（若被瀏覽器預覽鎖住，先刪除再移入）
    try:
        shutil.move(str(tmp_pdf), str(pdf_path))
    except PermissionError:
        pdf_path.unlink(missing_ok=True)
        shutil.move(str(tmp_pdf), str(pdf_path))

    HTML_TMP.unlink(missing_ok=True)
    shutil.rmtree(tmp_profile, ignore_errors=True)
    print(f"✅ 來源：{md_path.name} → PDF 已生成：{pdf_path}")


if __name__ == "__main__":
    main()
