# 🌍 Momento - Your Digital Travel Journal

[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-11.9.1-FFCA28?logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.10-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Immortalize Your Journey** - A modern, full-stack travel journal application that lets you document adventures, preserve memories, and share your stories with the world.

![Momento App Preview](https://via.placeholder.com/800x400/1F2937/FFFFFF?text=Momento+Travel+Journal)

## ✨ Features

### 🗺️ **Interactive World Map**
- **Global Trip Visualization**: Explore all public trips on an interactive world map
- **Journey Tracking**: View travel routes and patterns across different users
- **Location Clustering**: Smart marker clustering for better map performance
- **Real-time Filtering**: Filter trips by region, year, and privacy settings

### 📸 **Rich Media Support**
- **Cloudinary Integration**: High-performance image upload and optimization
- **Photo Galleries**: Multiple images per trip with beautiful galleries
- **Cover Images**: Stunning cover photos for each travel journal
- **Responsive Design**: Optimized for all devices and screen sizes

### 🔐 **User Authentication & Privacy**
- **Firebase Auth**: Secure email/password authentication
- **Privacy Controls**: Choose between public and private journals
- **User Dashboard**: Personal space to manage all your trips
- **Protected Routes**: Secure access to user-specific features

### 🎨 **Modern UI/UX**
- **Dark/Light Theme**: Toggle between themes with smooth transitions
- **Framer Motion**: Beautiful animations and micro-interactions
- **Tailwind CSS**: Modern, utility-first styling
- **Responsive Design**: Mobile-first approach with perfect desktop experience

### 📍 **Location Intelligence**
- **Autocomplete Search**: Smart location search with suggestions
- **GPS Coordinates**: Precise location tracking for each trip
- **Map Integration**: Seamless integration with Leaflet maps
- **Geographic Data**: Rich location metadata and statistics

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase Account** (for backend services)
- **Cloudinary Account** (for image storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/momento.git
   cd momento
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
momento/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.jsx     # Navigation header
│   │   ├── TripCard.jsx   # Trip display cards
│   │   ├── MapInput.jsx   # Map interaction components
│   │   └── LocationAutocomplete.jsx
│   ├── context/           # React context providers
│   │   └── AuthContext.jsx
│   ├── lib/               # External service configurations
│   │   └── firebase.js
│   ├── pages/             # Application pages
│   │   ├── HomePage.jsx   # Landing page
│   │   ├── DashboardPage.jsx
│   │   ├── CreateTripPage.jsx
│   │   ├── TripDetailPage.jsx
│   │   ├── AllTripsMap.jsx
│   │   └── AuthPage.jsx
│   ├── utils/             # Utility functions
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Application entry point
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Tech Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Production-ready motion library
- **React Router DOM** - Client-side routing

### Backend & Services
- **Firebase** - Authentication, Firestore database, and hosting
- **Cloudinary** - Cloud image and video management
- **Leaflet** - Interactive maps with React Leaflet

### Development Tools
- **ESLint** - Code linting and formatting
- **Git** - Version control

## 📱 Key Features Deep Dive

### Interactive World Map
The application features a sophisticated world map that visualizes all travel data:

- **Journey Mode**: View travel routes and patterns
- **Statistics Mode**: Explore travel statistics and insights
- **Real-time Updates**: Live data synchronization
- **Advanced Filtering**: Filter by region, year, and privacy

### Trip Creation & Management
Create rich travel journals with:

- **Location Autocomplete**: Smart location search
- **Photo Upload**: Drag-and-drop image uploads
- **Gallery Support**: Multiple images per trip
- **Privacy Settings**: Public or private journals
- **Rich Descriptions**: Detailed trip documentation

### User Experience
Modern, intuitive interface with:

- **Dark/Light Themes**: Seamless theme switching
- **Smooth Animations**: Framer Motion powered interactions
- **Responsive Design**: Perfect on all devices
- **Loading States**: Beautiful loading indicators

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Configure security rules
5. Add your Firebase config to environment variables

### Cloudinary Setup
1. Create a Cloudinary account
2. Create an upload preset
3. Configure environment variables
4. Set up image transformations (optional)

## 📊 Performance Optimizations

- **Image Optimization**: Cloudinary automatic optimization
- **Lazy Loading**: Components and images loaded on demand
- **Code Splitting**: Route-based code splitting
- **Caching**: Firebase offline support
- **Bundle Optimization**: Vite's efficient bundling

## 🚀 Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
# Deploy dist folder
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Vite Team** - For the lightning-fast build tool
- **Firebase Team** - For the powerful backend services
- **Tailwind CSS Team** - For the utility-first CSS framework
- **Framer Motion Team** - For the beautiful animations

## 📞 Support

- **Documentation**: [Wiki](https://github.com/yourusername/momento/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/momento/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/momento/discussions)

---

<div align="center">
  <p>Made with ❤️ by Beamlak</p>
  <p>Share your adventures with the world! 🌍</p>
</div>
