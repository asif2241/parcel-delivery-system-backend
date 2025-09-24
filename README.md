# PARCEL DELIVERY SYSTEM (BACKEND)

#### The **Parcel Delivery System** is a full-stack web application designed to manage the lifecycle of parcel delivery — from booking to final delivery. This system is a secure, modular and supports multiple user roles (Admin, Sender, Receiver) and offers features such as real-time tracking, status updates, and role-based access control.

---

## Core Features

- **🔐 Secure Authentication**: Implements a JWT (JSON Web Token) based system for secure user login and session management, with password hashing using bcrypt.

- **🎭 Role-Based Access Control (RBAC)**: Features three distinct user roles— ==Admin==, ==Sender==, and ==Receiver== —each with a specific set of permissions to ensure data integrity and security.

- **📦 Complete Parcel Lifecycle Management:**: Senders can create, manage, cancel, and Receivers can receive parcels. The system handles all status transitions logically.

- **🔍 Real-Time Tracking System:**: Every parcel is assigned a unique, trackable ID. The embedded status history allows users to monitor the parcel's journey from origin to destination

- **⚙️ Admin Oversight:**: A powerful Admin role with the ability to view and manage all users and parcels, update delivery statuses, and ensure the smooth operation of the system.

---

## ⚙️ Technologies Used:

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Validation**: Zod
- **Social Login**: PassportJS
- **Authentication**: JWT, Role-based auth
- **File Upload**: Multer + Cloudinary
- **Password Hashing**: Bcyptjs
- **Others**: TypeScript, Dotenv, ESLint, Postman

---

## API DETAILS:

### 🔐 Authentication

| **Method** | **Endpoints**             | **Description**                                    | **Access**            |
| ---------- | ------------------------- | -------------------------------------------------- | --------------------- |
| _POST_     | ==/auth/login==           | Register a new user                                | Public                |
| _POST_     | ==/auth/refresh-token==   | Create a new Access Token With Refresh Toke        | ADMIN,SENDER,RECEIVER |
| _POST_     | ==/auth/logout==          | Logout a LoggedIn User                             | ADMIN,SENDER,RECEIVER |
| _POST_     | ==/auth/change-password== | Changing Password                                  | ADMIN,SENDER,RECEIVER |
| _POST_     | ==/auth/set-password==    | Google Registered User Can Set Password            | ADMIN,SENDER,RECEIVER |
| _POST_     | ==/auth/forgot-password== | OTP sent to Password Forgotted Users               | ADMIN,SENDER,RECEIVER |
| _POST_     | ==/auth/reset-password==  | Users who forgot their password can reset password | ADMIN,SENDER,RECEIVER |

---

### 🔐 OTP

| **Method** | **Endpoints**        | **Description** | **Access** |
| ---------- | -------------------- | --------------- | ---------- |
| _POST_     | ==/otp/send-otp==    | Send OTP        | Public     |
| _POST_     | ==/otop/verify-otp== | Verify OTP      | Public     |
