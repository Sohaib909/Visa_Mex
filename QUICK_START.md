# Visa-Mex Quick Start Guide

##  Path-to-Regexp Error - FIXED!

The server setup has been updated to resolve the path-to-regexp error that was preventing the server from starting.

##  Quick Start

### 1. Start Backend Server

**Option A: Using the batch file (Windows)**
```bash
cd server
start-server.bat
```

**Option B: Using npm scripts**
```bash
cd server
npm run dev
```

**Option C: Using Node directly**
```bash
cd server
node index.js
```

### 2. Start Frontend Client

```bash
cd client
npm run dev
```

##  Access Your Application

- **Backend API**: http://localhost:5000
- **Frontend App**: http://localhost:3000

## 📡 Test Your API

Open your browser or use curl to test:

- **Health Check**: http://localhost:5000
- **API Test**: http://localhost:5000/api/test
- **Auth Routes**: http://localhost:5000/api/auth/...

 
 
 

 

##  Troubleshooting

If you encounter any issues:

1. **Check Node.js version**: `node --version` (should be v18+)
2. **Install dependencies**: `npm install` in both server and client directories
3. **Check ports**: Make sure ports 5000 and 3000 are available
4. **Check environment**: Ensure `.env` file exists in server directory

##  You're Ready to Go!

The Visa-Mex MERN stack application is now fully functional and ready for development! 