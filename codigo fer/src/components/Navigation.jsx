import React from 'react';
import { BookOpen, Brain, MessageCircle, Play, Home } from 'lucide-react';

const Navigation = ({ currentPage, onPageChange }) => {
  const navigationItems = [
    {
      id: 'home',
      name: 'Inicio',
      icon: Home,
      description: 'Página principal'
    },
    {
      id: 'assessment',
      name: 'Assessment',
      icon: Brain,
      description: 'Detección de nivel'
    },
    {
      id: 'vocabulary',
      name: 'Mi Vocabulario',
      icon: BookOpen,
      description: 'Diccionario personal'
    },
    {
      id: 'conversation',
      name: 'Conversación IA',
      icon: MessageCircle,
      description: 'Chat con OpenAI'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Play,
      description: 'Videos con subtítulos'
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">English Learning Platform</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  title={item.description}
                >
                  <IconComponent className="w-4 h-4 mr-2" />
                  {item.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
