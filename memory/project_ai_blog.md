---
name: AI blog generation system
description: OpenAI GPT-4o blog generation built into CRONBET admin — API routes, UI, auto-scheduler
type: project
---

Built a full AI blog system (April 2025):

- `lib/blog-generator.ts` — core GPT-4o function with humanization system prompt
- `app/api/admin/generate-blog/route.ts` — POST endpoint, requires OPENAI_API_KEY in .env
- `app/api/admin/auto-blog/route.ts` — GET/PUT for AutoBlogSettings (DB singleton)
- `app/admin/blog/generate/page.tsx` — UI with topic chips, tone/wordcount/platform selectors, preview + SEO check
- `app/admin/settings/page.tsx` — Auto-publisher toggle, time picker, topic rotation
- `lib/auto-blog-scheduler.ts` — node-cron scheduler, runs via instrumentation.ts
- `instrumentation.ts` — starts scheduler on server boot (requires `experimental.instrumentationHook: true` in next.config.mjs)
- `prisma/schema.prisma` — added AutoBlogSettings model

**Why:** User wants humanized, undetectable AI blogs that rank on SEO.
**How to apply:** OPENAI_API_KEY must be in .env to use generation. Model used: gpt-4o with temperature 0.85.
