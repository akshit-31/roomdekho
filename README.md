# 🏠 RoomDekho – Find Your Space, Meet Your People

### Smart Room & Roommate Discovery Platform

RoomDekho is a full-stack web application designed to simplify the process of finding rooms and compatible roommates. It provides a common platform where users can discover rental properties, connect with potential roommates, communicate with property owners, and manage room visit requests.

The platform aims to make room searching easier, more organized, and convenient by bringing property discovery, roommate matching, communication, and property management into one place.

---

## 🌟 Key Features

### 👤 For Room Seekers
- Browse and search available rooms.
- View detailed property information.
- Explore room rent, deposits, amenities, and location.
- Save favourite properties.
- Create and manage user profiles.
- Discover potential roommates.
- View roommate compatibility matches.
- Request property visits.
- Chat with other users in real time.
- Receive notifications.
- Submit reviews and track shared expenses.

### 🏡 For Property Owners
- Create and publish room listings.
- Update and manage property details.
- Upload property images.
- Manage rental information and amenities.
- View room visit requests.
- Handle user enquiries and reviews.
- Access owner dashboard.

### 🛡️ Admin Panel
- Admin dashboard and analytics.
- User management.
- Property listing management.
- KYC verification interface.
- Complaint and report management.
- Fraud alert management.
- Platform settings and administration.

---

## 🧰 Technology Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Styling | Tailwind CSS, CSS |
| Routing | React Router |
| State Management | Redux Toolkit |
| API Communication | Axios |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Database Hosting | Supabase PostgreSQL |
| Real-Time Communication | Socket.IO |
| Authentication | JWT |
| Password Security | bcryptjs |
| File Upload | Multer |
| Charts | Recharts |
| Icons | Lucide React |
| Maps / Location | Google Maps API, Leaflet packages |

---

## 🏗️ Project Architecture

RoomDekho follows a full-stack architecture with three major components:

**1. Frontend**
- Built using React.js and Vite.
- Provides interactive user interfaces.
- Handles navigation, forms, dashboards, and user interactions.
- Communicates with the backend through Axios.

**2. Backend**
- Developed using Node.js and Express.js.
- Handles API requests and business logic.
- Manages authentication and authorization.
- Supports real-time communication through Socket.IO.

**3. Database**
- Uses PostgreSQL for storing application data.
- Connects through the backend using a database connection URL.
- Supports users, properties, profiles, messages, visits, and other application records.

---

## 📁 Project Structure

```text
RoomDekho/
│
└── Major Project/
    │
    ├── Backend/
    │   ├── src/
    │   │   ├── config/
    │   │   ├── middleware/
    │   │   ├── routes/
    │   │   ├── utils/
    │   │   ├── seed.js
    │   │   └── server.js
    │   │
    │   ├── .env.example
    │   └── package.json
    │
    └── Frontend/
        ├── public/
        ├── src/
        │   ├── assets/
        │   ├── components/
        │   ├── config/
        │   ├── context/
        │   ├── hooks/
        │   ├── pages/
        │   ├── routes/
        │   ├── services/
        │   ├── store/
        │   ├── utils/
        │   ├── App.jsx
        │   └── main.jsx
        │
        ├── .env.example
        └── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- PostgreSQL or Supabase PostgreSQL database
- Git

### Step 1: Clone Repository

```bash
git clone https://github.com/akshit-31/roomdekho.git
```

```bash
cd roomdekho
```

### Step 2: Setup Backend

Navigate to the backend directory:

```bash
cd "Major Project/Backend"
```

Install dependencies:

```bash
npm install
```

Create a `.env` file using `.env.example`.

Configure the required environment variables:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL=your_postgresql_connection_string

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRES=15m
REFRESH_TOKEN_EXPIRES=7d

CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

Backend URL:

```text
http://localhost:5000
```

Health Check:

```text
http://localhost:5000/api/health
```

### Step 3: Setup Frontend

Open another terminal and navigate to:

```bash
cd "Major Project/Frontend"
```

Install dependencies:

```bash
npm install
```

Create a `.env` file and configure:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Open the local URL:

```text
http://localhost:5173
```

---

## 🗄️ Database Management

RoomDekho uses PostgreSQL as its primary relational database.

The database stores information related to:

- User accounts and profiles.
- Room listings and property details.
- Favourite properties.
- Roommate matching.
- Visit requests.
- Conversations and messages.
- Notifications.
- Reviews and expenses.
- Reports and administrative records.

Supabase can be used to host the PostgreSQL database through the `DATABASE_URL` connection.

---

## 🔌 Backend API Modules

The backend provides API modules for:

- Authentication and Users
- User Profiles
- Room Listings
- Room Search and Discovery
- Roommate Matching
- Visits and Bookings
- Real-Time Chat
- Notifications
- Reviews and Expenses
- Recommendations
- Owner Management
- Reports and Administration
- Analytics
- Documents and File Uploads

API Base URL:

```text
/api/v1
```

---

## 🔒 Security & Configuration

- JWT-based authentication.
- Password hashing using bcryptjs.
- Protected backend routes.
- Environment-based configuration.
- Database credentials stored in environment variables.
- CORS and security middleware.
- Keep secret keys and database credentials private.
- Never upload actual `.env` files to GitHub.

---

## 🚀 Production Build

### Frontend Build

```bash
cd "Major Project/Frontend"
npm run build
```

The production build is generated in the `dist` directory.

### Backend Production

```bash
cd "Major Project/Backend"
npm start
```

### Deployment

The project includes configuration examples for:

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** PostgreSQL / Supabase

Production environment variables and service credentials must be configured separately on the hosting platforms.

---

## 🎯 Project Objectives

1. Simplify the room searching process.
2. Help users find compatible roommates.
3. Provide a direct connection between tenants and property owners.
4. Improve property discovery and management.
5. Provide real-time communication.
6. Create an organized platform for room and roommate management.

---

## 🔮 Future Enhancements

- Advanced AI-based roommate recommendations.
- Improved location-based room discovery.
- Enhanced property verification.
- Online rental payment integration.
- Mobile application development.
- Advanced recommendation system.
- Improved security and accessibility.

---

## 🤝 Contribution

Contributions and suggestions are welcome.

Developers can contribute by improving existing features, fixing bugs, enhancing the user interface, and adding new functionalities.

For major changes, create a separate branch and submit a Pull Request for review.

---

## 👨‍💻 Project Information

**Project Name:** RoomDekho – Room & Roommate Finder

**Project Type:** Full-Stack Web Application

**Domain:** Real Estate / Roommate Discovery

**Developed As:** Computer Science & Engineering Major Project

**GitHub Repository:**  
https://github.com/akshit-31/roomdekho

---

### 🏡 RoomDekho
**Find Your Space. Meet Your People.**

*Making room discovery and roommate connections simpler.*
