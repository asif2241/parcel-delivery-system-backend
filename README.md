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

| **Method** | **Endpoints**         | **Description**                                    | **Access**            |
| ---------- | --------------------- | -------------------------------------------------- | --------------------- |
| _POST_     | /auth/login           | Register a new user                                | Public                |
| _POST_     | /auth/refresh-token   | Create a new Access Token With Refresh Toke        | ADMIN,SENDER,RECEIVER |
| _POST_     | /auth/logout          | Logout a LoggedIn User                             | ADMIN,SENDER,RECEIVER |
| _POST_     | /auth/change-password | Changing Password                                  | ADMIN,SENDER,RECEIVER |
| _POST_     | /auth/set-password    | Google Registered User Can Set Password            | ADMIN,SENDER,RECEIVER |
| _POST_     | /auth/forgot-password | OTP sent to Password Forgotted Users               | ADMIN,SENDER,RECEIVER |
| _POST_     | /auth/reset-password  | Users who forgot their password can reset password | ADMIN,SENDER,RECEIVER |

---

### 🔐 OTP

| **Method** | **Endpoints**    | **Description** | **Access** |
| ---------- | ---------------- | --------------- | ---------- |
| _POST_     | /otp/send-otp    | Send OTP        | Public     |
| _POST_     | /otop/verify-otp | Verify OTP      | Public     |

---

### 🔐 PARCELS

| **Method** | **Endpoints**                   | **Description**                                                                                                                                                                                                                       | **Access**              |
| ---------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| _POST_     | /parcel/create-parcel           | Create a New Parcel                                                                                                                                                                                                                   | ADMIN, SENDER           |
| _GET_      | /parcel/all-parcel              | Accessible by Admins, Senders, and Receivers. However, access is controlled with validations: Admin can see all parcels,Sender can only see parcels they have created,Receiver can only see the parcels assigned to them for delivery | ADMIN, SENDER, RECEIVER |
| _GET_      | /parcel/:id                     | Retrive a single parcel by id                                                                                                                                                                                                         | ADMIN, SENDER, RECEIVER |
| _PATCH_    | /parcel/cancel/:id              | Sender can canel a parcel through this api if it is not dispatched yet                                                                                                                                                                | SENDER                  |
| _GET_      | /parcel/track/:trackingId       | Anyone can track a parcel by this API                                                                                                                                                                                                 | PUBLIC                  |
| _PATCH_    | /parcel/update-status/:parcelId | ADMIN or SUPER_ADMIN can use this API to change the parcel status log                                                                                                                                                                 | ADMIN, SUPER_ADMIN      |

---

### 🔐 USER RELATED API:

| **Method** | **Endpoints**   | **Description**               | **Access**                           |
| ---------- | --------------- | ----------------------------- | ------------------------------------ |
| _POST_     | /user/register  | Register a New User           | PUBLIC                               |
| _GET_      | /user/all-users | Retrive All Users             | ADMIN, SUPER_ADMIN                   |
| _GET_      | /user/me        | Retrive a Authenticated User  | ADMIN, SUPER_ADMIN, SENDER, RECEIVER |
| _PATCH_    | /user/:id       | User can update their profile | ADMIN, SUPER_ADMIN, SENDER, RECEIVER |
| _PATCH_    | /block/:id      | Admins can block any user     | ADMIN, SUPER_ADMIN                   |
| _PATCH_    | /unBlock/:id    | Admins can unblock any user   | ADMIN, SUPER_ADMIN                   |
