import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import './UserProfilePage.css';

const UserProfilePage = ({ onBack }) => {
  const { state } = useAppContext();
  const [activeTab, setActiveTab] = useState('calendar');

  const upcomingEvents = state.rsvpEvents.filter(event => new Date(event.date) >= new Date());
  const pastEvents = state.rsvpEvents.filter(event => new Date(event.date) < new Date());

  const getEventsForMonth = () => {
    const eventsByDate = {};
    state.rsvpEvents.forEach(event => {
      const date = new Date(event.date).toDateString();
      if (!eventsByDate[date]) {
        eventsByDate[date] = [];
      }
      eventsByDate[date].push(event);
    });
    return eventsByDate;
  };

  const eventsByDate = getEventsForMonth();

  const renderCalendar = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateString = date.toDateString();
      const hasEvents = eventsByDate[dateString];
      const isToday = date.toDateString() === today.toDateString();

      days.push(
        <div 
          key={day} 
          className={`calendar-day ${isToday ? 'today' : ''} ${hasEvents ? 'has-event' : ''}`}
        >
          <span className="day-number">{day}</span>
          {hasEvents && (
            <div className="event-indicators">
              {hasEvents.map((event, idx) => (
                <div key={idx} className="event-dot" title={event.title}></div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="user-profile-container">
      <button className="profile-back-btn" onClick={onBack}>← Back</button>

      <div className="profile-hero">
        <div className="profile-avatar">
          <div className="avatar-circle">
            <span className="avatar-initial">U</span>
          </div>
        </div>
        <h1 className="profile-username">My Profile</h1>
        <p className="profile-bio">Art enthusiast and creative supporter</p>
      </div>

      <div className="profile-stats-bar">
        <div className="stat-box">
          <span className="stat-number">{state.favorites.length}</span>
          <span className="stat-label">Favorites</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{state.rsvpEvents.length}</span>
          <span className="stat-label">Events</span>
        </div>
        <div className="stat-box">
          <span className="stat-number">{state.userPreferences.length}</span>
          <span className="stat-label">Interests</span>
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`profile-tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          📅 Calendar
        </button>
        <button 
          className={`profile-tab ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming ({upcomingEvents.length})
        </button>
        <button 
          className={`profile-tab ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past ({pastEvents.length})
        </button>
        <button 
          className={`profile-tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Favorites ({state.favorites.length})
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'calendar' && (
          <div className="calendar-view">
            <h2 className="calendar-title">
              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="calendar-grid">
              <div className="calendar-header">Sun</div>
              <div className="calendar-header">Mon</div>
              <div className="calendar-header">Tue</div>
              <div className="calendar-header">Wed</div>
              <div className="calendar-header">Thu</div>
              <div className="calendar-header">Fri</div>
              <div className="calendar-header">Sat</div>
              {renderCalendar()}
            </div>
            <div className="calendar-legend">
              <div className="legend-item">
                <div className="legend-dot has-event"></div>
                <span>Event Day</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot today"></div>
                <span>Today</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'upcoming' && (
          <div className="events-list">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <div key={event.id} className="event-item">
                  <div className="event-item-image">
                    <img src={event.image} alt={event.title} />
                    <span className="event-badge">Upcoming</span>
                  </div>
                  <div className="event-item-content">
                    <h3>{event.title}</h3>
                    <p className="event-date">📅 {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                    <p className="event-location">📍 {event.city}</p>
                    <p className="event-desc">{event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No upcoming events. Browse events to RSVP!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'past' && (
          <div className="events-list">
            {pastEvents.length > 0 ? (
              pastEvents.map(event => (
                <div key={event.id} className="event-item past">
                  <div className="event-item-image">
                    <img src={event.image} alt={event.title} />
                    <span className="event-badge past">Past</span>
                  </div>
                  <div className="event-item-content">
                    <h3>{event.title}</h3>
                    <p className="event-date">📅 {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                    <p className="event-location">📍 {event.city}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No past events yet.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="favorites-grid">
            {state.favorites.length > 0 ? (
              state.favorites.map(kreative => (
                <div key={kreative.id} className="favorite-card">
                  <img src={kreative.image} alt={kreative.name} />
                  <div className="favorite-info">
                    <h4>{kreative.name}</h4>
                    <p>{kreative.category}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p>No favorite artists yet. Start exploring!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
