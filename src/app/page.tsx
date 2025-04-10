'use client'
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';
import { CreateMLCEngine } from "@mlc-ai/web-llm";

interface FormInputs {
  message: string;
}

function App() {
  const [engine, setEngine] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  const messageContent = watch('message');

  const onSubmit = async (data: FormInputs) => {
    console.log('Sending message:', data.message);
    const userMessage = data.message;

    // Añadir el mensaje del usuario al state
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    // Resetear el formulario tras enviar 
    reset();

    if (!engine) {
      console.log('Engine not loaded yet.');
      return;
    }

    try {
      const response = await engine.chat.completions.create({
        messages: [
          { role: 'user', content: userMessage }
        ]
      });

      // Verifica que la respuesta tiene la estructura esperada (me dio algun pete cuando no sabia que responder)
      const aiMessage = response.choices[0].message?.content || 'No response';

      console.log('Response from AI:', response);

      // Añadir la respuesta de la IA al state
      setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }]);
    } catch (error) {
      console.error('Error with AI response:', error);
    }
  };

  useEffect(() => {
    const loadEngine = async () => {
      const SELECTED_MODEL = 'Llama-3.2-1B-Instruct-q4f32_1-MLC'; //Selecciono el modelo a usar
      const e = await CreateMLCEngine(SELECTED_MODEL, {
        initProgressCallback: (info) => console.log('Init progress:', info), // Para ver el progreso de carga del modelo
      });
      await e.reload; // Muy importante para que cargue el modelo
      await e.resetChat; // Reinicia la conversación interna (No entendi muy bien para que sirve)
      setEngine(e);
    };

    loadEngine();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="h-[600px] bg-gray-50 p-6 overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === 'user' ? 'items-start' : 'items-end'} space-x-4`}>
                <div className={`flex-shrink-0 w-10 h-10 rounded-full ${message.role === 'user' ? 'bg-blue-500' : 'bg-gray-500'} flex items-center justify-center`}>
                  <span className="text-white font-semibold">{message.role === 'user' ? 'You' : 'AI'}</span>
                </div>
                <div className="flex-1">
                  <div className={`rounded-lg p-4 ${message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <p className="text-gray-800">{message.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-4 bg-white border-t">
          <div className="flex space-x-4">
            <div className="flex-1">
              <textarea
                {...register('message', { required: true })}
                className="w-full px-4 text-black py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-[100px] transition duration-200 ease-in-out"
                placeholder="Type your message here..."
              />
              {errors.message && (
                <span className="text-red-500 text-sm">This field is required</span>
              )}
            </div>
            <button
              type="submit"
              disabled={!messageContent}
              className={`flex items-center justify-center px-6 rounded-lg font-medium transition duration-200 ease-in-out ${
                messageContent
                  ? 'bg-blue-500 hover:bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
              <span className="ml-2">Send</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default App;