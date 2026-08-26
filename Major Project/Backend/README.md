# Room Searcher & Roommate Backend

This backend uses Node.js, Express and PostgreSQL. It is kept simple so the API is easy to understand and extend.

## Setup

1. Install PostgreSQL and create a database named `room_searcher`.
2. Copy `.env.example` to `.env`.
3. Put your PostgreSQL password in `DATABASE_URL`.
4. From this folder run:

```bash
npm install
npm run dev
```

The server starts on `http://localhost:5000`.

The first startup creates the required tables automatically.

## Demo data

After PostgreSQL is configured:

```bash
npm run seed
```

Demo accounts:

- owner@example.com / Password@123
- roommate@example.com / Password@123
- seeker@example.com / Password@123

## Main API

- `/api/v1/auth`
- `/api/v1/users`
- `/api/v1/profile`
- `/api/v1/rooms`
- `/api/v1/search`
- `/api/v1/match`
- `/api/v1/chat`
- `/api/v1/bookings/visits`
- `/api/v1/reviews`
- `/api/v1/expenses`
- `/api/v1/notifications`
- `/api/v1/recommendations`

A matching `/api/...` alias is also kept for easier testing.
