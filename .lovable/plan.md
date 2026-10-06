# Flexible header and breadcrumb controls

## What will change
- Make breadcrumb case reliably follow its own **As typed / All capitals** setting, independent of the logo.
- Add three saved logo placements: **top-left tight**, **top-left current**, and **top-center**.
- Add saved breadcrumb separators: **dot (·)**, **dash (—)**, and **slash (/)**.
- Add three saved menu-button styles: **hamburger**, **single dot**, and **MENU text**. Opening and closing behavior stays the same.
- Show the real JAN KHÜR header and menu on `/admin`, so the logo size, placement, breadcrumb, and menu choices are visible while adjusting them. The logo links back to the homepage.
- Include every new option in **Restore standard settings**.

## Boundaries
- Keep all photographs, captions, ordering, page layouts, and existing animations unchanged.
- Use the reference screenshot only as guidance for the tighter top-left option; do not add it to the site.
- Store these choices with the existing site display settings so they persist across sessions.

## Technical details
- Extend the existing header settings model and allowed site-setting keys.
- Render placement and menu variants from semantic option values, without creating separate headers.
- Verify the controls on the Admin page and the resulting header on public pages at desktop and mobile widths.
