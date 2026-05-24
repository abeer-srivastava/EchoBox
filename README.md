# 🌐 EchoBox

**EchoBox** is a full-stack web app built with [Next.js](https://nextjs.org/) that lets users send and receive **anonymous messages**. It focuses on **privacy, security, and premium user experience**, making it perfect for honest feedback, playful secrets, and real connections.

---

## 🚀 Highlights

* 🔒 **Anonymous Messaging** — Send & receive messages without revealing sender identity.
* 🔑 **Secure Authentication** — Fully integrated sign-up, credentials login, and OTP email verification.
* 📬 **Real-Time Inbox** — Manage received notes with dynamic interactive status controls.
* 🎚 **Accept/Block Messages** — Close or open your inbox at will with settings toggles.
* 🤖 **AI-Powered Suggestions** — Instantly generate engaging prompts via Google Gemini.
* 🎨 **Premium Aesthetic** — Responsive, minimal dark-first Gold/Ochre theme featuring glassmorphism and Framer Motion micro-animations.
* ⚡ **High-Performance Pagination** — Database-level message pagination supporting growing list loads.
* 🚀 **Serverless Scaling** — Connection pooling and field projections tailored for MongoDB Atlas.

---

## 🛠 Tech Stack

* **Frontend:** Next.js 15, React, Tailwind CSS, Framer Motion, Lucide Icons
* **Backend:** Next.js API Routes (Serverless)
* **Database:** MongoDB Atlas (Mongoose ODM)
* **Auth:** NextAuth.js (JWT)
* **AI:** Google Gemini API
* **Email:** Resend + React Email
* **Validation:** Zod

---

## 📂 Core Scaling & Architecture Optimizations

### 1. Database-Level Offset Pagination
Instead of pulling the entire messages array into memory, EchoBox fetches messages page-by-page directly from the database using high-performance MongoDB aggregation pipelines:
* **Public Profile Feed**: Uses a double `$project` pipeline alongside `$filter` and `$sortArray` to fetch only replied messages, sorting them by `createdAt: -1` and slicing them for pagination.
* **Dashboard Inbox**: Paginated with a `$slice` projection and `$sortArray` to render the messages list with negligible database overhead.

### 2. Serverless Connection Caching & Pool Tuning
* Caches Mongoose connections and promises on the global scope (`globalThis.mongooseGlobal`) to prevent connection leakage across Next.js API route hot-reloads and cold starts.
* Custom pool sizing optimized for MongoDB Atlas shared tier limits: `maxPoolSize: 10`, `minPoolSize: 0`, and `maxIdleTimeMS: 30000`.

### 3. Lightweight Field Projections
Excludes the potentially heavy `messages` subdocument array across all authorization, username availability, registration, verification, and configuration status checks using query projections (e.g. `.select("-messages")`).

### 4. Atomic Write Operations
Appends new messages directly using MongoDB atomic `$push` operators (`UserModel.updateOne`) with manually generated `ObjectId` keys, bypassing parent document serialization/deserialization load loops.

---

## ⚡ Quick Start

```bash
npm install
npm run dev
```

Then open 👉 [http://localhost:3000](http://localhost:3000)

Set up `.env` with:

```env
MONGODB_URI=your-mongodb-uri
NEXTAUTH_SECRET=your-secret
RESEND_API_KEY=your-resend-key
```

---

## 👤 Author

Built by **Abeer Srivastava**  
Powered by **Next.js, MongoDB Atlas, NextAuth, Google Gemini**

---

## 📜 License

MIT License
