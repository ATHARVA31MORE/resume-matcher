import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import ProfilePictureUpload from './components/ProfilePictureUpload';
import AuthForm from './components/AuthForm';
import ResumeUpload from './components/ResumeUpload';
import Dashboard from './components/Dashboard';
import './index.css';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import PrivacyPolicy from './components/PrivacyPolicy';

import ResumeBuilder from './components/ResumeBuilder';



function App() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
    });

    signOut(auth).catch(() => {});
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setToast('You have been logged out.');
    setTimeout(() => setToast(''), 3000);
  };

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 animate-gradient-xy opacity-20"></div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Navbar */}
          <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <Link
                  to="/"
                  className="text-xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  ResumeMatcher
                </Link>
                <div className="flex space-x-4 items-center">
                  <Link
                    to="/"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Home
                  </Link>
                  <Link
                    to="/about"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    About
                  </Link>
                  <Link
                    to="/resume-builder"
                    className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Resume Builder
                  </Link>
                  {user && (
                    <Link
                      to="/dashboard"
                      className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Dashboard
                    </Link>
                  )}
                  {user && (
                    <button
                      onClick={handleLogout}
                      className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-md text-sm font-medium"
                    >
                      Logout
                    </button>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Toast Notification */}
          {toast && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg animate-fade-in-out">
              {toast}
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/resume-builder" element={<ResumeBuilder />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/" element={<LandingPage user={user} />} />
              <Route
                path="/dashboard"
                element={user ? <DashboardPage user={user} /> : <Navigate to="/" replace />}
              />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-gray-50 border-t py-4 text-center text-sm text-gray-500">
            <p>
              &copy; {new Date().getFullYear()} ResumeMatcher.{' '}
              <Link to="/about" className="hover:underline text-blue-500">About</Link> |{' '}
              <Link to="/contact" className="hover:underline text-blue-500">Contact</Link> |{' '}
              <Link to="/privacy" className="hover:underline text-blue-500">Privacy Policy</Link>
            </p>
          </footer>
        </div>
      </div>
    </Router>
  );
}

function LandingPage({ user }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center bg-white bg-opacity-80 backdrop-blur-lg rounded-lg shadow-lg p-10 animate-slide-up">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
        AI-Powered Resume Matcher
      </h1>
      <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mb-6">
        Automatically match your resume to the best job openings and improve your chances with AI insights.
      </p>
      {user ? (
        <Link
          to="/dashboard"
          className="mt-4 inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-md shadow-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          Go to Dashboard
        </Link>
      ) : (
        <div className="w-full max-w-sm animate-flip">
          <AuthForm />
        </div>
      )}

      {/* About Section */}
      <div id="about" className="mt-16 text-left max-w-2xl">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">About ResumeMatcher</h2>
        <p className="text-gray-600 text-sm leading-relaxed">
          ResumeMatcher uses AI to analyze your resume and compare it to real-world job postings, giving
          you insight into how well you match various opportunities. Our platform aims to simplify your
          job search by providing personalized recommendations and actionable feedback.
        </p>
      </div>
    </div>
  );
}

function DashboardPage({ user }) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 sm:p-8">
        <ProfilePictureUpload
          user={user}
          onUploadSuccess={() => setRefreshKey((prev) => prev + 1)}
        />
        <div className="mt-8">
          <ResumeUpload user={user} />
        </div>
        <div className="mt-8">
          
          <Dashboard />
        </div>
      </div>
    </div>
  );
}

export default App;
