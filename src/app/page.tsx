'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BotMessageSquare } from 'lucide-react';
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Copy } from 'lucide-react';

interface FormInputs {
  message: string;
}

function App() {
  const [engine, setEngine] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingProgress, setLoadingProgress] = useState<{ progress: number; text: string; timeElapsed: number } | null>(null); // Estado para el progreso de carga
  const [showReadyMessage, setShowReadyMessage] = useState(false); // Estado para controlar la visibilidad del mensaje
  const {
    register,
    handleSubmit,
    reset,
    watch,
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
      const aiMessage = response.choices[0].message?.content.trim() || 'No response';

      if(aiMessage){
        console.log('Response from AI:', aiMessage);
        console.log('Response from AI:', aiMessage);

        // Añadir la respuesta de la IA al state
        setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }]);
      } else {
        console.warn('AI returned an empty message.');
        throw new Error('Empty response from AI');
      }
    } catch (error) {
      console.error('Error with AI response:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ Hubo un error al generar la respuesta. Inténtelo de nuevo.',
          error: true,
        },
      ]);
    }
  };
  useEffect(() => {
    const loadEngine = async () => {
      const SELECTED_MODEL = 'Llama-3.2-1B-Instruct-q4f32_1-MLC';
      const engine = await CreateMLCEngine(SELECTED_MODEL, {
        initProgressCallback: (info) => {
          console.log('Init progress:', info);
          setLoadingProgress(info); // Actualizar el progreso de carga
        },
      });

      await engine.reload; // Muy importante para que cargue el modelo
      await engine.resetChat; // Reinicia la conversación interna (No entendi muy bien para que sirve)
      setEngine(engine);
      setLoadingProgress(null); // Limpiar el progreso una vez cargado
      setShowReadyMessage(true);
      setTimeout(() => {
        setShowReadyMessage(false);
      }, 1000);
    };

    loadEngine();
  }, []);


return (
  <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background)] text-[var(--color-text)]">
    <div className="w-full max-w-4xl rounded-xl overflow-hidden ">

      {/* Mensajes */}
      <div className="p-6 h-[700px] md:h-[750px] overflow-y-auto ">

        {/* Mostrar progreso de carga */}
        {loadingProgress ? (
          <div className="p-4 text-center text-sm text-[var(--color-text)]">
            <p>Progress: {loadingProgress.progress * 100}%</p>
            <p>Status: {loadingProgress.text}</p>
            <p>Time Elapsed: {loadingProgress.timeElapsed.toFixed(2)} seconds</p>
          </div>
        ) : (
          showReadyMessage && (
            <div className="p-4 text-center text-lg text-[var(--color-text)] transition-opacity duration-1000 opacity-100">
              <p>Go!</p>
            </div>
          )
        )}
        <div className='flex flex-col space-y-4'>
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg p-4 ${
              message.role === 'user'
                ? 'bg-[var(--color-button-background-out)]' // Aplicar estilo del usuario
                : 'bg-[var(--color-button-background-in)]' // Aplicar estilo de la IA
            }`}>
              {message.content.includes('```') ? (
                <div className="whitespace-pre-wrap">
                  {message.content.split('```').map((part: string, i: number) => {
                    if (i % 2 === 1) {
                      const language = part.split('\n')[0] || 'javascript';
                      const code = part.split('\n').slice(1).join('\n');
                      return (
                        <div key={i} className="relative group">
                          <button
                            onClick={() => navigator.clipboard.writeText(code)}
                            className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 rounded"
                            title="Copy code"
                          >
                            <Copy size={14} className="text-gray-300" />
                          </button>
                          <SyntaxHighlighter
                            language={language}
                            style={atomDark}
                            customStyle={{ margin: '0.5rem 0', borderRadius: '0.5rem' }}
                          >
                            {code}
                          </SyntaxHighlighter>
                          </div>
                      );
                    }
                    return <p key={i}>{part}</p>;
                  })}
                </div>
              ) : (
                <p className="text-[var(--color-text)]">{message.content}</p>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="p-4 flex space-x-4">
          <div className="flex-1 relative">
            <textarea
              {...register('message', {
                 required: true, 
                 validate: (value) => value.trim().length > 0
                })}
              className="w-full px-4 py-3 rounded-lg  border-[var(--color-button-border-in)] text-[var(--color-text)] bg-[var(--color-button-background-in)] focus:ring-2 focus:ring-[var(--color-button-border-primary-in)] focus:border-transparent resize-none h-[100px] transition duration-200 ease-in-out"
              placeholder="Type your message here..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault(); // Evitar el salto de línea
                  handleSubmit(onSubmit)(); // Enviar el formulario
                }
              }}
            />
            <button
              type="submit"
              disabled={!messageContent}
              className={`flex absolute bottom-2 right-1 items-center justify-center h-10 w-10 rounded-full font-medium transition duration-200 ease-in-out border border-gray-400 ${
                messageContent
                  ? 'bg-[var(--color-button-background-primary-in)] text-[var(--color-button-icon-primary-in)] hover:bg-opacity-90 border-[var(--color-button-border-primary-in)]'
                  : 'bg-[var(--color-button-background-in)] text-gray-400 cursor-not-allowed border-[var(--color-button-border-in)]'
              }`}
            >
              <BotMessageSquare className='w-5 h-5 text-gray-400'/>
            </button>
          </div>
        </div>
      </form>
      
    </div>
  </div>
);

}

export default App;