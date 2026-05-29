# BeingFit Backend API

Backend service powering the BeingFit B2B gym equipment e-commerce platform.

The API handles product management, user authentication, shopping cart operations, order processing, payment verification, image uploads, and database persistence. It serves as the core business logic layer between the frontend application and external services.

---

## Features

* Session-based user authentication
* Product management APIs
* Shopping cart operations
* Order processing workflows
* Razorpay payment integration
* Server-side payment signature verification
* Cloudinary image upload and management
* Secure file handling with Multer
* MongoDB data persistence
* Protected routes and middleware
* Environment-based configuration

---

## Tech Stack

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* Express Session
* Connect Mongo
* Bcrypt

### Payments

* Razorpay
* HMAC-SHA256 Signature Verification

### Media Management

* Cloudinary
* Multer

---

## System Architecture

```text
Customer
    |
    v
React Frontend
    |
    v
Express Backend
    |
    +------ MongoDB Atlas
    |
    +------ Razorpay
    |
    +------ Cloudinary
```

The backend acts as the central service layer responsible for authentication, payment processing, business logic, media management, and database operations.

---

## Core Modules

### Authentication

Handles user registration, login, session management, and route protection.

### Product Management

Provides APIs for creating, updating, retrieving, and managing gym equipment products.

### Cart Management

Maintains user shopping carts and synchronizes product selections.

### Order Processing

Manages checkout workflows and order creation.

### Payment Verification

Verifies Razorpay transactions using server-side cryptographic signature validation.

### Media Service

Uploads and manages product images through Cloudinary.

---

## Security Features

* Session-based authentication
* Password hashing using bcrypt
* Protected API routes
* Secure environment variables
* Server-side payment verification
* HTTP-only session cookies
* MongoDB session persistence

---

## Payment Workflow

```text
Customer Checkout
        |
        v
Razorpay Payment Gateway
        |
        v
Payment Success Callback
        |
        v
Backend Signature Verification
        |
        v
Order Confirmation
```

Payments are verified on the server using HMAC-SHA256 signature validation before orders are marked as successful.

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

---

## Environment Variables

Create a `.env` file:

```env
PORT=
MONGODB_URI=
SESSION_SECRET=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=
```

---

## Related Repositories

### Frontend Application

BeingFit React Frontend

### Admin Dashboard

BeingFit Admin Panel

---

## Future Improvements

* Product search and filtering
* Inventory management
* Order tracking
* Admin analytics dashboard
* Redis caching
* Role-based access control (RBAC)

---

## Author

**Bhaskar Tiwari**

GitHub: https://github.com/EmulationNerds685
