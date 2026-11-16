🏠 RoomDekho – Room & Roommate Finder
RoomDekho is a web-based platform designed to make finding rooms and compatible roommates easier. Users can explore room listings, create profiles, connect with potential roommates, save favourite properties, and manage room-visit requests through one platform. Property owners can publish and manage listings, while administrative features help manage users, listings, reports, and platform activity.
✨ Key Features
For Room Seekers
- Browse and search available room listings.
- View room details, rent, deposit, amenities, images, and location information.
- Filter and discover rooms according to preferences.
- Save interesting properties to favourites.
- Create and manage a personal profile.
- Find potential roommates and view compatibility matches.
- Request and manage property visits.
- Chat with other users in real time.
- Receive notifications and submit reviews.
- Track shared expenses.
For Property Owners
- Create, update, and manage room listings.
- Add property details, rent, amenities, and images.
- View visit requests and manage bookings.
- Manage enquiries and reviews.
- Access owner dashboard information.
Administration
- Admin dashboard and analytics.
- User and listing management.
- KYC verification interface.
- Review, complaint, and report management.
- Fraud-alert and payment-management interfaces.
- Platform settings.
🧰 Technology Stack
| Area | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Styling | Tailwind CSS, CSS |
| Routing | React Router |
| State Management | Redux Toolkit, React Redux |
| API Communication | Axios |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Database Hosting Configuration | Supabase PostgreSQL connection via `DATABASE_URL` |
| Real-time Communication | Socket.IO |
| Authentication | JSON Web Tokens (JWT), bcryptjs |
| File Uploads | Multer |
| Charts | Recharts |
| Icons | Lucide React |
| Maps / Location Support | Google Maps API and Leaflet packages are included in the frontend dependencies |

📁 Project Structure
RoomDekho/
└── Major Project/
    ├── Backend/
    │   ├── src/
    │   │   ├── config/        # Database configuration and initialization
    │   │   ├── middleware/    # Authentication middleware
    │   │   ├── routes/        # API routes
    │   │   ├── utils/         # Shared utility functions
    │   │   ├── seed.js        # Demo data seeding
    │   │   └── server.js      # Express and Socket.IO server
    │   ├── .env.example
    │   └── package.json
    │
    └── Frontend/
        ├── public/            # Public assets and images
        ├── src/
        │   ├── assets/        # Images, icons, and styles
        │   ├── components/    # Reusable UI components
        │   ├── pages/          # Application pages
        │   ├── App.jsx
        │   └── main.jsx
        ├── .env.example
        └── package.json

⚙️ Getting Started
Prerequisites
- Node.js (LTS version recommended)
- npm
- A PostgreSQL database (local PostgreSQL or Supabase PostgreSQL)
  🎯 Project Objective
The objective of RoomDekho is to provide a convenient and organized platform for people looking for accommodation and roommates. By bringing room discovery, roommate matching, communication, and visit management together, the platform aims to simplify the room-search process for both tenants and property owners.
Note: This README describes the project structure and technologies found in this repository. Some integrations may require valid API keys or service configuration before they work in a local or deployed environment.
