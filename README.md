# TrekHaven

A full-stack booking platform for homestays and treks, featuring user registration, booking management, payment processing, admin dashboard, and more.

## Project Structure

```
TrekHaven/
│── backend/
│     ├── app.js
│     ├── server.js
│     ├── config/
│     ├── controllers/
│     ├── cronJobs/
│     ├── database/
│     ├── helper/
│     ├── middleware/
│     ├── models/
│     ├── Routes/
│     ├── services/
│      └── utils/
│   ── .gitignore
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── README.md
└── .gitignore
```

## Features

- User authentication (JWT, OTP)
- Booking management (create, update, cancel)
- Payment integration
- Refund requests
- Admin dashboard (manage users, bookings, reviews)
- Email notifications
- Responsive frontend (React, Tailwind CSS)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- MongoDB (local or cloud)
- Redis (for caching, optional)

### Backend Setup

1. Navigate to backend folder:
    ```sh
    cd backend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Configure environment variables in `config/config.env`.
4. Start the server:
    ```sh
    npm start
    ```

### Frontend Setup

1. Navigate to frontend folder:
    ```sh
    cd frontend
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Configure environment variables in `.env`.
4. Start the development server:
    ```sh
    npm run dev
    ```

## Folder Overview

- **backend/**: Express.js server, REST API, business logic, database models.
- **frontend/**: React app, UI components, pages, state management.
- **public/**: Static assets (images, videos).
- **src/Components/**: Reusable React components.
- **src/pages/**: Route-based React pages.
- **src/store/**: Redux store and slices.

## Scripts

- **Backend**
    - `npm start` — Start backend server
    - `npm run dev` — Start backend in development mode (nodemon)
- **Frontend**
    - `npm run dev` — Start frontend development server
    - `npm run build` — Build frontend for production

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please open an issue or contact the maintainer.
