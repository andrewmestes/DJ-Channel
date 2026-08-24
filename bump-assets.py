#!/usr/bin/env python3
"""Stamp a content hash onto the site.css / site.js links in every HTML file.

Browsers key their cache on the full URL, so changing ?v= is the only thing that
reliably reaches someone who already holds a cached copy. The Cache-Control
headers in vercel.json make forgetting to run this harmless, not fatal — but run
it after editing CSS or JS anyway.

    python3 bump-assets.py
"""
import hashlib, glob, re, pathlib

def h(p):
    return hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()[:8]

css, js = h('assets/css/site.css'), h('assets/js/site.js')
for f in glob.glob('*.html'):
    s = pathlib.Path(f).read_text(encoding='utf-8')
    before = s
    s = re.sub(r'(href="assets/css/site\.css)(\?v=[0-9a-f]+)?"', r'\1?v=%s"' % css, s)
    s = re.sub(r'(src="assets/js/site\.js)(\?v=[0-9a-f]+)?"',   r'\1?v=%s"'  % js,  s)
    if s != before:
        pathlib.Path(f).write_text(s, encoding='utf-8')
        print('stamped', f)
print('css=%s  js=%s' % (css, js))
