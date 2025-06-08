import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import CicilanCalculator from './components/CicilanCalculator';
import QueryPage from './components/QueryPage';
import KontrakList from './components/KontrakList';

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-lg transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
      }`}
    >
      {children}
    </Link>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">IMS Finance</h1>
                <span className="ml-2 text-sm text-gray-500">Sistem Cicilan Kendaraan</span>
              </div>
              
              <nav className="flex space-x-1">
                <NavLink to="/">Kalkulasi Cicilan</NavLink>
                <NavLink to="/query">Query Data</NavLink>
                <NavLink to="/kontrak">Daftar Kontrak</NavLink>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<CicilanCalculator />} />
            <Route path="/query" element={<QueryPage />} />
            <Route path="/kontrak" element={<KontrakList />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t mt-12">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              © 2024 IMS Finance - Take Home Test Sistem Perhitungan Cicilan
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;