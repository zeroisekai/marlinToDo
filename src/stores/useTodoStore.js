import { create } from "zustand";
import { format } from "date-fns";

const useTodoStore = create((set) => ({
    todos: [],
    filter: "all",
    
    addTodo: (text) => set((state) => ({
        todos: [
            ...state.todos,
            {
                id: Date.now(),
                text,
                completed: false,
                createdAt: format(new Date(), "yyyy-MM-dd HH:mm"),
            },
        ],
    })),

    toggleTodo: (id) => set((state) => ({
        todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
    })),

    deleteTodo: (id) => set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
    })),

    setFilter: (filter) => set({ filter }),

    getFiltratedTodos: () => {
        const { todos, filter} = useTodoStore.getState();
        switch (filter) {
            case "completed":
                return todos.filter((todo) => todo.completed);
            case "active":
                return todos.filter((todo) => !todo.completed);
            default:
                return todos;
        }
    },
}));

export default useTodoStore;