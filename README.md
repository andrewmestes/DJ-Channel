# DJ CHANNELL — djchannell.com

A rebuild of [djchannell.com](https://www.djchannell.com/). Static HTML/CSS/JS — no build
step, no framework, no dependencies. Deploys to Vercel as-is.

```
index.html            the site (one page, everything on it)
song-requests.html    request form for already-booked couples
assets/css/site.css   all styles
assets/js/site.js     all behaviour (nav, reveals, accordions, lightbox)
assets/img/           30 photos pulled from the old Wix site, re-encoded
assets/video/         2 clips pulled from the old Wix site
vercel.json           caching, security headers, redirects from the old Wix URLs
```

## Running it locally

There is no dev server to install. Any static server works:

```bash
python3 -m http.server 4311
```

Then open <http://localhost:4311>.

## The one rule about copy

**Kyle's words are Kyle's words.** Every sentence that came off the old site is
reproduced verbatim, typos and all — including "DJ CHANNEL LLC" (one L) in the
weddings paragraph and "Grives" in the artist list. Those are his. If you edit
them, that's a decision someone should make on purpose, not a cleanup pass.

What is *added* (written for this rebuild, not from the old site): section
headlines, the three "reasons" cards under Weddings, FAQ answers for booking /
service area / requests / genres, and short connective phrases. All of it is
descriptive of things he already says — none of it invents a claim.

## Where every number comes from

| Claim on the page | Source |
|---|---|
| 5.0 rating, 89 reviews | Google Business Profile |
| 15+ years, full-time, open format | his own bio copy |
| Brands: Red Rocks, Red Bull, X-Games, GoPro Mountain Games, US Burton Open, Pikes Peak Fan Fest | his own bio copy |
| Artist list (48 names) | his own "Artists I Have Opened For" list |
| 360 booth inclusions, FAQ, $150 retainer, 12'x12', 7'11" | his own 360 page, verbatim |
| (970) 732-0570 · 931 E Prospect Rd | Google Business Profile |

The reviews section quotes **real, attributed Google reviews**. Don't add
testimonials that aren't real ones — the whole section works because the names
are checkable.

There is deliberately **no pricing on the site.** Zola lists him at "ceremony
from $450 / reception from $1,800", but that's a third-party listing and prices
go stale. Add it only if Kyle confirms the current numbers.

## Things that still need Kyle

1. **360 booth footage.** He has no 360-booth video anywhere on the old site — the
   clip currently in the phone frame (`assets/video/booth-vertical.mp4`) is a
   wedding dance floor, not the booth. It reads fine as context, but a real
   spinning-booth clip belongs there. Drop a vertical MP4 in at the same path.
2. **The wedding video is missing.** The old site had a third clip
   (`99d02d_01fd043a…`) on the weddings page. Wix returns 403 for it now, so it
   isn't in `assets/video/`. If he still has the file, add it and put it in the
   `#showreel` section.
3. **`booth-vertical.mp4` has Instagram Story UI burned in** ("Fuuun wedding
   over the weekend"). Authentic, but a clean export would look sharper.
4. **Instagram** is linked as `@djchannell`. Worth confirming that's current.
5. **Email address** — the old site had none, so the site routes contact through
   his HoneyBook quote form, HoneyBook scheduler, and phone number.

## Where the booking links go

Both are Kyle's existing HoneyBook endpoints, unchanged:

- Quote → `honeybook.com/widget/djchannellllc_243216/…`
- Consultation → `djchannell.hbportal.co/schedule/…`

The song-requests page has **no backend**. It builds the list client-side and
hands it off via `sms:` to (970) 732-0570 or the clipboard. Nothing is stored.
If a real inbox is wanted later, point the form at Formspree or a Vercel
function — the list is already assembled in `buildList()`.

## Old URLs

`vercel.json` 301s the four Wix paths (`/weddingpackages`, `/360photoboothrental`,
`/quote`, `/weddingrequests`) to their new anchors, so existing links and search
results don't break when DNS moves.

## Notes on the build

- **Palette is his.** The magenta / violet / blue was sampled out of his own
  stage-lighting photos, not picked off a wheel.
- **`assets/video/hero-hd.mp4` is gitignored** (29 MB). The site uses the 6 MB
  480p `hero.mp4`; the HD copy is kept locally as a source.
- **No count-up animation on the stat numbers.** A counter animating from zero
  shows "0 REVIEWS" and "1 YEARS" for the first second, and those are the exact
  numbers this page is asking people to trust.
- **The hero video is skipped on phones and for `prefers-reduced-motion`** — the
  poster image carries it instead. The `<video>` element is kept rather than
  removed, so widening a narrow window still loads it.
