# Visa-Mex - MERN Stack Application

A comprehensive visa application management system built with the MERN stack (MongoDB, Express.js, React, Node.js). This application streamlines the visa application process for Mexico with a modern, user-friendly interface and robust backend infrastructure.

## 🚀 Features

- **Modern UI/UX**: Built with React and Tailwind CSS
- **Secure Authentication**: JWT-based authentication system
- **Responsive Design**: Mobile-first responsive design
- **RESTful API**: Well-structured Express.js backend
- **Database Integration**: MongoDB with Mongoose ODM
- **Form Validation**: Comprehensive client and server-side validation
- **Error Handling**: Centralized error handling and user feedback

## 📁 Project Structure

```
visa-mex/
├── server/                 # Backend (Node.js + Express)
│   ├── config/            # Database and app configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware (auth, validation)
│   ├── models/           # MongoDB models (User, VisaApplication)
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   ├── index.js          # Main server file
│   └── package.json      # Backend dependencies
├── client/               # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components (Home, Login)
│   │   ├── routes/       # React Router setup
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   └── App.jsx       # Main App component
│   ├── public/           # Static assets
│   ├── tailwind.config.js # Tailwind CSS configuration
│   └── package.json      # Frontend dependencies
└── README.md             # Project documentation
```

## 🛠 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React 19** - Frontend framework
- **Vite** - Build tool and development server
- **React Router DOM v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting
- **Prettier** - Code formatting

##  Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd visa-mex
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../client
   npm install
   ```

### Environment Configuration

1. **Backend Environment** (`server/.env`)
   ```env
   # MongoDB Connection String
   MONGO_URI=mongodb://localhost:27017/visa-mex
   
   # JWT Secret for token generation
   JWT_SECRET=your_super_secret_jwt_key_here
   
   # Server Port
   PORT=5000
   
   # Node Environment
   NODE_ENV=development
   ```

2. **Frontend Environment** (`client/.env` - optional)
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   The backend server will run on `http://localhost:5000`

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

##  Available Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests (to be implemented)

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## 🔗 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)

### Test Routes
- `GET /api/test` - Public test route
- `GET /api/test/protected` - Protected test route
- `GET /api/test/admin` - Admin-only test route
- `POST /api/test/echo` - Echo request body

## UI Components

### Pages
- **Home** - Landing page with features and call-to-action
- **Login** - User authentication form
- **404** - Page not found error page

### Styling
- Custom Tailwind CSS components in `src/index.css`
- Responsive design with mobile-first approach
- Professional color scheme with primary blue theme

##  Authentication System

- JWT-based stateless authentication
- Password hashing with bcrypt
- Protected routes middleware
- Role-based access control (user/admin)
- Token expiration handling

## 🗄 Database Models

### User Model
- Personal information (name, email, phone)
- Authentication data (hashed password)
- Account status and verification
- Role-based permissions

### VisaApplication Model
- Complete applicant information
- Passport and travel details
- Application status tracking
- Document management
- Status history and admin review

## Development Workflow

1. **Code Standards**
   - ESLint for code quality
   - Prettier for consistent formatting
   - Git hooks for pre-commit checks (to be added)

2. **Testing** (to be implemented)
   - Unit tests for utilities and components
   - Integration tests for API endpoints
   - End-to-end testing with Cypress

3. **Deployment** (to be configured)
   - Frontend: Vercel/Netlify
   - Backend: Heroku/Railway
   - Database: MongoDB Atlas

##  Known Issues & TODO

- [ ] Connect frontend to backend API
- [ ] Implement email verification
- [ ] Add file upload functionality
- [ ] Implement password reset feature
- [ ] Add comprehensive form validation
- [ ] Set up testing framework
- [ ] Add CI/CD pipeline
- [ ] Implement logging system
- [ ] Add rate limiting
- [ ] Optimize for production



 