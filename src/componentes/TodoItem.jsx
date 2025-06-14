import useTodoStore from "../stores/useTodoStore";

const TodoItem = () => {
    const { 
        toggleTodo, 
        deleteTodo, 
        getFilteredTodos 
      } = useTodoStore();
    
      const todos = getFilteredTodos();
    
      return (
        <div className="space-y-3">
          {todos.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay tareas registradas</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {todos.map((todo) => (
                <li key={todo.id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center min-w-0">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo.id)}
                        className="h-5 w-5 mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="min-w-0">
                        <p className={`text-sm truncate ${todo.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                          {todo.text}
                          {todo.isTechnical && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                              Técnica
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          Creada: {new Date(todo.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="ml-2 text-red-600 hover:text-red-900 text-sm font-medium"
                    >
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    };
    

export default TodoItem;