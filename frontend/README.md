# RoomieConnect - Professional Frontend

A modern, professional roommate matching platform built with React, Tailwind CSS, and Framer Motion.

## 🚀 Features

### ✨ Modern Design
- **Professional UI/UX**: Clean, modern interface with smooth animations
- **Responsive Design**: Fully responsive across all device sizes
- **Dark/Light Mode**: Toggle between themes with persistent storage
- **Glass Morphism**: Modern glassmorphism effects and backdrop blur
- **Gradient Design**: Beautiful gradient backgrounds and buttons

### 🎯 Core Functionality
- **User Authentication**: Secure login and registration with form validation
- **AI-Powered Matching**: Advanced roommate matching algorithm
- **Advanced Filtering**: Comprehensive search and filter system
- **Preference Setup**: Multi-step onboarding process
- **Real-time Updates**: Dynamic UI updates and loading states

### 🛠 Technical Features
- **React Router**: Professional routing with protected routes
- **State Management**: Efficient state management with React hooks
- **API Integration**: RESTful API integration with error handling
- **Form Validation**: Comprehensive form validation and error states
- **Loading States**: Professional loading indicators and skeleton screens

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Professional navigation component
│   │   ├── RoommateCard.jsx    # Enhanced roommate card with interactions
│   │   ├── PreferenceForm.jsx  # Multi-step preference setup
│   │   └── ThemeToggle.jsx     # Dark/light mode toggle
│   ├── pages/
│   │   ├── Home.jsx            # Landing page with hero section
│   │   ├── Login.jsx           # Professional login page
│   │   ├── Register.jsx        # Multi-step registration
│   │   └── Dashboard.jsx       # Advanced roommate discovery
│   ├── App.jsx                 # Main app with routing
│   ├── App.css                 # Professional CSS styles
│   ├── index.css               # Tailwind CSS imports
│   └── api.js                  # API configuration
├── tailwind.config.js          # Tailwind configuration
└── package.json
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#3B82F6 to #8B5CF6)
- **Secondary**: Purple gradient (#8B5CF6 to #06B6D4)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)
- **Neutral**: Slate scale (#F8FAFC to #0F172A)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable text with proper hierarchy

### Components
- **Cards**: Rounded corners (2xl), soft shadows, hover effects
- **Buttons**: Gradient backgrounds, hover animations, disabled states
- **Forms**: Professional input styling with focus states
- **Navigation**: Fixed header with backdrop blur

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

### Environment Setup

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## 📱 Pages Overview

### 🏠 Home Page
- **Hero Section**: Compelling landing with call-to-action
- **Features Section**: Interactive feature showcase
- **Testimonials**: Social proof with user reviews
- **Statistics**: Trust indicators and metrics
- **CTA Section**: Conversion-focused call-to-action

### 🔐 Authentication
- **Login Page**: Professional login with demo account
- **Register Page**: Multi-step registration process
- **Form Validation**: Real-time validation with error states
- **Password Security**: Show/hide password functionality

### 🏠 Dashboard
- **Advanced Search**: Multi-criteria search functionality
- **Filter System**: University, year, major, preferences
- **Sort Options**: Compatibility, name, university
- **Roommate Cards**: Rich cards with compatibility scores
- **Responsive Grid**: Adaptive layout for all screen sizes

### ⚙️ Preferences
- **Multi-Step Form**: 4-step preference setup
- **Lifestyle Questions**: Cleanliness, noise, social level
- **Study Habits**: Academic preferences and schedules
- **Interests**: Hobby and interest selection
- **Bio Section**: Personal description and deal-breakers

## 🎯 Key Components

### Navbar
- **Responsive Design**: Mobile-first approach
- **User Menu**: Dropdown with profile options
- **Active States**: Current page highlighting
- **Theme Toggle**: Dark/light mode switching

### RoommateCard
- **Compatibility Score**: Visual progress bar
- **Interactive Elements**: Like, message, connect buttons
- **Expandable Details**: Show more/less functionality
- **Status Indicators**: Online status and verification

### PreferenceForm
- **Step Progress**: Visual progress indicator
- **Form Validation**: Real-time validation
- **Interactive Options**: Clickable preference cards
- **Navigation**: Back/next with validation

## 🎨 Styling

### Tailwind CSS
- **Custom Configuration**: Extended color palette and animations
- **Component Classes**: Reusable utility classes
- **Responsive Design**: Mobile-first breakpoints
- **Dark Mode**: Complete dark theme support

### Custom CSS
- **Animations**: Smooth transitions and hover effects
- **Glass Morphism**: Modern backdrop blur effects
- **Gradients**: Beautiful color transitions
- **Shadows**: Professional depth and elevation

## 🔧 API Integration

### Endpoints
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /users` - Fetch roommates
- `POST /users/preferences` - Save user preferences

### Error Handling
- **Network Errors**: Graceful error handling
- **Validation Errors**: Form-specific error messages
- **Loading States**: Professional loading indicators
- **Retry Logic**: Automatic retry for failed requests

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Features
- **Touch-Friendly**: Large touch targets
- **Swipe Gestures**: Natural mobile interactions
- **Collapsible Menus**: Space-efficient navigation
- **Optimized Forms**: Mobile-optimized input fields

## 🚀 Performance

### Optimization
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Optimized avatar generation
- **Bundle Size**: Minimal JavaScript bundle
- **Caching**: Efficient API response caching

### Loading States
- **Skeleton Screens**: Content placeholders
- **Progressive Loading**: Staggered content loading
- **Error Boundaries**: Graceful error handling
- **Retry Mechanisms**: Automatic retry logic

## 🎯 Accessibility

### Features
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and descriptions
- **Color Contrast**: WCAG compliant contrast ratios
- **Focus Management**: Clear focus indicators

## 🔒 Security

### Authentication
- **JWT Tokens**: Secure token-based authentication
- **Local Storage**: Secure token storage
- **Route Protection**: Protected route implementation
- **Form Validation**: Client and server-side validation

## 🚀 Deployment

### Build Process
```bash
npm run build
```

### Production Optimizations
- **Minification**: Minified CSS and JavaScript
- **Tree Shaking**: Unused code elimination
- **Asset Optimization**: Optimized images and fonts
- **CDN Ready**: Static asset optimization

## 📈 Future Enhancements

### Planned Features
- **Real-time Chat**: In-app messaging system
- **Video Calls**: Video chat integration
- **Push Notifications**: Real-time notifications
- **Advanced Matching**: ML-powered compatibility
- **Mobile App**: React Native mobile app

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Code Standards
- **ESLint**: Follow configured linting rules
- **Prettier**: Consistent code formatting
- **Component Structure**: Follow established patterns
- **Documentation**: Document new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Lucide React**: For the beautiful icon library
- **Framer Motion**: For smooth animations

---

**Built with ❤️ for students finding their perfect roommates**