import { create } from 'zustand';
import { format } from 'date-fns';
import { createJSONStorage, persist } from 'zustand/middleware';

const useTodoStore = create(
    persist(
      (set, get) => ({
        todos: [],
        filter: 'all',
        
        // Actions
        addTodo: (text) => {
          set((state) => ({
            todos: [
              ...state.todos,
              {
                id: Date.now(),
                text,
                completed: false,
                createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
              },
            ],
          }));
        },
        
        toggleTodo: (id) => {
          set((state) => ({
            todos: state.todos.map((todo) =>
              todo.id === id ? { ...todo, completed: !todo.completed } : todo
            ),
          }));
        },
        
        deleteTodo: (id) => {
          set((state) => ({
            todos: state.todos.filter((todo) => todo.id !== id),
          }));
        },
        
        setFilter: (filter) => {
          set({ filter });
        },
        
        getFilteredTodos: () => {
          const { todos, filter } = get();
          switch (filter) {
            case 'completed':
              return todos.filter((todo) => todo.completed);
            case 'active':
              return todos.filter((todo) => !todo.completed);
            default:
              return todos;
          }
        },
      }),
      {
        name: 'todo-storage', // Almacena localmente
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ todos: state.todos }), // Solo se hace persistente los elementos ToDo
        version: 1,
        migrate: (persistedState, version) => {
          // Actualizador de versiones
          if (version === 0) {
            persistedState.todos.forEach(todo => {
              if (!todo.createdAt) {
                todo.createdAt = new Date().toISOString();
              }
            });
          }
          return persistedState;
        },
      }
    )
  );
export default useTodoStore;