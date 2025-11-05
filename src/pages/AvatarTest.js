import React, { useState, useEffect } from 'react';
import kreatives from '../data/kreatives';

const AvatarTest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredKreatives, setFilteredKreatives] = useState([]);

  useEffect(() => {
    setFilteredKreatives(kreatives);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = kreatives.filter(kreative => 
      kreative.name.toLowerCase().includes(term) ||
      kreative.category.toLowerCase().includes(term) ||
      kreative.ethnicity.toLowerCase().includes(term)
    );
    
    setFilteredKreatives(filtered);
  };

  return (
    <div style={styles.container}>
      <h1>AfriKreate Avatars</h1>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search by name, category, or ethnicity..."
          value={searchTerm}
          onChange={handleSearch}
          style={styles.searchInput}
        />
      </div>
      
      <div style={styles.grid}>
        {filteredKreatives.map(kreative => (
          <div key={kreative.id} style={styles.card}>
            <div style={styles.avatarContainer}>
              <img 
                src={kreative.image} 
                alt={kreative.name}
                style={styles.avatar}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(kreative.name)}`;
                }}
              />
            </div>
            <div style={styles.info}>
              <h3>{kreative.name}</h3>
              <p><strong>Category:</strong> {kreative.category}</p>
              <p><strong>Ethnicity:</strong> {kreative.ethnicity || 'Not specified'}</p>
              <p><strong>Followers:</strong> {kreative.followers}</p>
              <p><em>{kreative.description.substring(0, 100)}...</em></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  },
  searchContainer: {
    margin: '20px 0',
    textAlign: 'center'
  },
  searchInput: {
    width: '80%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    maxWidth: '500px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '20px'
  },
  card: {
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  avatarContainer: {
    height: '200px',
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    borderBottom: '1px solid #eee'
  },
  avatar: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover'
  },
  info: {
    padding: '15px'
  }
};

export default AvatarTest;
