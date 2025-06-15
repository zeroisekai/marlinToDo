import React, { useState } from "react";
import useTodoStore from "../stores/useTodoStore";
import { format } from "date-fns";

// Gemini API Key
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

function SuggestButton() {
  const addAITodos = useTodoStore((state) => state.addAITodos);
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    setLoading(true);

    const currentTodos = useTodoStore.getState().todos;
    const existingTasks = currentTodos.map(todo => `- ${todo.text}`).join("\n");

    const prompt = `Actualmente tengo estas tareas:
${existingTasks}

Sugiere 5 tareas nuevas distintas a las ya existentes. 
Devuélveme solo la lista, una tarea por línea, sin numeración, sin viñetas, sin encabezados ni explicaciones.`;

    const body = {
      contents: [{ parts: [{ text: prompt }] }],
    };

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        console.error("No se recibieron sugerencias de Gemini.");
        setLoading(false);
        return;
      }

      const suggestionsText = data.candidates[0].content.parts[0].text;

      const suggestions = suggestionsText
        .split("\n")
        .map((line) => line.replace(/^\d+\.\s*/, "").replace(/^- /, "").trim())
        .filter((t) => t !== "");

      if (suggestions.length === 0) {
        console.log("Gemini no devolvió tareas válidas.");
        setLoading(false);
        return;
      }

      const taskadd = suggestions.map((task) => ({
        id: crypto.randomUUID(),
        text: task,
        completed: false,
        generatedByAI: true,
        createdAt: format(new Date(), 'yyyy-MM-dd HH:mm'),
      }));

      addAITodos(taskadd);
    } catch (error) {
      console.error("Error al obtener sugerencias:", error);
    }

    setLoading(false);
  };

  return (
    <button onClick={handleSuggest} disabled={loading}>
      {loading ? "Generando..." : "Sugerir tareas con Gemini AI en base a las tareas actuales"}
    </button>
  );
}

export default SuggestButton;
