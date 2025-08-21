import React, { useState } from 'react';
import { Brain, CheckCircle, Clock, Star, Trophy, ArrowRight, ArrowLeft } from 'lucide-react';

const VocabularyLevelDetector = () => {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState('');
  const [learningStyle, setLearningStyle] = useState('');

  const phases = [
    {
      id: 'basic',
      title: 'Vocabulario Básico',
      description: 'Palabras comunes del día a día',
      questions: [
        { word: 'house', options: ['casa', 'perro', 'agua', 'libro'], correct: 'casa' },
        { word: 'water', options: ['agua', 'fuego', 'tierra', 'aire'], correct: 'agua' },
        { word: 'food', options: ['comida', 'bebida', 'ropa', 'casa'], correct: 'comida' },
        { word: 'book', options: ['libro', 'papel', 'lápiz', 'mesa'], correct: 'libro' },
        { word: 'friend', options: ['amigo', 'familia', 'trabajo', 'tiempo'], correct: 'amigo' }
      ]
    },
    {
      id: 'intermediate',
      title: 'Vocabulario Intermedio',
      description: 'Palabras más complejas y abstractas',
      questions: [
        { word: 'relationship', options: ['relación', 'comunicación', 'educación', 'situación'], correct: 'relación' },
        { word: 'environment', options: ['medio ambiente', 'naturaleza', 'clima', 'paisaje'], correct: 'medio ambiente' },
        { word: 'opportunity', options: ['oportunidad', 'posibilidad', 'chance', 'momento'], correct: 'oportunidad' },
        { word: 'experience', options: ['experiencia', 'conocimiento', 'habilidad', 'trabajo'], correct: 'experiencia' },
        { word: 'development', options: ['desarrollo', 'crecimiento', 'progreso', 'evolución'], correct: 'desarrollo' }
      ]
    },
    {
      id: 'advanced',
      title: 'Vocabulario Avanzado',
      description: 'Palabras sofisticadas y técnicas',
      questions: [
        { word: 'sophisticated', options: ['sofisticado', 'complejo', 'avanzado', 'difícil'], correct: 'sofisticado' },
        { word: 'phenomenon', options: ['fenómeno', 'evento', 'suceso', 'acontecimiento'], correct: 'fenómeno' },
        { word: 'contemporary', options: ['contemporáneo', 'moderno', 'actual', 'presente'], correct: 'contemporáneo' },
        { word: 'comprehensive', options: ['completo', 'extenso', 'detallado', 'amplio'], correct: 'completo' },
        { word: 'sustainable', options: ['sostenible', 'duradero', 'permanente', 'estable'], correct: 'sostenible' }
      ]
    }
  ];

  const learningStyles = [
    {
      id: 'visual',
      name: 'Visual',
      description: 'Aprendes mejor viendo imágenes, videos y diagramas',
      icon: '👁️'
    },
    {
      id: 'auditory',
      name: 'Auditivo',
      description: 'Aprendes mejor escuchando y hablando',
      icon: '🎧'
    },
    {
      id: 'kinesthetic',
      name: 'Kinestésico',
      description: 'Aprendes mejor haciendo y moviéndote',
      icon: '🏃'
    },
    {
      id: 'reading',
      name: 'Lectura/Escritura',
      description: 'Aprendes mejor leyendo y escribiendo',
      icon: '📚'
    }
  ];

  const handleAnswer = (questionIndex, answer) => {
    const currentPhaseData = phases[currentPhase];
    const question = currentPhaseData.questions[questionIndex];
    const isCorrect = answer === question.correct;
    
    setAnswers(prev => ({
      ...prev,
      [`${currentPhase}-${questionIndex}`]: { answer, correct: isCorrect }
    }));

    if (isCorrect) {
      setScore(prev => prev + 10);
    }
  };

  const calculateLevel = () => {
    const totalQuestions = phases.reduce((acc, phase) => acc + phase.questions.length, 0);
    const correctAnswers = Object.values(answers).filter(answer => answer.correct).length;
    const percentage = (correctAnswers / totalQuestions) * 100;

    if (percentage >= 90) return 'C2';
    if (percentage >= 80) return 'C1';
    if (percentage >= 70) return 'B2';
    if (percentage >= 60) return 'B1';
    if (percentage >= 50) return 'A2';
    return 'A1';
  };

  const nextPhase = () => {
    if (currentPhase < phases.length - 1) {
      setCurrentPhase(currentPhase + 1);
    } else {
      const finalLevel = calculateLevel();
      setLevel(finalLevel);
      setCurrentPhase(4); // Results phase
    }
  };

  const prevPhase = () => {
    if (currentPhase > 0) {
      setCurrentPhase(currentPhase - 1);
    }
  };

  const selectLearningStyle = (style) => {
    setLearningStyle(style);
    setCurrentPhase(5); // Final results
  };

  const resetAssessment = () => {
    setCurrentPhase(0);
    setAnswers({});
    setScore(0);
    setLevel('');
    setLearningStyle('');
  };

  if (currentPhase === 4) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Assessment Completado!</h1>
            <p className="text-gray-600">Tu nivel de inglés es:</p>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl p-6 mb-8">
            <div className="text-center">
              <h2 className="text-4xl font-bold mb-2">{level}</h2>
              <p className="text-indigo-100">Nivel de Inglés</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Puntuación</h3>
            <div className="flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              <span className="text-2xl font-bold text-gray-900">{score} puntos</span>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">¿Cómo prefieres aprender?</h3>
            <div className="grid grid-cols-2 gap-4">
              {learningStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => selectLearningStyle(style.id)}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  <div className="text-3xl mb-2">{style.icon}</div>
                  <div className="font-medium text-gray-900">{style.name}</div>
                  <div className="text-sm text-gray-600">{style.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentPhase === 5) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Perfil Completado!</h1>
            <p className="text-gray-600">Tu perfil de aprendizaje está listo</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Nivel de Inglés</h3>
              <div className="flex items-center">
                <Brain className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-blue-900">{level}</span>
              </div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">Estilo de Aprendizaje</h3>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-purple-600 mr-2" />
                <span className="text-xl font-bold text-purple-900 capitalize">{learningStyle}</span>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">Puntuación Total</h3>
              <div className="flex items-center">
                <Trophy className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-xl font-bold text-green-900">{score} puntos</span>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <button
              onClick={resetAssessment}
              className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              Hacer Assessment Nuevamente
            </button>
            <p className="text-sm text-gray-600">
              Tu perfil ha sido guardado y se usará para personalizar tu experiencia de aprendizaje
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentPhaseData = phases[currentPhase];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Brain className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment de Nivel</h1>
          <p className="text-gray-600">Fase {currentPhase + 1} de {phases.length}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progreso</span>
            <span>{Math.round(((currentPhase + 1) / phases.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentPhase + 1) / phases.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Phase Info */}
        <div className="bg-indigo-50 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-indigo-900 mb-2">{currentPhaseData.title}</h2>
          <p className="text-indigo-700">{currentPhaseData.description}</p>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {currentPhaseData.questions.map((question, questionIndex) => {
            const answerKey = `${currentPhase}-${questionIndex}`;
            const userAnswer = answers[answerKey];
            
            return (
              <div key={questionIndex} className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  ¿Qué significa "{question.word}"?
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = userAnswer?.answer === option;
                    const isCorrect = userAnswer?.answer === question.correct;
                    const showCorrect = userAnswer && isCorrect;
                    
                    let buttonClass = "p-4 border-2 border-gray-200 rounded-lg text-left hover:border-gray-300 transition-colors";
                    
                    if (userAnswer) {
                      if (option === question.correct) {
                        buttonClass += " border-green-500 bg-green-50";
                      } else if (isSelected && !isCorrect) {
                        buttonClass += " border-red-500 bg-red-50";
                      }
                    } else {
                      buttonClass += " hover:border-indigo-300 hover:bg-indigo-50";
                    }

                    return (
                      <button
                        key={optionIndex}
                        onClick={() => !userAnswer && handleAnswer(questionIndex, option)}
                        disabled={userAnswer}
                        className={buttonClass}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{option}</span>
                          {userAnswer && option === question.correct && (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          )}
                          {userAnswer && isSelected && !isCorrect && (
                            <Clock className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {userAnswer && (
                  <div className={`mt-4 p-3 rounded-lg ${
                    userAnswer.correct ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                  }`}>
                    {userAnswer.correct ? (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span>¡Correcto! +10 puntos</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 mr-2" />
                        <span>Incorrecto. La respuesta correcta es: <strong>{question.correct}</strong></span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevPhase}
            disabled={currentPhase === 0}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentPhase === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-600 mb-1">Puntuación Actual</div>
            <div className="text-2xl font-bold text-indigo-600">{score} puntos</div>
          </div>

          <button
            onClick={nextPhase}
            disabled={Object.keys(answers).filter(key => key.startsWith(currentPhase.toString())).length < currentPhaseData.questions.length}
            className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-colors ${
              Object.keys(answers).filter(key => key.startsWith(currentPhase.toString())).length < currentPhaseData.questions.length
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {currentPhase === phases.length - 1 ? 'Finalizar' : 'Siguiente'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VocabularyLevelDetector;
