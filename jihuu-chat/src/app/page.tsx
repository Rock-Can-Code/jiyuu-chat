'use client'
import React from 'react';
import { useForm } from 'react-hook-form';
import { Send } from 'lucide-react';

interface FormInputs {
  message: string;
}

function App() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputs>();

  const messageContent = watch('message');

  const onSubmit = (data: FormInputs) => {
    console.log(data);
    
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        
        <div className="h-[600px] bg-gray-50 p-6 overflow-y-auto">
          <div className="flex flex-col space-y-4">
           
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-white font-semibold">AI</span>
              </div>
              <div className="flex-1">
                <div className="bg-blue-100 rounded-lg p-4">
                  <p className="text-gray-800">
                    Hello! I'm your AI assistant. How can I help you today?
                  </p>
                </div>
              </div>
            </div>
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