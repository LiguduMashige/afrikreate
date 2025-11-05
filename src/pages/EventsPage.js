import React, { useState } from 'react';
import { eventsData } from '../data/eventsData';
import { useAppContext } from '../context/AppContext';
import './EventsPage.css';

const EventsPage = ({ onBack }) => {
  const { actions } = useAppContext();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedEvent, setConfirmedEvent] = useState(null);

  const filteredEvents = eventsData.filter(event => {
    const matchesFilter = filter === 'all' || event.category === filter;
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const categories = ['all', ...new Set(eventsData.map(e => e.category))];

  const handleRSVP = (event) => {
    actions.addRSVP(event);
    
    const eventDate = new Date(event.date + ' ' + event.time);
    const eventDetails = {
      title: event.title,
      description: event.description,
      location: event.location + ', ' + event.city,
      startDate: eventDate,
      endDate: new Date(eventDate.getTime() + 2 * 60 * 60 * 1000)
    };
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${eventDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTEND:${eventDetails.endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:${eventDetails.title}
DESCRIPTION:${eventDetails.description}
LOCATION:${eventDetails.location}
END:VEVENT
END:VCALENDAR`;
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setConfirmedEvent(event);
    setShowConfirmation(true);
  };

  return (
    <div className="events-container">
      <button className="back-button" onClick={onBack}>← Back</button>
      
      <header className="events-header">
        <h1>Creative Events in South Africa</h1>
        <p>Discover and attend amazing artistic events near you</p>
      </header>

      <div className="events-filters">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat === 'all' ? 'All Events' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="events-grid">
        {filteredEvents.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-image">
              <img src={event.image} alt={event.title} />
              <span className="event-category">{event.category}</span>
            </div>
            
            <div className="event-content">
              <h3>{event.title}</h3>
              <p className="event-description">{event.description}</p>
              
              <div className="event-details">
                <div className="detail-item">
                  <span className="icon">📅</span>
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">🕐</span>
                  <span>{event.time}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">📍</span>
                  <span>{event.city}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">💰</span>
                  <span>{event.price}</span>
                </div>
              </div>
              
              <button 
                className="rsvp-button"
                onClick={() => handleRSVP(event)}
              >
                RSVP & Add to Calendar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showConfirmation && confirmedEvent && (
        <div className="confirmation-modal" onClick={() => setShowConfirmation(false)}>
          <div className="confirmation-content" onClick={(e) => e.stopPropagation()}>
            <div className="confirmation-header">
              <span className="confirmation-icon">✓</span>
              <h2>Booking Confirmed!</h2>
            </div>
            <div className="confirmation-body">
              <h3>{confirmedEvent.title}</h3>
              <p className="confirmation-detail">📅 {new Date(confirmedEvent.date).toLocaleDateString()}</p>
              <p className="confirmation-detail">🕐 {confirmedEvent.time}</p>
              <p className="confirmation-detail">📍 {confirmedEvent.location}, {confirmedEvent.city}</p>
              <p className="confirmation-message">
                Your event has been added to your calendar and saved to your profile!
              </p>
            </div>
            <button className="confirmation-close" onClick={() => setShowConfirmation(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
