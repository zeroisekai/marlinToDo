import TodoForm from "./componentes/TodoForm";
import TodoItem from "./componentes/TodoItem";
import TodoFilter from "./componentes/TodoFilter";
import useTodoStore from "./stores/useTodoStore";
import React from "react";

function App() {
    const todos = useTodoStore(state => state.todos);
  const filter = useTodoStore(state => state.filter);

    const filteredTodos = React.useMemo(() => {
        switch (filter) {
          case 'completed':
            return todos.filter(todo => todo.completed);
          case 'active':
            return todos.filter(todo => !todo.completed);
          default:
            return todos;
        }
      }, [todos, filter]);

    return (
        <div className="app">
            <h1>Marlin ToDo App</h1>
            <TodoForm />
            <TodoFilter />
            <ul className="todo-list">
                {filteredTodos.map((todo) => (
                    <TodoItem Key={todo.id} todo={todo} />
                ))}
            </ul>
        </div>
    );
}
//Developer: Hsec
//Date: 2025-06-14
export default App;