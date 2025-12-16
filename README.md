# Hash Lock

A robust, security-focused authentication system built entirely from scratch. This project demonstrates how to implement security patterns—including, OAuth 2.0, Role-Based Access Control (RBAC) and more. It emphasizes best practices, and secure session management.

**Project Link:** [https://hash-lock.pavicodes.in](https://hash-lock.pavicodes.in)

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Database Schema](#database-schema)
- [Screenshots](#screenshots)
- [System Workflows](#system-workflows)
- [Security Implementation](#Security-Implementation)
- [Environment Variables](#environment-variables)

## Tech Stack

- **Framework:** Next.js 15 (App Router, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Database:** PostgreSQL (hosted on Supabase)
- **ORM:** Prisma
- **Cryptography:** Argon2id
- **Validation:** Zod
- **Deployment:** Vercel

## Features

- Custom Credentials Auth: Secure email/password registration and login flows.
- O-Auth 2.0 Integration: "Sign in with Google" implementation with automatic account linking.
- Role-Based Access Control (RBAC): Middleware and server-side checks for User vs. Admin permissions.
- Stateful Session Management: Database-backed sessions using secure, HTTP-only, SameSite cookies.
- Password Recovery: Secure reset flow using time-limited, single-use tokens.
- Brute Force Protection: IP-based rate limiting on sensitive endpoints using Redis.
- Input Validation: Strict Zod schema validation for all API inputs.

## Database Schema

The normalized schema tightly links users, events, orders, tickets, and ticket variants with strict foreign keys to maintain referential integrity.

> _See `prisma/schema.prisma` for the full definition._

<p align="center">
<img src="screenshots/db.png" alt="Database Schema" width="80%" />
</p>

## Screenshots

|              Admin Page              |               User Page                |               Login Page               |
| :----------------------------------: | :------------------------------------: | :------------------------------------: |
| ![Event Page](screenshots/admin.png) | ![Event Details](screenshots/user.png) | ![Success Page](screenshots/login.png) |

## System Workflows

### 1. OAuth 2.0 Workflow (Google)

This project implements the standard Authorization Code Flow to securely exchange user credentials without handling raw Google passwords.

1.  **Request:** User clicks "Sign in with Google". The app redirects the browser to `accounts.google.com` with our Client ID and Scope (Email/Profile).
2.  **Consent:** User logs in to Google and grants permission.
3.  **Callback:** Google redirects back to our `/api/auth/google/callback` endpoint with a temporary `code`.
4.  **Exchange:** The server sends this `code` + `client_secret` directly to Google (backend-to-backend) to obtain an `access_token`.
5.  **Profile Retrieval:** The server uses the access token to fetch the user's email and ID.
6.  **Account Linking:** The system checks if the email exists. If yes, it links the Google Account to the existing user. If no, it creates a new user.
7.  **Session Creation:** A secure session cookie is issued.

### 2. Forgot Password Workflow

A stateless, token-based flow designed to prevent "Email Enumeration" attacks.

[Image of password reset flow diagram]

1.  **Request:** User submits their email address.
2.  **Enumeration Protection:** The API always returns "If that email exists, we sent a link" (Status 200), regardless of whether the user was found.
3.  **Token Generation:** If the user exists, a cryptographic random hex token is generated and stored in the `PasswordResetToken` table with a 1-hour expiration.
4.  **Email Dispatch:** A link containing the token (`/reset-password?token=xyz`) is emailed to the user.
5.  **Verification:** When the user clicks the link, the server verifies the token exists and is not expired.
6.  **Reset:** User provides a new password. The server hashes it (Argon2), updates the `User` table, and deletes the used token.

## Stateful vs. Stateless Session Management

This project deliberately chooses **Stateful (Database) Sessions** over Stateless (JWT) tokens. While JWTs are popular, stateful sessions offer superior security control.

| Feature                  | Stateful (Used in Hash Lock)                                                                                     | Stateless (JWT)                                                                                                                     |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| **Information Security** | **High.** The session ID is just a random string. It contains no user data. If stolen, no PII is revealed.       | **Low.** The token contains user data (payload). If not encrypted, anyone can decode and read the information.                      |
| **Revocation**           | **Instant.** An admin can delete a session row in the DB to ban a user immediately.                              | **Impossible.** You cannot invalidate a JWT before it expires without building complex blacklists.                                  |
| **Data Mutability**      | **Flexible.** You can update user roles or permissions in the DB, and it reflects instantly on the next request. | **Rigid.** You cannot change data inside an issued token. You must wait for it to expire and issue a new one.                       |
| **Compromise Risk**      | **Isolated.** Compromise is limited to the auth system database.                                                 | **System-wide.** Decrypting/Verifying requires a shared secret key. If one service leaks the key, the entire system is compromised. |
| **Network Overhead**     | **Low.** The cookie is a tiny string (UUID).                                                                     | **High.** Tokens grow large as you add user roles and data, increasing bandwidth on every request.                                  |
| **Access Control**       | **Granular.** Different parts of the system can query specific data they need using the ID.                      | **All-or-Nothing.** Every service sees all data packed into the token.                                                              |
| **Scalability**          | **Moderate.** Requires scaling the database/cache (Redis) to handle lookups.                                     | **High.** No database lookups required for verification.                                                                            |
| **Implementation**       | **Complex.** Requires setting up a session store and cleanup jobs.                                               | **Simple.** Self-contained; no extra storage infrastructure needed.                                                                 |

## Security Implementation

### Cryptography (Argon2id)

Instead of outdated algorithms like MD5 or fast algorithms like SHA-256 (which are vulnerable to GPU brute-forcing), this project uses Argon2id. It is memory-hard, making it significantly more expensive and slower for attackers to crack hashes offline.

### Rate Limiting (Upstash Redis)

To prevent brute-force attacks on the login endpoint:

Algorithm: Sliding Window.
Limit: 5 requests per 60 seconds per IP address.
Storage: Managed via Upstash Redis for low-latency edge checks.

Secure Headers
Middleware injects security headers into every response to prevent common attacks:

X-Content-Type-Options: nosniff
X-Frame-Options: DENY (Clickjacking protection)
Strict-Transport-Security (Force HTTPS)

## Environment Variables

```
# Database (Supabase)
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..."

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Rate Limiting (Upstash)
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="your_upstash_token"
```
