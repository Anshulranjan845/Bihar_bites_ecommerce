# Bihar Bites 🍛

A modern full-stack ecommerce platform built to bring the authentic flavors of Bihar online.

Bihar Bites is designed as a scalable modular monolith architecture that allows users to explore and order traditional Bihari sweets, snacks, and regional food products through a smooth and interactive shopping experience.

---

# 🚀 Live Demo

## Frontend

* [https://bihar-bites-ecommerce-nvc3.vercel.app](https://bihar-bites-ecommerce-nvc3.vercel.app)

## Backend API

* [https://bihar-bites-ecommerce.onrender.com/api/v1](https://bihar-bites-ecommerce.onrender.com/api/v1)

---

# ✨ Features

## 👤 Authentication & Authorization

* JWT Authentication
* Secure HTTP-only cookie-based auth
* Role-based authorization
* Protected routes
* Persistent login sessions

## 🛍 Ecommerce Features

* Product listing and browsing
* Category-based filtering
* Add to cart functionality
* Update cart quantity
* Remove cart items
* Dynamic cart management
* Order placement workflow
* Product availability handling

## 🎨 Frontend Experience

* Responsive modern UI
* Smooth animations using Framer Motion
* Interactive product cards
* Loading states and API handling
* Reusable modular components
* Mobile-friendly design

## ⚙ Backend Architecture

* Modular Monolith Architecture
* RESTful API design
* Prisma ORM integration
* PostgreSQL database management
* Middleware-based authentication
* Centralized error handling
* Clean folder structure

## ☁ Deployment

* Frontend deployed on Vercel
* Backend deployed on Render
* PostgreSQL hosted on NeonDB
* Production-ready environment setup

---

# 🧠 Tech Stack

## Frontend

| Technology            | Purpose           |
| --------------------- | ----------------- |
| React.js              | UI Development    |
| Tailwind CSS          | Styling           |
| Framer Motion         | Animations        |
| Axios                 | API Communication |
| React Router DOM      | Routing           |
| Zustand / Context API | State Management  |

## Backend

| Technology    | Purpose             |
| ------------- | ------------------- |
| Node.js       | Runtime Environment |
| Express.js    | Backend Framework   |
| Prisma ORM    | Database ORM        |
| PostgreSQL    | Database            |
| JWT           | Authentication      |
| Cookie Parser | Cookie Handling     |
| Zod           | Validation          |

## DevOps & Deployment

| Platform | Usage              |
| -------- | ------------------ |
| Vercel   | Frontend Hosting   |
| Render   | Backend Hosting    |
| NeonDB   | Managed PostgreSQL |
| GitHub   | Version Control    |

---

# 🏗 Project Architecture

```bash
Bihar_Bites_Ecommerce/
│
├── client/                 # React Frontend
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── services/
│   └── store/
│
├── server/                 # Node Backend
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── product/
│   │   │   ├── category/
│   │   │   ├── cart/
│   │   │   ├── order/
│   │   │   └── user/
│   │   │
│   │   ├── middleware/
│   │   ├── lib/
│   │   ├── utils/
│   │   └── config/
│   │
│   ├── prisma/
│   └── server.js
│
└── README.md
```

---

# 🔐 Authentication Flow

```text
User Login/Register
        ↓
JWT Token Generated
        ↓
Stored in HTTP-only Cookie
        ↓
Frontend sends credentials with requests
        ↓
Backend Middleware verifies token
        ↓
Protected routes accessible
```

---

# ⚡ API Structure

```bash
/api/v1/auth
/api/v1/users
/api/v1/products
/api/v1/categories
/api/v1/cart
/api/v1/orders
/api/v1/payments
/api/v1/admin
```

---

# 📦 Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Anshulranjan845/Bihar_bites_ecommerce.git
```

---

## 2️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 3️⃣ Setup Backend

```bash
cd server
npm install
```

---

## 4️⃣ Configure Environment Variables

### Backend `.env`

```env
PORT=5000
DATABASE_URL=your_postgres_database_url
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 5️⃣ Run Prisma

```bash
npx prisma generate
npx prisma migrate dev
```

---

## 6️⃣ Start Backend

```bash
npm run dev
```

---

# 🌍 Production Deployment

## Frontend Deployment

* Hosted on Vercel
* Environment variables configured
* Production API integration

## Backend Deployment

* Hosted on Render
* Prisma client generation during build
* Secure production cookie handling
* CORS configuration for frontend integration

## Database

* PostgreSQL hosted on NeonDB
* Prisma ORM for schema management

---

# 🧩 Key Engineering Highlights

* Modular Monolith backend architecture
* Scalable folder organization
* Production-grade authentication flow
* Cross-origin cookie authentication
* Secure JWT handling
* Prisma relational schema management
* REST API versioning
* Responsive UI with smooth animations
* Full deployment pipeline setup

---

# 📸 Future Enhancements

* Razorpay / Stripe payment integration
* Order tracking system
* Wishlist functionality
* Product reviews & ratings
* Admin analytics dashboard
* Real-time notifications
* Search & filtering improvements
* Recommendation engine
* Image optimization & CDN integration

---

# 👨‍💻 Author

## Anshul Gulati

Passionate Full Stack Developer focused on building scalable and production-ready web applications.

* Full Stack Development
* Backend Architecture
* React Ecosystem
* Node.js APIs
* Database Design
* DevOps & Deployment

---

# ⭐ Support

If you like this project, consider giving it a star on GitHub ⭐

---

# 📄 License

This project is licensed under the MIT License.
