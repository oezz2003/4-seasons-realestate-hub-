# Four Seasons Real Estate Hub

A comprehensive real estate platform built with a modern tech stack, featuring a dynamic public website and a powerful admin dashboard.

## 🚀 Project Overview

**Four Seasons Real Estate Hub** is designed to manage and showcase real estate properties, compounds, and developers. It includes:
- **Public Portal**: For users to browse properties, view details, and contact agents.
- **Admin Dashboard**: A secure, feature-rich panel for administrators to manage content (CRUD operations for properties, blogs, settings, etc.).

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Form Handling**: React Hook Form + Zod
- **Icons**: Lucide React

### Backend
- **Framework**: [Django 5](https://www.djangoproject.com/)
- **API**: Django REST Framework (DRF)
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **Authentication**: Token-based Authentication (DRF Auth Token)
- **Image Handling**: Pillow

---

## ⚙️ Setup & Activation Instructions

### Prerequisites
- **Node.js**: v18 or higher
- **Python**: v3.10 or higher
- **pip**: Python package manager

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd back-end
    ```

2.  Create and activate a virtual environment:
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4.  Apply database migrations:
    ```bash
    python manage.py migrate
    ```

5.  Create a superuser (Admin):
    ```bash
    # Run the helper script
    python create_admin_user.py
    
    # OR manually
    python manage.py createsuperuser
    ```
    > **Default Credentials:**
    > - **Username:** `admin`
    > - **Password:** `admin123`

6.  Start the development server:
    ```bash
    python manage.py runserver
    ```
    The backend will run at `http://127.0.0.1:8000`.

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd front-end
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will run at `http://localhost:3000`.

---

## 📂 Project Structure

### Backend (`/back-end`)
- **`mysite/`**: Project configuration (settings, urls, wsgi).
- **`realestate/`**: Main application app.
    - **`models.py`**: Database schemas (Property, Compound, Developer, etc.).
    - **`views.py`**: API logic and ViewSets.
    - **`serializers.py`**: Data serialization for APIs.
    - **`urls.py`**: API route definitions.
    - **`admin.py`**: Django Admin configuration.
- **`media/`**: User-uploaded files (images).
- **`manage.py`**: Django command-line utility.

### Frontend (`/front-end`)
- **`src/app/`**: Next.js App Router pages.
    - **`(public)/`**: Public-facing pages (Home, Properties, Blog).
    - **`admin/`**: Admin dashboard routes (protected).
- **`src/components/`**: Reusable UI components.
    - **`ui/`**: Shadcn UI primitives (Button, Input, Card, etc.).
    - **`dashboard/`**: Admin-specific components (Sidebar, Tables, Forms).
- **`src/lib/`**: Utilities.
    - **`api.ts`**: Main API client and interceptors.
    - **`auth-api.ts`**: Authentication specific API logic.
    - **`types.ts`**: TypeScript interfaces.
- **`src/store/`**: Redux store and slices.

---

## 🔑 Key Features & Functions

### Authentication
- **Login**: `/admin/login`
- **Protection**: Admin routes are protected by `DashboardLayout` and API interceptors.
- **Token**: Stored in `localStorage` and automatically injected into `Authorization` headers.

### Dashboard Modules
- **Properties**: Full CRUD. Manage listings, images, and details.
- **Compounds**: Manage projects and link them to developers.
- **Developers**: Manage real estate companies.
- **Blog**: CMS for publishing articles.
- **Settings**: Manage Amenities, Authors, Locations, Partners, and Testimonials.
- **Contacts**: View submissions from the public contact form.

---

## 🚀 Production vs. Development

### Development
- **Debug Mode**: `DEBUG = True` in Django settings.
- **Frontend**: `npm run dev` with Hot Module Replacement (HMR).
- **Database**: SQLite (`db.sqlite3`).

### Production
1.  **Backend Settings**:
    - Set `DEBUG = False`.
    - Set `ALLOWED_HOSTS` to your domain.
    - Configure a production database (PostgreSQL recommended).
    - Set `CORS_ALLOWED_ORIGINS` to your frontend domain.

2.  **Static Files**:
    ```bash
    python manage.py collectstatic
    ```

3.  **Frontend Build**:
    ```bash
    npm run build
    npm start
    ```

4.  **Deployment**:
    - **Frontend**: Vercel, Netlify, or Docker.
    - **Backend**: DigitalOcean, AWS, Heroku, or Docker.

---

## 📝 API Documentation

The API is structured into two main namespaces:
- **`/api/public/`**: Read-only endpoints for the public website.
- **`/api/admin/`**: Protected endpoints for the dashboard (requires Token).

Key Endpoints:
- `GET /api/public/properties/`: List all properties.
- `POST /api/auth/login/`: Obtain auth token.
- `GET /api/auth/me/`: Verify token and get user info.
