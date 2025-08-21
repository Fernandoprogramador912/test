import React, { useState } from 'react';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import AssessmentPage from './pages/AssessmentPage';
import VocabularyPage from './pages/VocabularyPage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'assessment':
        return <AssessmentPage />;
      case 'vocabulary':
        return <VocabularyPage />;
      case 'conversation':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Conversación con IA</h2>
              <p className="text-gray-600">Funcionalidad en desarrollo...</p>
            </div>
          </div>
        );
      case 'youtube':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">YouTube con Subtítulos</h2>
              <p className="text-gray-600">Funcionalidad en desarrollo...</p>
            </div>
          </div>
        );
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="App">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  );
}

export default App;
