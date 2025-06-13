import useTodoStore from "../stores/useTodoStore";

const TodoFilter = () => {
    const setFilter = useTodoStore((state) => state.setFilter);
    const filter = useTodoStore((state) => state.filter);

    return (
        <div className="todo-filter">
            <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>Todo</button>
            <button onClick={() => setFilter("completed")} className={filter === "completed" ? "active" : ""}>Completados</button>
            <button onClick={() => setFilter("active")} className={filter === "active" ? "active" : ""}>Activos</button>
        </div>
    );
};

export default TodoFilter;
