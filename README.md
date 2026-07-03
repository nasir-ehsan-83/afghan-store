# 🛒 Afghan Store

A modern full-stack e-commerce platform built with **React**, **Express.js**, and **MongoDB**. The project follows a scalable architecture with secure authentication, clean code practices, and a modern user experience.

---

## 🚀 Tech Stack

### Backend
* Node.js
* Express.js
* MongoDB & Mongoose
* Zod (Validation)

### Frontend
* React.js (Vite)
* Tailwind CSS

---

## 📂 Project Structure

```text
afghan-store/
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .example.env
│   ├── package-lock.json
│   └── package.json
│
├── app/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## ✨ Features

### Authentication & Security
* **RBAC:** Role-Based Access Control for Users and Admins.
* **Tokens:** JWT Authentication with Refresh Token Rotation.
* **Cookies:** Secure, HttpOnly cookie handling.
* **Hashing:** Secure password hashing with Bcrypt.
* **Validation:** Strict input and output data validation via Zod.
* **Error Handling:** Centralized asynchronous error handling middleware.

### Products & Core Logistics
* Product CRUD operations and category management.
* Advanced search, filtering, and pagination.
* Dynamic shopping cart and checkout system.
* Order history tracking.

---

## 🛠️ Installation & Setup

### Clone the Repository
```bash
git clone https://github.com
cd afghan-store
```

### Backend Setup
```bash
cd server
npm install
npm run dev
```

### Frontend Setup
```bash
cd ../app
npm install
npm run dev
```

---
<!-- 
## 🗺️ Roadmap & Future Improvements

* [ ] Payment Gateway Integration (Safaripay, Stripe, etc.)
* [ ] Email Verification & Password Reset Flow
* [ ] Comprehensive Admin & Vendor Dashboard
* [ ] User Wishlist & Product Reviews/Ratings
* [ ] Redis Caching for High-Performance Data Retrieval
* [ ] Elasticsearch Integration for Complex Queries
* [ ] Docker Containerization Support
* [ ] Real-Time User Notifications via WebSockets

--- -->

## 👨‍💻 Author

**Nasir Ahmad Ehsan**  
*Backend Developer*  

* **GitHub:** [://github.com](https://://github.com)
* **LinkedIn:** [://linkedin.com](https://://linkedin.com)

---

## 📄 License

This project is licensed under the MIT License.
