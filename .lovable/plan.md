

## Plan: Add Bio & Contact Strip Below Hero

Inspired by the Simen Øvergaard reference, add a horizontal strip below the animated "JAN KHÜR" logo on the landing page. It will contain a short bio on the left and contact info on the right, matching the site's existing editorial style.

### Layout

```text
┌──────────────────────────────────────────────────────────────────┐
│  Jan Khür● Photographer working between ...          CONTACT    │
│  editorial○, commercial○ and independent○ works.    Instagram →  │
│                                                      Email →     │
└──────────────────────────────────────────────────────────────────┘
```

- **Left column (~60%)**: Short bio in serif font, similar tone to the reference — mention genres (editorial, commercial, independent works), based in Oslo.
- **Right column**: "CONTACT" header in uppercase sans-serif tracking, with Instagram and Email links using arrow indicators.
- No "Agent" section per user's request.

### Technical Details

**File: `src/pages/Index.tsx`**
- Add a new `motion.div` section between the hero name and the `<main>` image feed.
- Use a responsive grid: `grid grid-cols-1 md:grid-cols-[1fr_auto]` with the same horizontal padding as the hero (`px-6 md:px-10`).
- Fade in with the same `fadeIn` animation pattern.
- Bio text uses `font-serif text-lg md:text-xl`, contact labels use the existing `nav-link` style.
- Links point to the real Instagram (`instagram.com/jankhur`) and email (`jankhur@gmail.com`) already used on the About page.

No new files or dependencies needed.

