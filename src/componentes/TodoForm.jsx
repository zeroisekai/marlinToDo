import {useState} from "react";
import useTodoStore from "../stores/useTodoStore";

const TodoForm = () => {
    const [input, setInput] = useState('');
  const { 
    generateTechTasks, 
    addAITask, 
    generatedTasks, 
    isLoading, 
    error 
  } = useTodoStore();

  const handleGenerate = async () => {
    if (input.trim().length < 5) return;
    await generateTechTasks(input);
  };

  return (
    <div className="tech-todo-form">
      <div className="input-group">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Describe un proyecto técnico..."
          disabled={isLoading}
        />
        <button 
          onClick={handleGenerate}
          disabled={isLoading}
          className="generate-btn"
        >
          {isLoading ? 'Generando...' : 'Generar Tareas Técnicas'}
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="ai-tasks-grid">
        {generatedTasks.map((task) => (
          <div key={task.id} className="ai-task-card">
            <div className="ai-task-header">
              <span className="ai-icon">⚙️</span>
              <h4>Tarea Generada</h4>
            </div>
            <p className="ai-task-text">{task.text}</p>
            <button
              onClick={() => {
                addAITask(task.text);
                setInput('');
              }}
              className="add-task-btn"
            >
              Añadir a Mi Lista
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default TodoForm;
