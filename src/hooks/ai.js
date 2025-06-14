import { useState, useEffect } from 'react';
import { pipeline } from '@xenova/transformers';

export const useAISuggestions = () => {
  const [model, setModel] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadModel = async () => {
      const classifier = await pipeline(
        'text2text-generation', 
        'Xenova/LaMini-Flan-T5-248M',
        { quantized: true }
      );
      if (isMounted) setModel(classifier);
    };
    
    loadModel();
    return () => { isMounted = false };
  }, []);

  const getSuggestions = async (input) => {
    if (!model || input.length < 3) return [];
    
    try {
      const output = await model(input, {
        max_new_tokens: 30,
        temperature: 0.7
      });
      
      return output.map(text => 
        text.generated_text
          .replace('Task:', '')
          .trim()
      );
    } catch (error) {
      console.error("Error al generar sugerencias:", error);
      return [];
    }
  };

  return { getSuggestions };
};