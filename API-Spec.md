# API Specification — UserProfile.Api

Base URL (dev): `http://localhost:5100` — the frontend calls it via the Vite proxy at `/api/...`.

All endpoints are served from the `ProfilesController` and return/accept JSON.

## Model: `Profile`

| Field         | Type    | Notes                          |
|---------------|---------|---------------------------------|
| `id`          | guid    | Server-generated                |
| `fullName`    | string  | Required, max 100 chars         |
| `email`       | string  | Required, valid email address   |
| `phoneNumber` | string? | Optional, valid phone format     |
| `bio`         | string? | Optional, max 500 chars         |
| `avatarUrl`   | string? | Optional, valid URL             |

## Model: `ProfileRequest` (create/update payload)

Same fields as `Profile` except `id` is not included (validation rules above apply).

## Endpoints

### `GET /api/profiles`
Returns all profiles.

- **200 OK** — `Profile[]`

### `GET /api/profiles/{id}`
Returns a single profile by id.

- **200 OK** — `Profile`
- **404 Not Found** — no profile with that id

### `POST /api/profiles`
Creates a new profile.

- **Body**: `ProfileRequest`
- **201 Created** — `Profile`, with `Location` header pointing to `GET /api/profiles/{id}`
- **400 Bad Request** — validation failed

### `PUT /api/profiles/{id}`
Updates an existing profile.

- **Body**: `ProfileRequest`
- **204 No Content** — updated successfully
- **404 Not Found** — no profile with that id
- **400 Bad Request** — validation failed

### `DELETE /api/profiles/{id}`
Deletes a profile.

- **204 No Content** — deleted successfully
- **404 Not Found** — no profile with that id
