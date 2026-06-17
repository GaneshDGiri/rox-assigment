import React from 'react';
import AppRoutes from './routes/APP/AppRoute';
import './App.css';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-sky-50 text-slate-900">
      <AppRoutes />
    </div>
  );
};

export default App;