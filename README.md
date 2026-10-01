# CampusFind - College Lost & Found Platform

A fully functional, polished, production-oriented College Lost & Found Platform built with a modern web stack. 

CampusFind helps college students report lost and found items, safely verify ownership via private chat and proof submission, and securely complete physical handovers using an OTP verification system.

## 🚀 Features

- **Authentication & User Management:** Secure login via Clerk (Google OAuth & Email).
- **Report Lost & Found Items:** Upload images directly to Cloudinary and provide detailed descriptions while keeping specific distinguishing features private.
- **Search & Browse:** Easily filter items by category, location, and type (Lost/Found).
- **Claim & Verify:** Safely claim an item. Claimants must provide textual or photographic proof of ownership securely.
- **Private Chat:** Built-in messaging system utilizing lightweight 5s HTTP polling to communicate without exposing phone numbers.
- **Physical OTP Handover:** Once approved, the finder initiates a handover. The system generates a secure 6-digit OTP given to the claimant, which the finder must verify upon physical meeting to mark the item as returned.
- **Dashboards:** Dedicated user dashboards to track personal reports and active claims. Includes an Admin dashboard for platform metrics.

## 🏗️ Architecture

```text
Clerk → Authentication & Session Management

Next.js (App Router) → Frontend UI, API Routes, & Server Actions

MongoDB Atlas → Persistence (Users, Items, Claims, Conversations, Messages, Handovers)

Cloudinary → Media Storage (Images & Ownership Proof Files)
```

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS, Lucide React
- **Database:** MongoDB Atlas (Mongoose)
- **Authentication:** Clerk
- **File Storage:** Cloudinary
- **Form Handling:** React Hook Form + Zod

## ⚙️ Setup & Local Development

### 1. Clone the repository
```bash
git clone <repository-url>
cd campus-find
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory based on `.env.example`:

```env
MONGODB_URI=your_mongodb_connection_string

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Setup MongoDB & Cloudinary
- Create a **MongoDB Atlas** cluster, grab the connection string, and add it to `MONGODB_URI`.
- Create a **Cloudinary** account, grab the credentials, and add them to the `.env.local`.
- Create a **Clerk** application, enable Google OAuth, and add the API keys. 
- (Optional but recommended) In Clerk Dashboard, add a Webhook endpoint pointing to `https://your-domain/api/webhooks/clerk` with `user.created`, `user.updated`, and `user.deleted` events.

### 5. Seed the Database
We provide a seed script to populate realistic dummy data for testing purposes.
```bash
npm run seed
```

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🚀 Deployment (Vercel)

This application is fully optimized for Vercel deployment.
1. Push your code to a GitHub repository.
2. Import the project into Vercel.
3. Add all the environment variables from `.env.local` into Vercel's Environment Variables settings.
4. Deploy!

Ensure you update your Clerk settings (URLs and Webhooks) to match your production domain.

# deploy
