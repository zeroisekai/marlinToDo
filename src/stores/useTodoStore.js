import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format } from 'date-fns';

const useTodoStore = create(
  persist(
    (set, get) => ({
      todos: [],
      filter: 'all',
      isLoading: false,
      error: null,
      generatedTasks: [],

      // Añadir tarea manual
      addTodo: (text) => set((state) => ({
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text,
            completed: false,
            createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
            isTechnical: false,
          },
        ],
      })),

      // Generar tareas con Gemini
      generateTechTasks: async (prompt) => {
        set({ isLoading: true, error: null, generatedTasks: [] });
        
        try {
          const response = await fetchGeminiAPI(prompt);
          const tasks = parseGeminiResponse(response);
          
          set({ 
            generatedTasks: tasks.slice(0, 3).map(task => ({
              text: task,
              id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            })),
            isLoading: false
          });
        } catch (error) {
          set({ 
            error: 'Error al generar tareas técnicas',
            isLoading: false,
            generatedTasks: [{
              text: 'Error al conectar con Gemini',
              id: 'error-ai'
            }]
          });
        }
      },

      // Añadir tarea generada por AI
      addAITask: (taskText) => set((state) => ({
        todos: [
          ...state.todos,
          {
            id: Date.now(),
            text: taskText,
            completed: false,
            createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
            isTechnical: true,
          }
        ],
        generatedTasks: state.generatedTasks.filter(t => t.text !== taskText)
      })),

      // Resto de acciones
      toggleTodo: (id) => set((state) => ({
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
      })),

      deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      })),

      setFilter: (filter) => set({ filter }),

      getFilteredTodos: () => {
        const { todos, filter } = get();
        switch (filter) {
          case 'completed': return todos.filter((todo) => todo.completed);
          case 'active': return todos.filter((todo) => !todo.completed);
          default: return todos;
        }
      }
    }),
    {
      name: 'tech-todo-storage',
      partialize: (state) => ({ todos: state.todos }),
    }
  )
);

// Conexión con Gemini API
const fetchGeminiAPI = async (prompt) => {
  const API_KEY = import.meta.env.VITE_GEMINI_KEY;
  if (!API_KEY) throw new Error('API Key no configurada');

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: `Como arquitecto de software, genera exactamente 3 tareas técnicas específicas para: "${prompt}".
          Requisitos:
          1. Formato JSON array estricto: ["tarea1", "tarea2", "tarea3"]
          2. Máximo 15 palabras por tarea
          3. Lenguaje técnico preciso`
        }]
      }]
    })
  });

  if (!response.ok) throw new Error('Error en la API');
  return await response.json();
};

// Procesamiento de respuesta
const parseGeminiResponse = (response) => {
  try {
    const text = response.candidates[0].content.parts[0].text;
    const jsonMatch = text.match(/\[.*\]/s);
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed)) return parsed;
    }
    
    throw new Error('Formato de respuesta inválido');
  } catch (error) {
    console.error('Error parsing:', error);
    return ['Error procesando respuesta IA'];
  }
};

export default useTodoStore;