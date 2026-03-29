# Subscription Tracker API

A REST API built with Node.js and Express that helps users track and manage their subscriptions. Users can register, login and manage their subscriptions with features like renewal date tracking and spend summary.

## Tech Stack

- **Node.js** — runtime environment
- **Express.js** — web framework
- **MongoDB** — database
- **Mongoose** — MongoDB object modelling
- **JWT** — user authentication
- **Bcrypt** — password hashing
- **Express Validator** — input validation

## Features

- User registration and login with JWT authentication
- Full CRUD operations for subscriptions
- Auto calculation of renewal date based on billing cycle
- Get subscriptions expiring in the next 7 days
- Monthly and yearly spend summary
- Input validation and global error handling

## Project Structure
```
myapp/
├── controllers/
│   ├── userController.js
│   └── subscriptionController.js
├── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   └── Subscription.js
├── routes/
│   ├── userRoutes.js
│   └── subscriptionRoutes.js
└── index.js
```

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally

### Installation

1. Clone the repository
```
git clone https://github.com/Swati-ctr/subscription-tracker-api.git
```

2. Install dependencies
```
npm install
```

3. Run the server
```
npm run dev
```

Server runs on `http://localhost:3000`

## API Endpoints

### User Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/users/register | Register a new user |
| POST | /api/users/login | Login and get token |

### Subscription Routes

All subscription routes require Authorization header:
```
Authorization: Bearer <token>
```

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/subscriptions | Get all subscriptions |
| POST | /api/subscriptions | Create a subscription |
| PUT | /api/subscriptions/:id | Update a subscription |
| DELETE | /api/subscriptions/:id | Delete a subscription |
| GET | /api/subscriptions/expiring | Get subscriptions expiring in 7 days |
| GET | /api/subscriptions/summary | Get total spend summary |

## Sample Request

### Register
```json
POST /api/users/register
{
    "name": "Swati",
    "email": "swati@gmail.com",
    "password": "123456"
}
```

### Create Subscription
```json
POST /api/subscriptions
{
    "name": "Netflix",
    "plan": "basic",
    "price": 499,
    "billingCycle": "monthly"
}
```

### Summary Response
```json
{
    "subscriptionCount": 2,
    "totalMonthlySpend": 1998,
    "totalYearlySpend": 23976,
    "breakdown": [
        { "name": "Netflix", "price": 499, "billingCycle": "monthly" },
        { "name": "Amazon Prime", "price": 1499, "billingCycle": "monthly" }
    ]
}
