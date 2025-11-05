import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import PageTransition from './components/PageTransition';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import CustomizationPage from './pages/CustomizationPage';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CategoryExplorePage from './pages/CategoryExplorePage';
import ProfilePage from './pages/ProfilePage';
import BlogPost from './pages/BlogPost';
import EventsPage from './pages/EventsPage';
import UserProfilePage from './pages/UserProfilePage';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [selectedArtist, setSelectedArtist] = useState(null);

  const handleGetStarted = () => {
    setCurrentPage('login');
  };

  const handleLogin = () => {
    setCurrentPage('customization');
  };

  const handleCustomizationComplete = () => {
    setCurrentPage('home');
  };

  const handleNavigateToExplore = () => {
    setCurrentPage('explore');
  };


  const handleArtistClick = (artist) => {
    setSelectedArtist(artist);
    setCurrentPage('profile');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setSelectedArtist(null);
  };

  const handleBackToCategoryExplore = () => {
    setCurrentPage('categoryExplore');
    setSelectedArtist(null);
  };

  const handleNavigateToEvents = () => {
    setCurrentPage('events');
  };

  const handleBackFromEvents = () => {
    setCurrentPage('home');
  };

  const handleNavigateToUserProfile = () => {
    setCurrentPage('userProfile');
  };

  const handleBackFromUserProfile = () => {
    setCurrentPage('home');
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'landing':
        return (
          <PageTransition isActive={true} transitionKey="landing">
            <LandingPage onGetStarted={handleGetStarted} />
          </PageTransition>
        );
      case 'login':
        return (
          <PageTransition isActive={true} transitionKey="login">
            <LoginPage onLogin={handleLogin} />
          </PageTransition>
        );
      case 'customization':
        return (
          <PageTransition isActive={true} transitionKey="customization">
            <CustomizationPage onComplete={handleCustomizationComplete} />
          </PageTransition>
        );
      case 'home':
        return (
          <PageTransition isActive={true} transitionKey="home">
            <HomePage 
              onNavigateToExplore={handleNavigateToExplore} 
              onArtistClick={handleArtistClick}
              onNavigateToEvents={handleNavigateToEvents}
              onNavigateToUserProfile={handleNavigateToUserProfile}
            />
          </PageTransition>
        );
      case 'explore':
        return (
          <PageTransition isActive={true} transitionKey="explore">
            <ExplorePage onBack={handleBackToHome} />
          </PageTransition>
        );
      case 'categoryExplore':
        return (
          <PageTransition isActive={true} transitionKey="categoryExplore">
            <CategoryExplorePage 
              onBack={handleBackToHome}
              onArtistClick={handleArtistClick}
            />
          </PageTransition>
        );
      case 'profile':
        return (
          <PageTransition isActive={true} transitionKey="profile">
            <ProfilePage 
              kreative={selectedArtist}
              onBack={handleBackToCategoryExplore}
            />
          </PageTransition>
        );
      case 'events':
        return (
          <PageTransition isActive={true} transitionKey="events">
            <EventsPage 
              onBack={handleBackFromEvents}
            />
          </PageTransition>
        );
      case 'userProfile':
        return (
          <PageTransition isActive={true} transitionKey="userProfile">
            <UserProfilePage 
              onBack={handleBackFromUserProfile}
            />
          </PageTransition>
        );
      default:
        return (
          <PageTransition isActive={true} transitionKey="landing">
            <LandingPage onGetStarted={handleGetStarted} />
          </PageTransition>
        );
    }
  };

  return (
    <AppProvider>
      <div className="App">
        {renderCurrentPage()}
      </div>
    </AppProvider>
  );
}

export default App;
