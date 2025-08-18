# 🌐 Mystery Message

**Mystery Message** is a full-stack web app built with [Next.js](https://nextjs.org/) that lets users send and receive **anonymous messages**. It focuses on **privacy, security, and fun**, making it perfect for honest feedback, playful secrets, and real connections.

---

## 🚀 Highlights

* 🔒 Anonymous Messaging — Send & receive without revealing identity
* 🔑 Secure Authentication — Sign-up, login, email verification
* 📬 Real-Time Inbox — Sorted by newest first
* 🎚 Accept/Block Messages — Toggle receiving messages
* 🤖 AI-Powered Suggestions — Engaging prompts via Google Gemini
* 🎨 Modern UI — Responsive, light/dark themes
* 📧 Email Verification — Powered by Resend + React Email
* 🧑‍💻 Unique Profiles — Shareable links for each user

---

## 🛠 Tech Stack

* **Frontend:** Next.js, React, Tailwind CSS, Framer Motion
* **Backend:** Next.js API Routes, MongoDB (Mongoose)
* **Auth:** NextAuth.js (JWT)
* **AI:** Google Gemini
* **Email:** Resend + React Email
* **Validation:** Zod

---

## 📂 Core Features

* User registration with **real-time username check**
* Email verification before account activation
* Unique profile link: `/u/[username]`
* Secure login + JWT sessions
* Dashboard to manage messages
* AI-generated suggested questions

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
Powered by **Next.js, MongoDB, NextAuth, Google Gemini**

---

## 📜 License

MIT License
