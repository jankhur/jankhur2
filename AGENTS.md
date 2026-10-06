Site typography choices are stored as `logo_font` and `serif_font` in public site settings and applied through root CSS variables; this keeps font choices independent across pages without changing their layout.
Landing-page scrolling uses native CSS scroll-snap (mandatory, center-aligned feed items with scroll margins) instead of JS wheel interception; trackpad momentum stays smooth and upward scrolling stays natural.
Header presentation options use validated values from public site settings and are previewed on the Admin page; this keeps visual adjustments persistent and self-service.
