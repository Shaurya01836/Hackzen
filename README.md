
---

# HackZen

HackZen is a full-stack hackathon management platform that enables users to organize, participate in, and manage hackathons with ease. The platform features user authentication (including 2FA), team management, project submissions, real-time chat, notifications, admin and judge panels, and more.

---

## Features

- **User Authentication:** Register, login, 2FA, OAuth (Google, GitHub)
- **Dashboard:** Personalized dashboard for participants, organizers, and judges
- **Hackathon Management:** Create, explore, and join hackathons
- **Team Management:** Invite users, accept/decline invites, manage team members
- **Project Submission:** Submit and review projects, view submission history
- **Notifications:** In-app notifications for important events
- **Admin Panel:** User management, hackathon moderation, analytics, content moderation
- **Judge Panel:** Review and score submissions
- **Certificates & Badges:** Earn and view achievements
- **Newsletter & Announcements:** Stay updated with platform news
- **Responsive UI:** Modern, mobile-friendly interface

---

## Tech Stack

- **Frontend:** React, React Router, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT, Passport.js, OAuth (Google, GitHub)
- **Real-time:** Socket.io
- **File Uploads:** Cloudinary
- **Other:** Vite, ESLint, Prettier

---

## Project Structure

```
STPI-Project/
  ├── backend/         # Node.js/Express API
  └── Frontend/        # React frontend
```

### Backend Highlights

- `controllers/` - Business logic for all features
- `model/` - Mongoose models for all entities
- `routes/` - Express routes for API endpoints
- `middleware/` - Auth, validation, and utility middleware
- `config/` - Passport, Cloudinary, Socket.io config
- `utils/` - Helper functions (e.g., badge logic)
- `scripts/` - Initialization scripts (e.g., badge seeding)

### Frontend Highlights

- `src/components/` - Reusable UI components (modals, sidebar, cards, etc.)
- `src/pages/` - Main pages and dashboard sections
- `src/context/` - React context for authentication
- `src/hooks/` - Custom React hooks
- `src/lib/` - API and utility functions
- `src/utils/` - Social sharing, socket helpers

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB instance (local or cloud)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/hackzen.git
cd hackzen
```

### 2. Backend Setup

```bash
cd backend
npm install
# Create a .env file based on .env.example and set your environment variables
npm run dev
```

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
npm run dev
```

### 4. Access the App

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

**Backend (.env):**
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `CLOUDINARY_URL` - Cloudinary API URL
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - Google OAuth
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` - GitHub OAuth
- ...and others as needed

**Frontend:**
- Most configuration is handled via API endpoints and environment variables in Vite.

---

## Scripts

**Backend:**
- `npm run dev` - Start backend in development mode
- `npm run seed` - Seed initial data

**Frontend:**
- `npm run dev` - Start frontend in development mode
- `npm run build` - Build for production
- `npm run lint` - Lint code

---

## Contributing

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a pull request

---

## License

This project is licensed under the MIT License.

---

## Acknowledgements

- [React](https://react.dev/)
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Cloudinary](https://cloudinary.com/)
- [Socket.io](https://socket.io/)
- [Lucide Icons](https://lucide.dev/)

---

