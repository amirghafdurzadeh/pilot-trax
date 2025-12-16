# Project Overview: Pilot Trax

"Pilot Trax" is a full-stack Next.js application serving as an intelligent platform for aviation and piloting exam preparation. It features a comprehensive learning management system (LMS) that includes courses, lessons, questions, and answers. The platform incorporates user management, role-based permissions, and OTP (One-Time Password) authentication. The application is designed with Persian language support, utilizing PostgreSQL with Prisma for robust database management, Tailwind CSS for efficient styling, and Radix UI for accessible and customizable components.

## Technology Stack

*   **Framework:** Next.js (React)
*   **Language:** TypeScript
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Styling:** Tailwind CSS, Radix UI
*   **Authentication:** Session-based authentication with `jose` and OTP login
*   **UI Components:** Radix UI, custom components
*   **Font Optimization:** `next/font` (Vazirmatn and Geist)

## Building and Running

This project uses `npm` for package management. Other package managers like `yarn`, `pnpm`, or `bun` can also be used.

### Development

To start the development server:

```bash
npm run dev
```

The application will be accessible at `http://localhost:3000`.

### Production Build

To build the application for production:

```bash
npm run build
```

### Starting Production Server

To start the built application in production mode:

```bash
npm run start
```

## Development Conventions

*   **Project Structure:** The `src` directory is organized into logical modules:
    *   `src/actions`: Contains Next.js server actions for backend logic (e.g., authentication, course management, question handling).
    *   `src/app`: Houses Next.js pages, layouts, and API routes.
    *   `src/components`: Divided into `admin`, `core`, `home`, `login`, and `ui` for structured component organization.
    *   `src/context`: Provides React context for state management (e.g., `AuthContext`, `LoginContext`).
    *   `src/lib`: Contains utility functions and configurations (e.g., Prisma client, session management).
    *   `src/assets/styles`: Global CSS definitions (`globals.css`).
*   **Styling:** Primarily uses Tailwind CSS for utility-first styling, complemented by Radix UI for foundational accessible components.
*   **Database:** PostgreSQL database schema is defined in `prisma/schema.prisma`. Prisma client is generated into `src/generated/prisma`. Migrations are managed within the `prisma/migrations` directory.
*   **Internationalization:** The application is configured for Persian (Farsi) language, indicated by `dir="rtl"` and `lang="fa"` in the main layout.
*   **Authentication Flow:** Leverages Next.js server actions (`src/actions/auth/`) for authentication. User sessions are managed via `src/lib/session.ts` using `jose` for secure token handling, and OTP for the login process.
*   **Component Structure:** Components are organized by feature or type, promoting reusability and maintainability.
