import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('cekBiodataUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    sessionStorage.setItem('cekBiodataUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('cekBiodataUser');
    window.location.hash = ''; // Clear hash on logout
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {user ? (
        <Dashboard user={user} onLogout={handleLogout} setUser={setUser} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
