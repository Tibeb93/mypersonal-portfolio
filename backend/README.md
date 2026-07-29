# Portfolio CMS — Backend API

Node.js + Express + MongoDB REST API powering the portfolio and admin dashboard.

## Stack
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (access token 15min + refresh token 7d, httpOnly cookie)
- **Storage:** Cloudinary
- **Security:** Helmet, CORS, Rate Limiting, Mongo Sanitize

---

## Quick Start

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` with your real values:
- `MONGODB_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — random 32+ char string
- `JWT_REFRESH_SECRET` — different random 32+ char string
- `CLOUDINARY_*` — from your Cloudinary dashboard
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — initial admin credentials

### 3. Seed the database (first time only)
```bash
npm run seed
```
This creates the admin user + sample data.

### 4. Start development server
```bash
npm run dev
```
Server runs on `http://localhost:5000`

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/profile` | Get portfolio profile |
| GET | `/api/skills` | Get skills (grouped) |
| GET | `/api/projects` | Get projects (paginated) |
| GET | `/api/projects/:slug` | Get single project |
| GET | `/api/experience` | Get experience timeline |
| GET | `/api/education` | Get education |
| GET | `/api/certificates` | Get certificates |
| GET | `/api/blog` | Get published blog posts |
| GET | `/api/blog/:slug` | Get single blog post |
| GET | `/api/blog/categories` | Get blog categories |
| GET | `/api/blog/tags` | Get blog tags |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/settings/public` | Get public site settings |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Admin login |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/auth/me` | Get current admin |
| PUT | `/api/auth/change-password` | Change password |

### Admin (all require Bearer token)
All admin routes follow the pattern `/api/admin/{resource}` with standard CRUD operations.

---

## Project Structure
```
src/
├── config/         # DB + Cloudinary setup
├── controllers/    # Business logic (13 controllers)
├── middleware/     # Auth, upload, error, audit, analytics
├── models/         # Mongoose schemas (13 models)
├── routes/         # Express routers (13 route files)
├── scripts/        # seed.js
├── utils/          # logger, jwt, apiResponse, cloudinaryUpload
└── server.js       # Entry point
```

---

## Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on [render.com](https://render.com)
3. Connect your repository
4. Set all environment variables from `.env.example`
5. Deploy — Render auto-detects `render.yaml`

---

## Security Notes
- Never commit `.env` to git
- Change admin password immediately after first seed
- Use strong random strings for JWT secrets (min 32 chars)
- MongoDB URI contains credentials — treat it as a secret
