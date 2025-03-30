# JavaScriptNearMe.com

A platform for discovering and managing JavaScript-related events in your area.

## Project Structure

The project is organized into frontend and backend directories:

```
.
├── frontend/
│   ├── public/           # Static files
│   └── src/
│       ├── app/          # Next.js app directory
│       ├── components/   # Reusable React components
│       ├── contexts/     # React context providers
│       ├── services/     # API and external service integrations
│       ├── types/        # TypeScript type definitions
│       └── utils/        # Utility functions and helpers
│
├── backend/
│   └── src/
│       ├── config/       # Application configuration
│       ├── controllers/  # Route controllers
│       ├── middleware/   # Express middleware
│       ├── models/       # Data models
│       └── routes/       # API route definitions
│
└── config/              # Shared configuration files
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file:
   ```
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/javascriptnearme
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Events
- GET /api/events - Get all events
- GET /api/events/:id - Get specific event
- POST /api/events - Create new event (requires authentication)
- PUT /api/events/:id - Update event (requires authentication)
- DELETE /api/events/:id - Delete event (requires authentication)
- POST /api/events/:id/register - Register for an event (requires authentication)

## Technologies Used

- Backend:
  - Express.js
  - TypeScript
  - MongoDB with Mongoose
  - JWT Authentication

- Frontend:
  - Next.js
  - TypeScript
  - Tailwind CSS

## Development

The project uses TypeScript for both frontend and backend to ensure type safety and better development experience.

### Running Tests
```bash
npm test
```

### Building for Production
```bash
npm run build
```

## Errors

If you get any errors about missing dependencies, they might be related to Tailwind or TypeScript. In that case, you can run:

```bash
npm install tailwindcss postcss autoprefixer @types/react @types/node typescript
```