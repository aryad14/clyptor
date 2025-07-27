# Clyptor

Clyptor is an advanced authentication application built with Next.js 14, NextAuth.js, and NextUI. It provides a robust authentication system with features like email/password login, OAuth (Google, GitHub, Discord), two-factor authentication (2FA), password reset, and email verification.

## Features

- User registration and login with email/password
- OAuth login with Google, GitHub, and Discord
- Email verification for new users and email changes
- Two-factor authentication (2FA) via email code
- Password reset via email link
- User roles (Admin, User)
- Secure session management with JWT
- Responsive UI with NextUI and Tailwind CSS

## Tech Stack

- [Next.js 14](https://nextjs.org/docs/getting-started) (App Router)
- [NextAuth.js](https://next-auth.js.org/) for authentication
- [Prisma ORM](https://www.prisma.io/) with PostgreSQL
- [NextUI v2](https://nextui.org/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Zod](https://zod.dev/) for schema validation
- [React Hook Form](https://react-hook-form.com/) for form management
- [Resend](https://resend.com/) for transactional emails
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) for password hashing

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/clyptor.git
cd clyptor
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following variables:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

DISCORD_CLIENT_ID=your-discord-client-id
DISCORD_CLIENT_SECRET=your-discord-client-secret

RESEND_API_KEY=your-resend-api-key
NEXTAUTH_SECRET=your-random-secret
```

> Replace the placeholders with your actual credentials.

### 4. Set Up the Database

Run Prisma migrations to set up your database schema:

```bash
npx prisma migrate dev
```

Generate the Prisma client:

```bash
npx prisma generate
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## Folder Structure

- `app/` - Next.js app directory (routes, pages, layouts)
- `components/` - Reusable UI components
- `actions/` - Server actions for authentication and settings
- `lib/` - Utility functions and database access
- `prisma/` - Prisma schema and migrations
- `schema/` - Zod validation schemas
- `config/` - App configuration files
- `types/` - TypeScript type definitions

## License

This project is licensed under the [MIT License](LICENSE).

---

Feel free to contribute or open issues for improvements!