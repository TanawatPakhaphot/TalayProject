# TalayProject

A User Profile web application with a React frontend and a .NET 10 Web API backend.

## Structure

- `backend/UserProfile.Api` — ASP.NET Core 10 Web API exposing CRUD endpoints for user profiles (in-memory store).
- `frontend` — React + TypeScript (Vite) app that displays and edits the current user's profile.

## Running the backend

```bash
cd backend/UserProfile.Api
dotnet run
```

The API listens on `http://localhost:5100` (see `Properties/launchSettings.json`). Endpoints:

- `GET /api/profiles` — list profiles
- `GET /api/profiles/{id}` — get a profile
- `POST /api/profiles` — create a profile
- `PUT /api/profiles/{id}` — update a profile
- `DELETE /api/profiles/{id}` — delete a profile

## Running the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and calls the API base URL configured in `frontend/.env` (`VITE_API_BASE_URL`, defaults to `http://localhost:5100/api`).

Run both the backend and frontend at the same time to use the app end-to-end.
