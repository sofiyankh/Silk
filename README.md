# SILK — Artistic Streetwear Label

Official e-commerce storefront and admin platform for **SILK**, a Tunisian streetwear label featuring heavyweight 450GSM cotton hoodies with botanical illustrations.

## Tech Stack
- **Framework:** Next.js 14 (App Router, ISR)
- **Database & ORM:** PostgreSQL (Supabase) with Prisma ORM
- **Styling & Motion:** Tailwind CSS, GSAP, Lenis
- **Deployment:** Netlify

## Local Setup
1. Copy `.env.example` to `.env` and fill in your database, Supabase, and admin credentials.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Generate Prisma client and start the development server:
   ```bash
   npx prisma generate
   npm run dev
   ```

## Author
- GitHub: [@sofiyankh](https://github.com/sofiyankh)
- Portfolio: [sofiyankh.github.io/SofieneKh](https://sofiyankh.github.io/SofieneKh/)
