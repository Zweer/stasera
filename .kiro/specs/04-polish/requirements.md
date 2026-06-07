# Polish Requirements

## Goal

Refine the app for daily use: offline support, visual polish, and closing the
feedback loop so the system improves over time.

## Features

### 1. Offline Support
- Cache last received recommendations for offline viewing
- Graceful degradation: show cached data when offline
- Clear indicator when data is stale

### 2. UI Polish
- Smooth page transitions and micro-animations
- Consistent spacing, typography hierarchy
- Loading skeletons for async content
- Mobile-first responsive refinement
- App icon and splash screen design

### 3. Event Dedup (Cross-source)
- Improved deduplication with LLM-assisted comparison
- Merge strategy: keep richer metadata, link both source URLs
- Admin view to manually resolve ambiguous duplicates

### 4. Feedback Loop (Advanced)
- Track which recommendations led to user actually going out
- "How was it?" follow-up after the event date
- Stronger signal for profile refinement than accept/reject
- Profile drift detection ("your tastes are changing")

### 5. Performance
- Optimize LLM calls (batch where possible, cache prompts)
- Image optimization for event thumbnails
- Edge caching for static recommendations

## Success Criteria

- App usable offline (last recommendations visible)
- Page transitions feel smooth and intentional
- No visible duplicate events in suggestions
- Profile improves noticeably over 4+ weekends of use
- Lighthouse PWA score > 90

## Non-Goals

- Native mobile app
- User accounts beyond Google OAuth
- Multi-city support
- Public event listing (app is personal/private)
