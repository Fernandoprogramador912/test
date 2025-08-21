import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Check, Clock, Volume2, Calendar, Filter, Star, RotateCcw, Plus } from 'lucide-react';

const VocabularyDatabaseSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, learning, learned
  const [vocabularyList, setVocabularyList] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Base de datos simulada de palabras (en una app real vendría de API)
  const wordDatabase = {
    'hello': {
      word: 'hello',
      definition: 'Expresión usada para saludar a alguien cuando te encuentras con esa persona',
      type: 'Interjección',
      pronunciation: '/həˈloʊ/',
      examples: ['Hello, how are you?', 'She said hello to everyone.'],
      level: 'A1',
      synonyms: ['hi', 'hey']
    },
    'beautiful': {
      word: 'beautiful',
      definition: 'Que es muy agradable de ver, escuchar o experimentar; que causa admiración por su belleza',
      type: 'Adjetivo',
      pronunciation: '/ˈbjuːtɪfəl/',
      examples: ['The sunset was beautiful.', 'She has a beautiful voice.'],
      level: 'A2',
      synonyms: ['pretty', 'lovely']
    },
    'accomplish': {
      word: 'accomplish',
      definition: 'Lograr o completar algo con éxito después de un esfuerzo',
      type: 'Verbo',
      pronunciation: '/əˈkʌmplɪʃ/',
      examples: ['She accomplished her goals.', 'We need to accomplish this task.'],
      level: 'B1',
      synonyms: ['achieve', 'complete']
    },
    'sophisticated': {
      word: 'sophisticated',
      definition: 'Que es complejo, avanzado o refinado; que muestra gran conocimiento o elegancia',
      type: 'Adjetivo',
      pronunciation: '/səˈfɪstɪkeɪtɪd/',
      examples: ['A sophisticated analysis.', 'She has sophisticated taste.'],
      level: 'B2',
      synonyms: ['advanced', 'refined']
    }
  };

  // Estado inicial del vocabulario del usuario (en una app real vendría del backend)
  useEffect(() => {
    const initialVocab = [
      {
        id: 1,
        word: 'hello',
        status: 'learned',
        dateAdded: '2025-01-05',
        lastReviewed: '2025-01-06',
        source: 'assessment'
      },
      {
        id: 2,
        word: 'beautiful',
        status: 'learning',
        dateAdded: '2025-01-06',
        lastReviewed: '2025-01-07',
        source: 'reading_exercise'
      },
      {
        id: 3,
        word: 'accomplish',
        status: 'learning',
        dateAdded: '2025-01-07',
        lastReviewed: null,
        source: 'search'
      }
    ];
    setVocabularyList(initialVocab);
  }, []);

  // Función simple para estimar nivel de la palabra
  const determineLevel = (word) => {
    const basicWords = ['hello', 'house', 'eat', 'water', 'red', 'big', 'good'];
    const intermediateWords = ['although', 'relationship', 'environment', 'important'];
    const advancedWords = ['sophisticated', 'contemporary', 'phenomenon'];
    
    if (basicWords.includes(word.toLowerCase())) return 'A1';
    if (word.length <= 5) return 'A2';
    if (intermediateWords.includes(word.toLowerCase())) return 'B1';
    if (word.length <= 8) return 'B2';
    if (advancedWords.includes(word.toLowerCase())) return 'C1';
    return 'C2';
  };

  // Configuración de la API de OpenAI
  const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || 'YOUR_API_KEY_HERE';
  
  // Generar definición usando ChatGPT API (REAL)
  const generateDefinitionWithChatGPT = async (word, userLevel = 'B1') => {
    setIsSearching(true);
    try {
      console.log('Intentando conectar con OpenAI API...');
      console.log('Palabra:', word);
      
      // Llamada REAL a ChatGPT API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{
            role: "user",
            content: `Define la palabra en inglés "${word}" para un estudiante de inglés nivel ${userLevel}. 
                     Responde SOLO en formato JSON con esta estructura exacta:
                     {
                       "word": "${word}",
                       "definition": "definición clara en español",
                       "type": "tipo de palabra (sustantivo, verbo, adjetivo, etc)",
                       "pronunciation": "pronunciación fonética",
                       "examples": ["ejemplo 1 en inglés", "ejemplo 2 en inglés", "ejemplo 3 en inglés"],
                       "level": "nivel estimado (A1, A2, B1, B2, C1, C2)",
                       "synonyms": ["sinónimo1", "sinónimo2"],
                       "notes": "tip pedagógico útil para el estudiante"
                     }`
          }],
          max_tokens: 500,
          temperature: 0.7
        })
      });

      console.log('Respuesta de API:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('Datos recibidos:', data);
        const content = data.choices[0].message.content;
        
        try {
          // Parsear la respuesta JSON de ChatGPT
          const wordData = JSON.parse(content);
          
          setSearchResults([{
            ...wordData,
            source: 'ChatGPT API ✅',
            audioUrl: null
          }]);
        } catch (parseError) {
          console.error('Error parsing ChatGPT response:', parseError);
          console.log('Contenido recibido:', content);
          
          // Mostrar respuesta sin parsear para debug
          setSearchResults([{
            word: word,
            definition: content.length > 200 ? content.substring(0, 200) + '...' : content,
            type: 'Respuesta cruda',
            pronunciation: 'N/A',
            examples: [`Respuesta completa: ${content}`],
            level: userLevel,
            synonyms: [],
            notes: 'Respuesta de ChatGPT (error en formato JSON)',
            source: 'ChatGPT API (respuesta cruda)'
          }]);
        }
      } else {
        // Obtener más detalles del error
        const errorText = await response.text();
        console.error('Error details:', errorText);
        
        setSearchResults([{
          word: word,
          definition: `Error ${response.status}: ${response.statusText}`,
          type: 'Error de API',
          pronunciation: 'N/A',
          examples: [errorText.substring(0, 100)],
          level: userLevel,
          synonyms: [],
          notes: 'Verifica tu API key y conexión. Revisa la consola del navegador.',
          source: `Error ${response.status}`
        }]);
      }

    } catch (error) {
      console.error('Network error:', error);
      setSearchResults([{
        word: word,
        definition: `Error de red: ${error.message}`,
        type: 'Error de conexión',
        pronunciation: 'N/A',
        examples: [error.toString()],
        level: userLevel,
        synonyms: [],
        notes: 'Problema de conexión. Verifica internet y configuración CORS.',
        source: 'Error de red'
      }]);
    } finally {
      setIsSearching(false);
    }
  };

  // Buscar palabra con ChatGPT
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.length > 2) {
      // Primero buscar en vocabulario local
      const localResults = Object.values(wordDatabase).filter(word =>
        word.word.toLowerCase().includes(term.toLowerCase())
      );
      
      // Si no encuentra en local, usar ChatGPT para generar definición
      if (localResults.length === 0) {
        generateDefinitionWithChatGPT(term, 'B1'); // Nivel por defecto, se podría personalizar
      } else {
        setSearchResults(localResults);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Obtener información de la palabra (incluyendo datos guardados del diccionario)
  const getWordInfo = (word) => {
    // Primero buscar en el vocabulario del usuario (puede tener datos del diccionario guardados)
    const userWord = vocabularyList.find(item => item.word === word);
    if (userWord && userWord.definition) {
      return {
        word: userWord.word,
        definition: userWord.definition,
        pronunciation: userWord.pronunciation || 'N/A',
        examples: userWord.examples || [],
        level: userWord.level || 'Unknown',
        type: userWord.type || 'Unknown',
        synonyms: userWord.synonyms || [],
        audioUrl: userWord.audioUrl || null
      };
    }
    
    // Si no tiene datos guardados, usar la base local
    return wordDatabase[word] || {
      word: word,
      definition: 'Definition not available',
      pronunciation: 'N/A',
      examples: [],
      level: 'Unknown',
      type: 'Unknown',
      synonyms: [],
      notes: null
    };
  };

  // Agregar palabra al vocabulario personal con datos del diccionario
  const addWordToVocabulary = (word, wordData = null) => {
    const existingWord = vocabularyList.find(item => item.word === word);
    if (!existingWord) {
      const newWord = {
        id: vocabularyList.length + 1,
        word: word,
        status: 'learning',
        dateAdded: new Date().toISOString().split('T')[0],
        lastReviewed: null,
        source: 'search',
        // Guardar datos adicionales del diccionario si están disponibles
        ...(wordData && {
          definition: wordData.definition,
          pronunciation: wordData.pronunciation,
          examples: wordData.examples,
          type: wordData.type,
          level: wordData.level,
          synonyms: wordData.synonyms,
          audioUrl: wordData.audioUrl
        })
      };
      setVocabularyList([...vocabularyList, newWord]);
      setSearchTerm('');
      setSearchResults([]);
      // Mostrar la palabra agregada
      setSelectedWord(word);
    } else {
      // Si ya existe, solo mostrarla
      setSelectedWord(word);
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  // Cambiar estado de palabra
  const toggleWordStatus = (wordId) => {
    setVocabularyList(vocabularyList.map(item =>
      item.id === wordId
        ? {
            ...item,
            status: item.status === 'learning' ? 'learned' : 'learning',
            lastReviewed: new Date().toISOString().split('T')[0]
          }
        : item
    ));
  };

  // Función para recibir palabras de otros módulos
  const addWordFromOtherModule = (word, source = 'external') => {
    const existingWord = vocabularyList.find(item => item.word === word);
    if (!existingWord) {
      const newWord = {
        id: vocabularyList.length + 1,
        word: word,
        status: 'learning',
        dateAdded: new Date().toISOString().split('T')[0],
        lastReviewed: null,
        source: source
      };
      setVocabularyList([...vocabularyList, newWord]);
    }
    setSelectedWord(word);
  };

  // Filtrar vocabulario según estado seleccionado
  const filteredVocabulary = vocabularyList.filter(item => {
    const matchesFilter = filterStatus === 'all' || item.status === filterStatus;
    const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Estadísticas
  const stats = {
    total: vocabularyList.length,
    learned: vocabularyList.filter(item => item.status === 'learned').length,
    learning: vocabularyList.filter(item => item.status === 'learning').length
  };

  const getStatusColor = (status) => {
    return status === 'learned' ? 'text-green-600' : 'text-blue-600';
  };

  const getStatusIcon = (status) => {
    return status === 'learned' ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Vocabulario</h1>
        <p className="text-gray-600">Tu diccionario personal de palabras aprendidas</p>
      </div>

      {/* Estadísticas */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <BookOpen className="w-8 h-8 text-indigo-600 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
            </div>
            <p className="text-gray-600 font-medium">Total de palabras</p>
          </div>
          
          <div className="text-center border-l border-r border-gray-200">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-8 h-8 text-blue-600 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">{stats.learning}</h3>
            </div>
            <p className="text-gray-600 font-medium">En aprendizaje</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <Check className="w-8 h-8 text-green-600 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">{stats.learned}</h3>
            </div>
            <p className="text-gray-600 font-medium">Aprendidas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel izquierdo - Búsqueda y lista */}
        <div className="lg:col-span-2 space-y-6">
          {/* Buscador para agregar palabras */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Agregar Nueva Palabra</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Escribe una palabra para buscar y agregar..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                </div>
              )}
            </div>
            
            {/* Resultados de búsqueda de diccionario */}
            {searchResults.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  {searchResults[0].source === 'ChatGPT API ✅' ? 'Definición generada por IA:' : 'Palabras encontradas:'}
                </h4>
                {searchResults.map((result, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-3 bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-lg">{result.word}</span>
                          <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                            {result.level}
                          </span>
                          <span className="text-sm bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            {result.type}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-2">{result.definition}</p>
                        
                        {result.notes && (
                          <p className="text-blue-600 text-sm mb-2 italic bg-blue-50 p-2 rounded">
                            💡 <span className="font-medium">Tip: </span>{result.notes}
                          </p>
                        )}
                        
                        {result.pronunciation && (
                          <div className="flex items-center gap-2 mb-2">
                            <Volume2 className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{result.pronunciation}</span>
                            {result.audioUrl && (
                              <button
                                onClick={() => {
                                  const audio = new Audio(result.audioUrl);
                                  audio.play().catch(e => console.log('Audio playback failed:', e));
                                }}
                                className="ml-2 p-1 bg-indigo-100 text-indigo-600 rounded hover:bg-indigo-200 transition-colors"
                                title="Reproducir pronunciación"
                              >
                                <Volume2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        )}
                        
                        {result.examples && result.examples.length > 0 && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-600 mb-1">Ejemplos en contexto:</p>
                            {result.examples.slice(0, 2).map((example, idx) => (
                              <p key={idx} className="text-sm text-gray-600 italic">• {example}</p>
                            ))}
                          </div>
                        )}
                        
                        {result.synonyms && result.synonyms.length > 0 && (
                          <div className="mb-2">
                            <p className="text-sm font-medium text-gray-600 mb-1">Sinónimos:</p>
                            <div className="flex flex-wrap gap-1">
                              {result.synonyms.map((synonym, idx) => (
                                <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {synonym}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={() => addWordToVocabulary(result.word, result)}
                        className="ml-4 flex items-center gap-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar a mi vocabulario
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <span>🤖</span>
                  * Definiciones pedagógicas generadas por ChatGPT API
                </div>
              </div>
            )}
            
            {/* Mensaje cuando no hay resultados */}
            {searchTerm.length > 2 && !isSearching && searchResults.length === 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  No se encontró la palabra "{searchTerm}". Verifica la ortografía o intenta con otra palabra.
                </p>
              </div>
            )}
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Mis Palabras</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-3 py-1 rounded-md text-sm ${filterStatus === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilterStatus('learning')}
                  className={`px-3 py-1 rounded-md text-sm ${filterStatus === 'learning' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  En aprendizaje
                </button>
                <button
                  onClick={() => setFilterStatus('learned')}
                  className={`px-3 py-1 rounded-md text-sm ${filterStatus === 'learned' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Aprendidas
                </button>
              </div>
            </div>
          </div>

          {/* Lista de palabras */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              {filteredVocabulary.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No hay palabras que coincidan con tu búsqueda</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredVocabulary.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedWord === item.word ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedWord(item.word)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${item.status === 'learned' ? 'bg-green-100' : 'bg-blue-100'}`}>
                            <div className={getStatusColor(item.status)}>
                              {getStatusIcon(item.status)}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{item.word}</h4>
                            <p className="text-sm text-gray-600">
                              Agregada el {new Date(item.dateAdded).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWordStatus(item.id);
                          }}
                          className={`px-3 py-1 rounded-md text-sm transition-colors ${
                            item.status === 'learned'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                          }`}
                        >
                          {item.status === 'learned' ? 'Aprendida' : 'En aprendizaje'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel derecho - Detalles de palabra */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
            {selectedWord ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedWord}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700">
                      <Volume2 className="w-4 h-4" />
                      <span className="text-sm">{getWordInfo(selectedWord).pronunciation}</span>
                    </button>
                    <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                      {getWordInfo(selectedWord).level}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Definición</h4>
                    <p className="text-gray-700 mb-2">{getWordInfo(selectedWord).definition}</p>
                    {getWordInfo(selectedWord).notes && (
                      <p className="text-blue-600 text-sm italic bg-blue-50 p-2 rounded">
                        💡 <span className="font-medium">Tip: </span>{getWordInfo(selectedWord).notes}
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tipo</h4>
                    <span className="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">
                      {getWordInfo(selectedWord).type}
                    </span>
                  </div>

                  {getWordInfo(selectedWord).examples.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Ejemplos en contexto</h4>
                      <ul className="space-y-2">
                        {getWordInfo(selectedWord).examples.map((example, index) => (
                          <li key={index} className="text-gray-700 italic">
                            "{''}
                            <span className="font-medium">{example}</span>
                            {''}"
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {getWordInfo(selectedWord).synonyms && getWordInfo(selectedWord).synonyms.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Sinónimos</h4>
                      <div className="flex flex-wrap gap-2">
                        {getWordInfo(selectedWord).synonyms.map((synonym, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {synonym}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {getWordInfo(selectedWord).audioUrl && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Pronunciación</h4>
                      <button
                        onClick={() => {
                          const audio = new Audio(getWordInfo(selectedWord).audioUrl);
                          audio.play().catch(e => console.log('Audio playback failed:', e));
                        }}
                        className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-3 py-2 rounded-md hover:bg-indigo-200 transition-colors"
                      >
                        <Volume2 className="w-4 h-4" />
                        Reproducir audio
                      </button>
                    </div>
                  )}
                </div>

                {/* Simular función para otros módulos */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-2">Demo: Agregar desde otros módulos</h4>
                  <button
                    onClick={() => addWordFromOtherModule('sophisticated', 'reading_exercise')}
                    className="w-full bg-gray-100 text-gray-700 px-3 py-2 rounded-md text-sm hover:bg-gray-200"
                  >
                    Simular: Palabra desde módulo de lectura
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Selecciona una palabra</h3>
                <p className="text-gray-600">Haz clic en una palabra de tu lista para ver sus detalles</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VocabularyDatabaseSection;
