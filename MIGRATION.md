# Moving djchannell.com off Wix without losing rankings

The short version: **rankings are attached to the domain, not to Wix.** As long
as `djchannell.com` keeps pointing at a site that answers the same URLs with the
same-or-better content, Google carries the authority across. Sites lose traffic
in a migration for three reasons, and all three are avoidable:

1. Old URLs start 404-ing instead of redirecting.
2. The new site drops the content that was ranking.
3. Nobody tells Search Console, so recrawling takes months.

Here's what's already handled, and what a human has to do on cutover day.

---

## Already handled in this repo

### Every old Wix URL 301s to a real page

The old site had five indexed URLs. All five resolve:

| Old Wix URL | Now | Why |
|---|---|---|
| `/` | `/` | unchanged |
| `/weddingpackages` | 301 → `/weddings` | real page, not an anchor |
| `/360photoboothrental` | 301 → `/360-photo-booth` | real page, not an anchor |
| `/quote` | 301 → `/#book` | thin page; booking lives on the homepage |
| `/weddingrequests` | 301 → `/song-requests` | same tool, same job |

`/weddingpackages` and `/360photoboothrental` get **real standalone pages**, not
homepage anchors. This matters more than it sounds: a URL ending in `/#weddings`
is just `/` as far as Google is concerned, so redirecting both old pages to
anchors would have quietly merged four ranking URLs into one. Two pages that
each rank for their own terms is worth more than one page that ranks for both.

301s pass essentially full authority, and there are **no redirect chains** — every
old URL reaches its destination in one hop.

### Content that was ranking is all still here

Every sentence from the old site is on the new one, verbatim. The 360 booth FAQ,
the wedding paragraph, the bio, the artist list — nothing was cut. The pages that
carried each block still carry it:

- wedding copy → `/weddings` **and** the homepage
- full 360 FAQ → `/360-photo-booth`
- bio, artist list, reviews → homepage

The homepage FAQ deliberately does **not** repeat the four booth questions —
those live on `/360-photo-booth` so the two pages aren't competing for the same
query.

### Technical bits that are done

- `sitemap.xml` listing all three indexable pages
- `robots.txt` allowing everything except the song-request tool
- Canonical tag on every page, all pointing at `https://www.djchannell.com/...`
- Unique title + meta description per page, all inside Google's truncation limits
- One `<h1>` per page, carrying the service + the city
- Alt text on all 62 images
- `geo.*` meta and lat/long matching the Google Business Profile
- Structured data (see below)
- Fast: static files, immutable asset caching, no framework, no render-blocking JS

---

## What a human has to do

### One thing that looks broken until you switch, and isn't

`og:image` on every page points at `https://www.djchannell.com/assets/img/og-cover.jpg`
— the final domain, which today still serves the Wix site. So **if you paste the
`dj-channel.vercel.app` link into iMessage or Slack right now, the preview card
will have no image.** That's expected. The tag is written for where the site is
going, not for the temporary preview host, and it starts working the moment DNS
moves. Nothing to change.

If you need a good-looking preview before cutover, temporarily swap the four
`og:image` tags to the `dj-channel.vercel.app` URL and swap them back on the day.

### Before you switch DNS

1. **Point the domain at Vercel.** In the Vercel project → Settings → Domains,
   add `djchannell.com` and `www.djchannell.com`. Vercel gives you the DNS
   records. Pick one as primary (recommend `www`, since that's what's canonical
   in the markup) and let the other 301 to it.
2. **Lower the DNS TTL** on the existing records to 300 seconds a day ahead, so
   the switch propagates in minutes instead of hours.
3. **Do not cancel Wix until DNS has fully propagated.** If Wix goes dark while
   DNS still points there, the site 404s for real users and for Googlebot.

### The day you switch

4. **Verify the domain in [Google Search Console](https://search.google.com/search-console)**
   as a Domain property (not a URL-prefix property). If Kyle already has one from
   the Wix site, keep it — the history is worth having.
5. **Submit the sitemap:** `https://www.djchannell.com/sitemap.xml`
6. **Use "Inspect URL" → "Request indexing"** on all three pages. This is the
   single fastest way to get the new content crawled.
7. **Spot-check the redirects** once DNS is live:
   ```bash
   curl -sI https://www.djchannell.com/weddingpackages | grep -i location
   ```
   Each should return `301` and a `location` header, in one hop.

### The week after

8. **Watch Search Console → Pages** for anything reported as "Not found (404)"
   or "Redirect error". If a URL you forgot about shows up, add a redirect to
   `vercel.json`.
9. **Update the Google Business Profile** website link if it points anywhere
   other than `https://www.djchannell.com/`. The GBP is where most of his local
   traffic actually comes from — it matters more than the site's own rankings.
10. **Leave it alone for 4–6 weeks.** Rankings wobble for a couple of weeks after
    any migration and then settle. Changing things reactively during that window
    makes it harder to tell what worked.

---

## What's been done for AI answer engines

Being cited by ChatGPT, Claude, Perplexity and Google's AI Overviews works
differently from ranking. Those systems need to be able to (a) fetch the page,
(b) identify the business unambiguously, and (c) lift a clean factual sentence.
All three are set up:

**They're allowed in.** `robots.txt` names GPTBot, OAI-SearchBot, ChatGPT-User,
ClaudeBot, anthropic-ai, PerplexityBot, Google-Extended, Applebot-Extended,
CCBot and meta-externalagent, and allows each one. A lot of sites block these
by accident via a blanket rule; this one doesn't.

**`llms.txt`** at the site root is a plain-text brief written for machines — who
he is, where he works, what he sells, what the 360 booth includes, the artist
list, and the booking links. It also states explicitly that pricing is not
published, so an assistant doesn't invent a number.

**Structured data** on every page:

| Page | Schema |
|---|---|
| `/` | LocalBusiness (+ AggregateRating, 4 Reviews, founder, slogan), Person, FAQPage, WebSite |
| `/weddings` | Service, FAQPage, BreadcrumbList |
| `/360-photo-booth` | Service, FAQPage, 3 × VideoObject, BreadcrumbList |

**Answer-shaped content.** The FAQ blocks are real questions with self-contained
answers — the format these systems extract most reliably. Questions like "What
does a wedding DJ cost in Northern Colorado?" and "What is required to rent a 360
Photo Booth?" are written to be liftable as a whole.

**Entity consistency.** Name, address and phone match the Google Business
Profile character for character. `NoCo 360 Photos` is stated as the same business
so the two names resolve to one entity.

---

## Things worth doing that nobody has done yet

These aren't blockers, but they're the highest-value next moves:

- **Ask happy couples for Google reviews by name.** 89 reviews at 5.0 is his
  single strongest asset and it feeds both local rankings and AI answers. It is
  worth more than anything else on this list.
- **Get the Google Business Profile fully filled out** — services, service area,
  photos, and the booking link. Most local searches never reach the website.
- **Add pricing** once Kyle is comfortable publishing a starting number.
  "Starting at $X" wins featured snippets and is one of the most common questions
  an AI assistant gets asked about a vendor. Right now the honest answer is
  "quoted after a consultation," which is what both the site and `llms.txt` say.
- **Get listed consistently** on The Knot, WeddingWire and Zola with the same
  NAP. Citation consistency is a real local-ranking factor.
