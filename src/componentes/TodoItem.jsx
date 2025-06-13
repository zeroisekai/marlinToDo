import useTodoStore from "../stores/useTodoStore";

const TodoItem = ({ todo }) => {
    const { toggleTodo, deleteTodo} = useTodoStore();

    return (
        <li className="todo-item">
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
            />
            <span style={{ textDecoration: todo.completed ? "line-through" : "none" }}>{todo.text} <small>{todo.createdAt}</small></span>
            <button onClick={() => deleteTodo(todo.id)}>Borrar</button>
        </li>
    );
};

export default TodoItem;