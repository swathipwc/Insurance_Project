# Insurance Management System - Frontend Project Structure

## ✅ Project Complete

This is a React + Vite frontend application with official, professional styling using:
- **Colors**: Black, Gray, White, and Blue
- **Font Sizes**: Smaller official sizes (12px-36px range)
- **UI Style**: Clean, professional, business-appropriate

## 📁 Folder Structure

```
vid-pro/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── common/           # Reusable UI components
│   │   ├── auth/             # Authentication components
│   │   ├── customer/         # Customer-related components
│   │   ├── policy/           # Policy-related components
│   │   ├── claim/            # Claim-related components
│   │   └── activity/        # Activity log components
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── customer/        # Customer pages
│   │   └── admin/           # Admin/Agent pages
│   ├── context/              # React Context providers
│   ├── services/             # API service layer
│   ├── utils/                # Helper functions
│   ├── hooks/                # Custom React hooks
│   ├── styles/               # CSS files
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

## 🎨 Design System

### Colors
- **Primary Blue**: #2563eb
- **Black**: #000000
- **Gray Scale**: Multiple shades from #1f2937 to #e5e7eb
- **White**: #ffffff

### Typography
- **Headings**: 24px-36px (larger)
- **Body Text**: 14px-16px (smaller, official)
- **Labels/Captions**: 12px-14px

### Components
All components follow consistent styling with:
- Small, professional font sizes
- Clean borders and shadows
- Proper spacing
- Official color scheme

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

3. Run development server:
```bash
npm run dev
```

## 📋 Features Implemented

### Authentication
- ✅ Login with role selection
- ✅ JWT token management
- ✅ Protected routes
- ✅ Role-based access control

### Customer Features
- ✅ Dashboard with statistics
- ✅ View policies
- ✅ View claims
- ✅ Submit new claims
- ✅ Search and filter

### Admin/Agent Features
- ✅ Dashboard with overview
- ✅ Customer management (CRUD)
- ✅ Policy management (CRUD + Assign)
- ✅ Claims review and status update
- ✅ Search and filter capabilities

### Common Features
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Form validation
- ✅ Professional UI/UX

## 🔌 API Integration

All API services are ready and configured to connect to backend endpoints:
- Authentication endpoints
- Customer endpoints
- Policy endpoints
- Claim endpoints
- Activity log endpoints

## 📝 Notes

- All components use `.jsx` extension as requested
- Styling is professional and official
- Font sizes are smaller and appropriate for business use
- Color scheme strictly follows: Black, Gray, White, Blue
- Ready for backend integration

