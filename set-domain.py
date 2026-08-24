#!/usr/bin/env python3
"""Point the social-preview tags at whichever domain is actually serving the site.

    python3 set-domain.py preview   # dj-channel.vercel.app  (before DNS moves)
    python3 set-domain.py live      # www.djchannell.com     (after DNS moves)

Why this exists: og:image and og:url have to resolve for a link preview to
render. While djchannell.com still serves Wix, pointing them there gives a
blank card in iMessage — or worse, a scraper that follows og:url and previews
the old Wix site instead.

<link rel="canonical"> is deliberately NOT touched. It always points at
www.djchannell.com so Google consolidates on the real domain and never indexes
the staging URL.
"""
import sys, re, glob, pathlib

PREVIEW = 'https://dj-channel.vercel.app'
LIVE    = 'https://www.djchannell.com'

mode = (sys.argv[1] if len(sys.argv) > 1 else '').lower()
if mode not in ('preview', 'live'):
    sys.exit(__doc__)
base = PREVIEW if mode == 'preview' else LIVE
other = LIVE if mode == 'preview' else PREVIEW

PATHS = {'index.html': '/', 'weddings.html': '/weddings',
         '360-photo-booth.html': '/360-photo-booth',
         'song-requests.html': '/song-requests'}

for f in sorted(glob.glob('*.html')):
    p = pathlib.Path(f); s = p.read_text(encoding='utf-8'); before = s
    img = base + '/assets/img/og-cover.jpg'
    url = base + PATHS.get(f, '/')
    s = re.sub(r'(<meta property="og:image" content=")[^"]*(")', r'\g<1>%s\g<2>' % img, s)
    s = re.sub(r'(<meta name="twitter:image" content=")[^"]*(")', r'\g<1>%s\g<2>' % img, s)
    s = re.sub(r'(<meta property="og:url" content=")[^"]*(")', r'\g<1>%s\g<2>' % url, s)
    if s != before:
        p.write_text(s, encoding='utf-8'); print('%-24s -> %s' % (f, base))
print('\nSocial tags now point at %s (canonical still %s)' % (base, LIVE))
