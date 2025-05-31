# Modern Login Form with Next.js

A modern, secure, and user-friendly authentication system built with Next.js, featuring a beautiful UI and robust form validation.

## Features

- 🔐 Secure authentication with NextAuth.js
- 📱 Responsive design with Tailwind CSS
- ✅ Form validation with React Hook Form
- 🔑 Password reset flow

## Tech Stack

- **Framework:** Next.js 15
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form
- **Database:** Prisma
- **Email:** Nodemailer
- **Validation:** Zod

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- A database (PostgreSQL recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/login-form.git
   cd login-form
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```env
   DATABASE_URL="your_database_url"
   NEXTAUTH_SECRET="your_nextauth_secret"
   NEXTAUTH_URL="http://localhost:3000"

   # Email configuration (for password reset)
   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER="your_email"
   EMAIL_SERVER_PASSWORD="your_password"
   EMAIL_FROM="noreply@example.com"

   # OAuth providers (optional)
   GOOGLE_CLIENT_ID="your_google_client_id"
   GOOGLE_CLIENT_SECRET="your_google_client_secret"
   GITHUB_ID="your_github_id"
   GITHUB_SECRET="your_github_secret"
   ```

4. Set up the database:

   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. Run the development server:
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
├── app/
│   ├── components/     # Reusable UI components
│   ├── login/         # Login page
│   ├── register/      # Registration page
│   ├── forgot-password/ # Password reset flow
│   └── reset-password/  # Password reset page
├── lib/               # Utility functions
└── types/            # TypeScript type definitions
```

## Features in Detail

### Form Validation

- Real-time validation as users type
- Password strength requirements
- Email domain validation
- Password confirmation matching
- Custom error messages

### Authentication

- Email/password authentication
- Social login with Google and GitHub
- Secure password reset flow
