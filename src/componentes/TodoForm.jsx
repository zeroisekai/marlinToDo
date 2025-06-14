import {useState} from "react";
import useTodoStore from "../stores/useTodoStore";

const TodoForm = () => {
    const [text, setText] = useState("");
    const addTodo = useTodoStore((state) => state.addTodo);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (text.trim()) {
            addTodo(text);
            setText("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="todo-form">
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Agregar nueva tarea"
            />
            <button type="submit">Agregar</button>
        </form>
    );
};

export default TodoForm;
