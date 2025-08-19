# BRISTLETECH CRM

A modern, full-stack CRM application built with React, Node.js, Express, and MongoDB. Features role-based authentication and comprehensive lead management.

## 🚀 Features

- **Role-Based Authentication**: Admin, Sales Manager, and Sales Member roles
- **Lead Management**: Create, update, and track leads through the sales pipeline
- **Dashboard Analytics**: Real-time statistics and performance metrics
- **Team Management**: Track team performance and individual contributions
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🏗️ Project Structure

```
├── server/                 # Backend API server
│   ├── db/
│   │   ├── models/        # MongoDB models
│   │   └── seed.js        # Database seeding script
│   ├── routes/            # API routes
│   ├── middleware/        # Authentication middleware
│   └── index.js           # Server entry point
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── services/      # API service layer
│   │   └── context/       # React context providers
│   └── public/            # Static assets
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd bristletech-crm
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bristletech_crm
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
NODE_ENV=development
```

**Important**: Replace `MONGODB_URI` with your actual MongoDB connection string.

### 4. Database Setup

Seed the database with initial data:
```bash
cd server
npm run seed
```

This will create:
- Admin user: `admin@company.com` / `password123`
- Sales Manager: `manager@company.com` / `password123`
- Sales Members: `alice@company.com` / `password123`, `bob@company.com` / `password123`
- Sample leads data

## 🚀 Running the Application

### Development Mode
```bash
# From the root directory
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Production Mode
```bash
# Build the client
cd client
npm run build

# Start the server
cd ../server
npm start
```

## 👥 User Roles & Access

### Admin
- Full access to all features
- Can view all leads and team performance
- Access to admin dashboard with comprehensive analytics

### Sales Manager
- Can view and manage team members' leads
- Access to team performance metrics
- Can generate reports

### Sales Member
- Can only view and manage their assigned leads
- Personal performance dashboard
- Limited access to team data

## 🔐 Authentication

The application uses JWT (JSON Web Tokens) for authentication:
- Tokens are stored in localStorage
- Automatic token refresh on API calls
- Role-based route protection

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Leads
- `GET /api/leads` - Get leads (filtered by role)
- `POST /api/leads` - Create new lead
- `PUT /api/leads/:id` - Update lead
- `DELETE /api/leads/:id` - Delete lead (admin/manager only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## 🎨 UI Components

The application uses a custom component library built with:
- Radix UI primitives
- Tailwind CSS for styling
- Lucide React for icons
- Responsive design principles

## 🔧 Development

### Adding New Features
1. Create API endpoints in `server/routes/`
2. Add corresponding service functions in `client/src/services/`
3. Create React components in `client/src/components/`
4. Add new pages in `client/src/pages/`

### Database Models
- **User**: Authentication and role management
- **Lead**: Lead information and tracking
- Additional models can be added in `server/db/models/`

## 🚀 Deployment

### Environment Variables for Production
```env
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
NODE_ENV=production
```

### Build Commands
```bash
# Build client for production
cd client
npm run build

# Start production server
cd ../server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support or questions, please contact the development team or create an issue in the repository.