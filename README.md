# DJ CHANNELL — djchannell.com

A rebuild of [djchannell.com](https://www.djchannell.com/). Static HTML/CSS/JS — no build
step, no framework, no dependencies. Deploys to Vercel as-is.

```
index.html             the main page (one scroll, everything on it)
weddings.html          → /weddings — the wedding DJ landing page
360-photo-booth.html   → /360-photo-booth — the booth landing page
song-requests.html     → /song-requests — request tool for booked couples
assets/css/site.css    all styles
assets/js/site.js      all behaviour (nav, reveals, accordions, lightbox, video)
assets/img/            34 images: his photos re-encoded, plus video thumbnails
assets/video/          3 clips pulled from the old Wix site
robots.txt             allows search AND named AI crawlers
llms.txt               plain-text brief written for answer engines
sitemap.xml            the three indexable pages
vercel.json            caching, security headers, 301s from the old Wix URLs
MIGRATION.md           how to move DNS off Wix without losing rankings
```

**The two sub-pages exist for a specific reason.** `/weddingpackages` and
`/360photoboothrental` were separately indexed on the old site with their own
rankings. Redirecting them to homepage anchors would have collapsed four ranking
URLs into one, because `/#weddings` is just `/` to a search engine. They get real
pages instead. See `MIGRATION.md`.

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

1. **The wedding video is missing.** The old site had a clip on the weddings page
   (`99d02d_01fd043a…`) that Wix now returns 403 for, so it isn't in
   `assets/video/`. If he still has the file, add it and put it in `#showreel`.
2. **`booth-vertical.mp4` has Instagram Story UI burned in** ("Fuuun wedding over
   the weekend"). It's authentic and it now sits in the Weddings image stack
   where that reads fine, but a clean export would look sharper.
3. **Instagram** is linked as `@djchannell`. Worth confirming that's current.
4. **Email address** — the old site had none, so contact routes through his
   HoneyBook quote form, HoneyBook scheduler, and phone number.

## What the résumé section claims, and why it's safe to claim it

Three names get a card of their own, and each one is backed by something in the
frame rather than by assertion:

- **Ice Cube** — his own photo, standing with him, holding a signed "You Can Do
  It" pressing.
- **Lil Jon** — the festival running order, rebuilt as live text so it's legible:
  `5:45pm DJ Channell` sits one slot under `6:45pm Lil Jon`. (The original poster
  image is still in `assets/img/liljon-lineup.jpg` if you ever want it back.)
- **Nappy Roots** — his own photo with the group, and he's in their shirt.

The other 46 names scroll past as typographic cards. **No press or promo photos
of any artist are used anywhere on this site** — licensing a celebrity's
publicity still for a commercial services page is a fight nobody needs. Two more
of his photos are in the scroll as neutral tiles ("Packed house", "On the
decks") because the people in them couldn't be identified with confidence, and
captioning a face with a name you're guessing at is worse than not captioning it.

If Kyle has more photos of himself with artists on the list, they drop straight
into `.rollwall` as `.rollphoto` tiles, or become a fourth `.bill` card.

## The 360 booth videos

The three clips in that section are his own YouTube uploads, pulled off the old
360 page:

| Video | ID |
|---|---|
| 360 Video/Photo Booth. NOCO 360 Photos | `jaCkYUIauNo` |
| Black Tie 360 Event | `7f0W9pak2XM` |
| Wedding fun with NoCo 360 Photos! | `pqyzmyGLuAg` |

They load as **facades** — the thumbnails are ordinary local JPEGs and no
YouTube code is fetched until someone actually presses play, at which point the
embed opens in a modal against `youtube-nocookie.com`. Closing the modal empties
the iframe, which is what actually stops playback. To swap a video, change the
`data-yt` attribute and drop a new `assets/img/yt-booth-*.jpg` thumbnail in.

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
- **Reviews appear four times** — a three-quote ribbon under the hero, a pull
  quote inside Weddings, one inside the 360 booth section, and the full wall
  after the résumé. On screens under 900px the full wall shows four cards behind
  a "Show all 10" button; ten cards in one column ran 4,500px otherwise.
- **Grid children carry `min-width:0`.** Grid items default to `min-width:auto`,
  so the `<video>` inside the wedding stack's phone frame pushed its track 70px
  wider than the column it lived in. If you add media to a grid, pin it.
- **The hero video is skipped on phones and for `prefers-reduced-motion`** — the
  poster image carries it instead. The `<video>` element is kept rather than
  removed, so widening a narrow window still loads it.
