# Four Seasons Real Estate Hub

A comprehensive real estate platform built with a modern tech stack, featuring a dynamic public website and a powerful admin dashboard.

## 🚀 Project Overview

**Four Seasons Real Estate Hub** is designed to manage and showcase real estate properties, compounds, and developers. It includes:
- **Public Portal**: For users to browse properties, view details, and contact agents.
- **Admin Dashboard**: A secure, feature-rich panel for administrators to manage content (CRUD operations for properties, blogs, settings, etc.).

## 🛠 Tech Stack

### Frontend & Backend (Unified)
- **Framework**: [Next.js 14/15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Database ORM**: [Prisma v7](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Authentication**: [NextAuth.js (Auth.js)](https://next-auth.js.org/) (Credentials Provider)
- **Icons**: Lucide React

---

## ⚙️ Setup & Activation Instructions

### Prerequisites
- **Node.js**: v18 or higher
- **PostgreSQL**: A running instance (local or remote)

### Project Setup

1.  Navigate to the frontend directory (which now houses the fullstack application):
    ```bash
    cd front-end
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment Variables:
    - Copy `.env.example` to `.env` (or create a `.env` file).
    - Ensure your `DATABASE_URL` is set to your PostgreSQL instance.
    - Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL`.

4.  Sync Database Schema:
    ```bash
    npx prisma db push
    # OR 
    npx prisma migrate dev
    ```

5.  Seed the Database (Create Default Admin):
    ```bash
    npx tsx prisma/seed.ts
    ```
    > **Default Admin Credentials:**
    > - **Email:** `admin@admin.com`
    > - **Password:** `password`

6.  Start the development server:
    ```bash
    npm run dev
    ```
    The application will run at `http://localhost:3000`.

---

## 📂 Project Structure

### Fullstack Next.js Application (`/front-end`)
- **`prisma/`**: Prisma schema, migrations, and seed scripts.
    - **`schema.prisma`**: Database models definition.
    - **`seed.ts`**: Script to generate initial database records.
- **`src/app/`**: Next.js App Router root.
    - **`(public)/`**: Public-facing pages (Home, Properties, Blog).
    - **`admin/`**: Admin dashboard frontend (protected routes).
    - **`api/`**: Next.js API Routes (Backend logic and data fetching).
- **`src/components/`**: Reusable UI components.
    - **`ui/`**: Shadcn UI primitives.
    - **`dashboard/`**: Admin-specific components.
- **`src/lib/`**: Utilities and configurations.
    - **`prisma.ts`**: Prisma Client singleton.
    - **`api.ts` & `admin-api.ts`**: Axios clients pointing to local `/api`.
    - **`types.ts`**: TypeScript interfaces.

---

## 🔑 Key Features & Functions

### Authentication
- **Provider**: NextAuth.js (Credentials)
- **Login Endpoint**: `/admin/login`
- **Protection**: Admin routes verify active `next-auth` server sessions.
- **Passwords**: Securely hashed with `bcryptjs`.

### Dashboard Modules
- **Properties**: Full CRUD. Manage listings, images, and details.
- **Compounds**: Manage projects and link them to developers.
- **Developers**: Manage real estate companies.
- **Blog & Authors**: CMS for publishing articles.
- **Settings**: Manage Amenities, Locations, Partners, and Testimonials.
- **Contacts**: View submissions from the public contact form.
- **File Uploads**: Admin files are saved securely via `/api/upload/image`.

---

## 🚀 Production vs. Development

### Development
- **Database**: Local SQLite or separate Postgres dev database.
- **Run Command**: `npm run dev`

### Production
1.  **Build**:
    ```bash
    npm run build
    ```
2.  **Start Server**:
    ```bash
    npm start
    ```
3.  **Deployment**: Any Node.js compatible host like Vercel, DigitalOcean App Platform, Render, or Docker containers.

---

## 📝 API Documentation

All data logic is seamlessly integrated into Next.js Route Handlers located in `src/app/api/`.
Key endpoints:
- `GET /api/properties`: Fetch property listings.
- `POST /api/upload/image`: Secure file upload endpoint.
- `GET /api/auth/session`: Retrieve the current user session context.
