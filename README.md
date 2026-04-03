# CRONBET — Affiliate Betting Comparison Website

A full-stack affiliate betting comparison website built with Next.js 14, PostgreSQL (Prisma 5), and NextAuth.js.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js (credentials provider)
- **Deployment**: Railway.app

---

## Local Development

### Prerequisites
- Node.js 18+
- PostgreSQL running locally

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
```
Edit `.env` with your local DB credentials:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/cronbet"
NEXTAUTH_SECRET="any-random-string-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Create the DB and apply schema
```bash
npx prisma db push
```

### 4. Seed starter data
```bash
npm run db:seed
```
This creates 8 betting platforms + the admin user:
- Email: `admin@cronbet.com`
- Password: `Admin@123`

### 5. Start dev server
```bash
npm run dev
```
Open http://localhost:3000

---

## Railway Deployment (Step-by-Step)

### Step 1 — Push to GitHub
```bash
git init
git add .
git commit -m "Initial CRONBET commit"
git remote add origin https://github.com/YOUR_USERNAME/cronbet.git
git push -u origin main
```

### Step 2 — Create Railway project
1. Go to [railway.app](https://railway.app) → **New Project**
2. Choose **Deploy from GitHub repo**
3. Select your `cronbet` repository

### Step 3 — Add PostgreSQL
In your project dashboard: **New** → **Database** → **Add PostgreSQL**

### Step 4 — Set environment variables
In your Railway service → **Variables**, add:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Copy from your Railway PostgreSQL plugin |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` to generate |
| `NEXTAUTH_URL` | `https://your-app.railway.app` |
| `NODE_ENV` | `production` |

### Step 5 — Deploy
Railway auto-deploys on push. Watch the build logs.

### Step 6 — Seed the database
Once deployed, open the **Shell** tab in your Railway service:
```bash
npm run db:seed
```

### Step 7 — Custom domain
**Settings** → **Networking** → **Custom Domain** → add `cronbet.com`

Update your DNS: add a CNAME record pointing to your Railway domain.

---

## Project Structure

```
app/
├── page.tsx                  # Homepage (hero, top 5, comparison table, FAQ)
├── compare/                  # Sortable/filterable full comparison table
├── best-bonuses/             # Bonus cards grid
├── blog/                     # Blog listing + individual posts
├── review/[slug]/            # Dynamic platform review pages
├── about|contact|privacy-policy|terms|responsible-gambling/
├── admin/
│   ├── page.tsx              # Dashboard (stats + quick actions)
│   ├── platforms/            # Add / Edit / Delete platforms
│   └── blog/                 # Add / Edit / Delete posts
├── api/
│   ├── auth/[...nextauth]/   # NextAuth handler
│   ├── platforms/            # REST: GET, POST, PUT, DELETE
│   └── blog/                 # REST: GET, POST, PUT, DELETE
├── sitemap.ts                # Auto-generated sitemap.xml
└── robots.ts                 # robots.txt

components/
├── layout/Header.tsx         # Sticky nav + mobile hamburger
├── layout/Footer.tsx         # Footer with disclaimer
├── platform/PlatformCard.tsx # Card with rank, bonus, CTA
├── platform/ComparisonTable.tsx  # Sortable table
├── platform/PlatformForm.tsx # Admin platform editor
├── blog/BlogPostForm.tsx     # Admin blog editor
└── ui/StarRating.tsx | Badge.tsx

lib/
├── prisma.ts   # Prisma client singleton
├── auth.ts     # NextAuth options
└── types.ts    # Shared TypeScript types

prisma/
├── schema.prisma   # BettingPlatform, BlogPost, AdminUser
└── seed.ts         # 8 platforms + sample post + admin user
```

---

## Admin Panel

URL: `/admin` (redirects to `/admin/login` if not authenticated)

**Features:**
- Dashboard with live stats
- Add / Edit / Delete betting platforms (full form with pros/cons, sports, payments, rank, featured toggle)
- Add / Edit / Delete blog posts (with SEO meta fields)
- Sign out

**Default credentials:** `admin@cronbet.com` / `Admin@123`

---

## Updating Affiliate Links

1. Log in to `/admin`
2. Go to **Platforms** → click **Edit**
3. Update **Affiliate URL** with your real affiliate link
4. Click **Update Platform**

---

## SEO Features

- Unique title and meta description on every page
- Open Graph tags for social sharing
- JSON-LD Review schema on /review/[slug]
- JSON-LD WebSite schema on homepage
- JSON-LD Article schema on blog posts
- Auto-generated /sitemap.xml (all pages + reviews + posts)
- /robots.txt blocks /admin and /api
- Semantic HTML h1/h2/h3 hierarchy
- Next.js Image optimization + lazy loading
- Mobile-first responsive design
