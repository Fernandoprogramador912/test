import React from 'react';
import { BookOpen, Brain, MessageCircle, Play, Star, Trophy, Users } from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: Brain,
      title: 'Detección de Nivel Inteligente',
      description: 'Sistema automático que detecta tu nivel de inglés con precisión',
      color: 'bg-blue-500'
    },
    {
      icon: BookOpen,
      title: 'Diccionario Personal',
      description: 'Guarda y organiza las palabras que aprendes con IA',
      color: 'bg-green-500'
    },
    {
      icon: MessageCircle,
      title: 'Conversación con IA',
      description: 'Practica inglés conversando con ChatGPT personalizado',
      color: 'bg-purple-500'
    },
    {
      icon: Play,
      title: 'YouTube con Subtítulos',
      description: 'Aprende con videos reales y subtítulos interactivos',
      color: 'bg-red-500'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Estudiantes activos', icon: Users },
    { number: '50K+', label: 'Palabras aprendidas', icon: BookOpen },
    { number: '95%', label: 'Tasa de satisfacción', icon: Star },
    { number: 'A1-C2', label: 'Niveles cubiertos', icon: Trophy }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="text-center py-20 px-6">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Aprende Inglés de Forma
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            {' '}Inteligente
          </span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Plataforma personalizada para estudiantes hispanohablantes. 
          Combina IA, gamificación y contenido real para un aprendizaje efectivo.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
            Comenzar Assessment
          </button>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors">
            Ver Demo
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Características Principales
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className={`${feature.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <IconComponent className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ¿Listo para mejorar tu inglés?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Únete a miles de estudiantes que ya están aprendiendo de forma inteligente
        </p>
        <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105">
          Comenzar Ahora
        </button>
      </div>
    </div>
  );
};

export default HomePage;
