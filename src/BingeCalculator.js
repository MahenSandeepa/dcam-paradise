import React, { useState, useEffect } from 'react';
import movieData from './dcam_data.json';
// 1. DATA VIZ: Import the charting tools
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BingeCalculator = () => {
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("release");
  const [hoveredInfo, setHoveredInfo] = useState(null);
  
  // === NEW STATES ===
  const [activeFilter, setActiveFilter] = useState("All"); // 3. UI/UX: Hero Filter
  const [targetTime, setTargetTime] = useState("");        // 2. ALGO: Input time
  const [recommendation, setRecommendation] = useState(null); // 2. ALGO: Result

  useEffect(() => {
    const savedData = localStorage.getItem('dcamu-saves');
    if (savedData) {
      const parsedIds = JSON.parse(savedData).map(m => m.id);
      const restoredMovies = movieData.filter(m => parsedIds.includes(m.id));
      setSelectedMovies(restoredMovies);
    }
  }, []);

  const toggleMovie = (movie) => {
    if (selectedMovies.includes(movie)) {
      setSelectedMovies(selectedMovies.filter((m) => m !== movie));
    } else {
      setSelectedMovies([...selectedMovies, movie]);
    }
  };

  const handleSave = () => {
    localStorage.setItem('dcamu-saves', JSON.stringify(selectedMovies));
    alert('Progress Saved! 💾');
  };

  const handleClear = () => {
    setSelectedMovies([]);
    localStorage.removeItem('dcamu-saves');
  };

  // === 2. ALGORITHM: "Smart Recommender" Logic ===
  // This tries to find movies that sum up close to the target time
  const generateRecommendation = () => {
    const timeLimit = parseInt(targetTime);
    if (!timeLimit) return;
    
    let currentSum = 0;
    let recList = [];
    
    // Simple Greedy Algorithm: Add movies until we hit the limit
    // (A real Data Science project might use the "Knapsack" algorithm here!)
    for (let movie of movieData) {
      if (currentSum + movie.runtime <= timeLimit) {
        recList.push(movie);
        currentSum += movie.runtime;
      }
    }
    setRecommendation(recList);
    setSelectedMovies(recList); // Auto-select them for the user
  };

  // Calculations
  const totalMinutes = selectedMovies.reduce((total, movie) => total + movie.runtime, 0);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const progressPercentage = (selectedMovies.length / movieData.length) * 100;

  // === 3. UI/UX: FILTER LOGIC ===
  const filteredMovies = movieData
    .filter(movie => {
      // Search Box Filter
      const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
      // Hero Button Filter
      const matchesTag = activeFilter === "All" || movie.tags.includes(activeFilter);
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => {
      if (sortType === 'alpha') return a.title.localeCompare(b.title);
      return a.id - b.id;
    });

  // Unique tags for buttons (e.g., ["All", "Batman", "Justice League"...])
  const heroFilters = ["All", "Batman", "Justice League", "Teen Titans", "Superman"];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#0a192f', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ textAlign: 'center' }}>🦇 DCAM Paradise Data Hub</h1>
      
      {/* === TOP SECTION: DATA VIZ & ALGORITHM === */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '30px', justifyContent: 'center' }}>
        
        {/* 1. DATA VIZ: The Chart */}
        <div style={{ background: '#112240', padding: '20px', borderRadius: '15px', flex: '1 1 400px', border: '1px solid #233554' }}>
          <h3 style={{ textAlign: 'center', color: '#64ffda' }}>📊 Runtime Analytics</h3>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <BarChart data={movieData}>
                <XAxis dataKey="id" hide /> 
                <YAxis stroke="#8892b0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#112240', border: '1px solid #64ffda' }}
                  labelStyle={{ color: '#64ffda' }}
                />
                <Bar dataKey="runtime" fill="#64ffda" radius={[4, 4, 0, 0]}>
                   {movieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={selectedMovies.includes(entry) ? '#64ffda' : '#233554'} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#8892b0' }}>Comparing movie lengths (Highlighted = Selected)</p>
        </div>

        {/* 2. ALGORITHM: Smart Recommender */}
        <div style={{ background: '#112240', padding: '20px', borderRadius: '15px', flex: '1 1 300px', border: '1px solid #233554' }}>
          <h3 style={{ textAlign: 'center', color: '#64ffda' }}>🧠 Smart Recommender</h3>
          <p style={{ fontSize: '14px', color: '#8892b0', textAlign: 'center' }}>
            Enter your available time, and our algorithm will build a playlist for you.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '15px' }}>
            <input 
              type="number" 
              placeholder="Minutes (e.g. 120)" 
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              style={{ padding: '10px', borderRadius: '5px', border: 'none', width: '120px' }}
            />
            <button 
              onClick={generateRecommendation}
              style={{ padding: '10px 15px', backgroundColor: '#64ffda', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', color: '#0a192f' }}
            >
              Generate
            </button>
          </div>
          {recommendation && (
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: 'rgba(100, 255, 218, 0.1)', borderRadius: '5px' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>✅ Found {recommendation.length} movies!</p>
            </div>
          )}
        </div>
      </div>

      {/* Scoreboard */}
      <div style={{ background: '#112240', color: '#64ffda', padding: '20px', borderRadius: '15px', marginBottom: '30px', border: '1px solid #233554', textAlign: 'center' }}>
          <h2>Total Watch Time: {hours}h {minutes}m</h2>
          <div style={{ width: '100%', height: '10px', backgroundColor: '#233554', borderRadius: '5px', marginTop: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${progressPercentage}%`, height: '100%', backgroundColor: '#64ffda', transition: 'width 0.3s ease' }}></div>
          </div>
          <div style={{ marginTop: '15px' }}>
            <button onClick={handleSave} style={{ marginRight: '10px', padding: '8px 16px', backgroundColor: '#64ffda', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', color: '#0a192f' }}>💾 Save</button>
            <button onClick={handleClear} style={{ padding: '8px 16px', backgroundColor: '#ef4444', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', color: 'white' }}>❌ Clear</button>
          </div>
      </div>

      {/* 3. UI/UX: HERO FILTER BUTTONS */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
        {heroFilters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: '1px solid #64ffda',
              backgroundColor: activeFilter === filter ? '#64ffda' : 'transparent',
              color: activeFilter === filter ? '#0a192f' : '#64ffda',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* SEARCH & SORT */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <input type="text" placeholder="🔍 Search movies..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: 'none', width: '250px' }} />
        <select onChange={(e) => setSortType(e.target.value)} style={{ padding: '10px', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
          <option value="release">📅 Release Order</option>
          <option value="alpha">🔤 Alphabetical</option>
        </select>
      </div>

      {/* MOVIE GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '20px' }}>
        {filteredMovies.map((movie) => (
          <div 
            key={movie.id} 
            onClick={() => toggleMovie(movie)}
            style={{
              border: selectedMovies.includes(movie) ? '4px solid #64ffda' : '2px solid transparent',
              borderRadius: '10px',
              cursor: 'pointer',
              backgroundColor: '#112240',
              color: 'white',
              overflow: 'hidden',
              position: 'relative',
              transform: selectedMovies.includes(movie) ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 0.2s'
            }}
          >
            <div 
              onMouseEnter={() => setHoveredInfo(movie.id)} 
              onMouseLeave={() => setHoveredInfo(null)}     
              onClick={(e) => e.stopPropagation()}          
              style={{
                position: 'absolute', top: '5px', right: '10px', zIndex: 10, cursor: 'help', fontSize: '24px', textShadow: '0 2px 5px rgba(0,0,0,0.9)'
              }}
            >
              <span>ℹ️</span>
              {hoveredInfo === movie.id && (
                <div style={{ position: 'absolute', top: '25px', right: '0px', width: '160px', backgroundColor: 'rgba(10, 25, 47, 0.95)', color: 'white', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.5)', border: '1px solid #64ffda', fontSize: '12px', textAlign: 'left', zIndex: 20 }}>
                  <strong style={{ color: '#64ffda', display: 'block', marginBottom: '5px' }}>{movie.title}</strong>
                  <div>📅 Year: {movie.year}</div>
                  <div>⏱️ Runtime: {movie.runtime}m</div>
                  <div style={{marginTop: '5px', fontStyle: 'italic', color: '#8892b0'}}>{movie.tags.join(", ")}</div>
                </div>
              )}
            </div>
            <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '270px', objectFit: 'cover' }} />
            <div style={{ padding: '10px', textAlign: 'center' }}>
              <b style={{ fontSize: '14px' }}>{movie.title}</b>
              <br/>
              <small style={{ color: '#8892b0' }}>{movie.year}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BingeCalculator;