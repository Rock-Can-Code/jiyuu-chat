'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { BotMessageSquare, RotateCcw, Copy, Check, Square, Trash2 } from 'lucide-react';
import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeReact, { Components } from 'rehype-react';
import { jsx, Fragment, jsxs } from 'react/jsx-runtime';
import { gsap } from 'gsap';
import { InfoButton } from '../components/InfoButton';
import { WelcomeMessage } from '../components/WelcomeMessage';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

interface FormInputs {
  message: string;
}

const locales = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'ja', name: '日本語' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'ru', name: 'Русский' },
  { code: 'ar', name: 'العربية' },
  { code: 'cs', name: 'Čeština' },
  { code: 'zh-CN', name: '中文 (简体)' },
  { code: 'ko', name: '한국어' },
  { code: 'pt-PT', name: 'Português (Portugal)' },
];

const MarkdownComponents: Components = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <SyntaxHighlighter
        style={atomDark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, '')}
      </SyntaxHighlighter>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  p({ node, children, ...props }) {
    return <p className="mb-4" {...props}>{children}</p>;
  },
  h1({ node, children, ...props }) {
    return <h1 className="text-3xl font-bold mb-4" {...props}>{children}</h1>;
  },
  h2({ node, children, ...props }) {
    return <h2 className="text-2xl font-bold mb-3" {...props}>{children}</h2>;
  },
  h3({ node, children, ...props }) {
    return <h3 className="text-xl font-bold mb-2" {...props}>{children}</h3>;
  },
  ul({ node, children, ...props }) {
    return <ul className="list-disc pl-6 mb-4" {...props}>{children}</ul>;
  },
  ol({ node, children, ...props }) {
    return <ol className="list-decimal pl-6 mb-4" {...props}>{children}</ol>;
  },
  li({ node, children, ...props }) {
    return <li className="mb-1" {...props}>{children}</li>;
  },
  blockquote({ node, children, ...props }) {
    return (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic mb-4" {...props}>
        {children}
      </blockquote>
    );
  },
  a({ node, children, ...props }) {
    return (
      <a className="text-blue-500 hover:underline" {...props}>
        {children}
      </a>
    );
  },
  img({ node, ...props }) {
    return <img className="max-w-full h-auto my-4" {...props} />;
  },
  hr({ node, ...props }) {
    return <hr className="my-6 border-gray-300" {...props} />;
  },
  table({ node, children, ...props }) {
    return (
      <div className="overflow-x-auto my-4">
        <table className="min-w-full border-collapse" {...props}>
          {children}
        </table>
      </div>
    );
  },
  th({ node, children, ...props }) {
    return (
      <th className="border border-gray-300 px-4 py-2 bg-gray-100 text-left" {...props}>
        {children}
      </th>
    );
  },
  td({ node, children, ...props }) {
    return (
      <td className="border border-gray-300 px-4 py-2" {...props}>
        {children}
      </td>
    );
  },
  inlineCode({ node, ...props }) {
    return (
      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props} />
    );
  },
};

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeReact, {
    createElement: React.createElement,
    jsxs,
    jsx,
    Fragment,
    components: MarkdownComponents,
  });

function renderMarkdown(markdown: string): React.ReactNode {
  return processor.processSync(markdown).result;
}

function App() {
  const t = useTranslations('HomePage');
  const router = useRouter();
  const locale = useLocale();
  const [isResponding, setIsResponding] = useState(false);
  const [engine, setEngine] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingProgress, setLoadingProgress] = useState<{ progress: number; text: string; timeElapsed: number } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showReadyMessage, setShowReadyMessage] = useState(false);
  const [isInfoVisible, setIsInfoVisible] = useState(false);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);

  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const welcomeMessageRef = useRef<HTMLDivElement>(null);

  const toggleInfo = () => {
    setIsInfoVisible(!isInfoVisible);
  };

  const clearChat = () => {
    if (engine) {
      engine.interruptGenerate();
      if(isResponding){
        engine.interruptGenerate();
      }
      engine.resetChat();
    }
    messageRefs.current.forEach((messageRef, index) => {
      if (messageRef) {
        gsap.to(messageRef, {
          y: 100,
          opacity: 0,
          duration: 0.5,
          delay: index * 0.1,
          onComplete: () => {
            if (index === messageRefs.current.length - 1) {
              setMessages([]);
            }
          }
        });
      }
    });
  };

  const handleLanguageChange = (newLocale: string) => {
    router.push(`/${newLocale}`);
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
  } = useForm<FormInputs>();

  const messageContent = watch('message');

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = async (data: FormInputs) => {
    const userMessage = data.message;
    const updatedMessages = [
      ...messages,
      { role: 'user', content: userMessage }
    ];
    setMessages(updatedMessages);

    reset();

    if (!engine) {
      console.log('Engine not loaded yet.');
      return;
    }

    setIsResponding(true);

    try {
      const responseStream = await engine.chat.completions.create({
        messages: updatedMessages,
        stream: true,
      });

      let aiMessage = '';

      setMessages(prev => [...prev, { role: 'assistant', content: aiMessage }]);

      for await (const chunk of responseStream) {
        const chunkContent = chunk.choices[0]?.delta?.content || '';
        aiMessage += chunkContent;

        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'assistant', content: aiMessage };
          return newMessages;
        });
      }

    } catch (error) {
      console.error('Error with AI response:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: '⚠️ There was an error generating the response. Please try again.',
          error: true,
        },
      ]);
    } finally {
      setIsResponding(false);
    }
  };

  const handleStop = () => {
    if (engine) {
      engine.interruptGenerate();
      setIsResponding(false);
    }
  };

  useEffect(() => {
    const loadEngine = async () => {
      try {
        const SELECTED_MODEL = 'Llama-3.2-1B-Instruct-q4f32_1-MLC';
        const engine = await CreateMLCEngine(SELECTED_MODEL, {
          initProgressCallback: (info) => {
            console.log('Init progress:', info);
            setLoadingProgress(info);
          },
        });

        await engine.reload;
        await engine.resetChat;
        setEngine(engine);
        setLoadingProgress(null);
        setShowReadyMessage(true);
        setTimeout(() => {
          setShowReadyMessage(false);
        }, 1000);

      } catch (err) {
        console.error('Error loading model:', err);
        setLoadError('An error occurred while loading the model. Please reload the page.');
      }
    };

    loadEngine();
  }, []);

  const handleInputFocus = () => {
    if (welcomeMessageRef.current) {
      gsap.to(welcomeMessageRef.current, {
        y: 100,
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          setShowWelcomeMessage(false);
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="w-full max-w-4xl rounded-xl overflow-hidden">
        <InfoButton isInfoVisible={isInfoVisible} toggleInfo={toggleInfo} />
        <div className="absolute top-4 right-16 language-selector" style={{ zIndex: 1000 }}>
          <select
            value={locale}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-[var(--color-button-background-in)] text-[var(--color-text)] border-[var(--color-button-border)] rounded p-2"
          >
            {locales.map((locale) => (
              <option key={locale.code} value={locale.code}>
                {locale.name}
              </option>
            ))}
          </select>
        </div>
        <button onClick={clearChat} className="absolute top-4 right-4 bg-[var(--color-button-background-in)] text-[var(--color-text)] p-2 rounded-full shadow-lg z-50">
          <Trash2 className="w-5 h-5 cursor-pointer" />
        </button>
        <div className="p-6 h-[700px] md:h-[750px] overflow-y-auto">
          {loadError ? (
            <div className="p-3 text-center text-sm text-[var(--color-text)] border border-[var(--color-button-border-out)] bg-[var(--color-button-background-in)] rounded-md shadow-sm max-w-md mx-auto">
              <p>{loadError}</p>
              <div className="mt-4 flex flex-col items-center text-sm bg-[var(--color-button-background-in)]">
                <p>{t('reload')}</p>
                <RotateCcw onClick={() => window.location.reload()} className="cursor-pointer mt-2" />
              </div>
            </div>
          ) : loadingProgress ? (
            <div className="p-4 text-center text-sm text-[var(--color-text)]">
              <p>{t('status')}: {loadingProgress.text}</p>
            </div>
          ) : (
            showReadyMessage && (
              <div className="p-4 text-center text-lg text-[var(--color-text)] transition-opacity duration-1000 opacity-100">
                <p>{t('go')}</p>
              </div>
            )
          )}
          <WelcomeMessage
            showWelcomeMessage={showWelcomeMessage}
            welcomeMessageRef={welcomeMessageRef}
          />

          <div className='flex flex-col space-y-4'>
            {messages.map((message, index) => (
              <div
                key={index}
                ref={(el) => {
                  messageRefs.current[index] = el;
                }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`rounded-lg p-4 max-w-[80%] ${
                    message.role === 'user'
                      ? 'bg-[var(--color-user-bubble)] text-[var(--color-text)] rounded-br-none shadow-sm'
                      : 'bg-[var(--color-button-background-in)] text-[var(--color-text)] rounded-tl-none'
                  } `}
                >
                  {message.content.includes('```') ? (
                    <div className="whitespace-pre-wrap">
                      {message.content.split('```').map((part: string, i: number) => {
                        if (i % 2 === 1) {
                          const language = part.split('\n')[0] || 'javascript';
                          const code = part.split('\n').slice(1).join('\n');
                          const isCopied = copiedIndex === i;
                          return (
                            <div key={`${index}-${hashCode(part)}`} className="relative">
                              <button
                                onClick={() => handleCopy(code, i)}
                                className="absolute top-2 right-2 flex items-center gap-1 bg-gray-700 hover:bg-gray-600 rounded cursor-pointer px-2 py-1 transition-colors"
                                title={isCopied ? t('copied') : t("copy_code")}
                              >
                                {isCopied ? (
                                  <Check size={14} className="text-green-400" />
                                ) : (
                                  <Copy size={14} className="text-gray-300" />
                                )}
                                <span className="text-xs text-gray-300">
                                  {isCopied ? t('copied') : t("copy_code")}
                                </span>
                              </button>
                              <SyntaxHighlighter
                                language={language}
                                style={atomDark}
                                customStyle={{
                                  margin: '0.5rem 0',
                                  borderRadius: '0.5rem',
                                  paddingTop: '2rem',
                                }}
                              >
                                {code}
                              </SyntaxHighlighter>
                            </div>
                          );
                        }
                        return (
                          <div key={`${index}-text-${i}`}>
                            {renderMarkdown(part)}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div>{renderMarkdown(message.content)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-4 flex space-x-4">
            <div className="flex-1 relative">
              <textarea
                {...register('message', {
                  required: true,
                  validate: (value) => value.trim().length > 0
                })}
                className="w-full px-4 py-3 rounded-lg border-[var(--color-button-border-in)] text-[var(--color-text)] bg-[var(--color-button-background-in)] focus:ring-2 focus:ring-[var(--color-button-border-primary-in)] focus:border-transparent resize-none h-[100px] transition duration-200 ease-in-out"
                placeholder={t('type_your_message_here')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(onSubmit)();
                  }
                }}
                onFocus={handleInputFocus}
              />
              <button
                type="button"
                onClick={isResponding ? handleStop : handleSubmit(onSubmit)}
                disabled={!messageContent && !isResponding}
                className={`flex absolute bottom-2 right-1 items-center justify-center h-10 w-10 rounded-full font-medium transition duration-200 ease-in-out border border-gray-400 ${
                  isResponding
                    ? 'bg-red-500 text-white hover:bg-red-600 border-red-500'
                    : messageContent
                      ? 'bg-[var(--color-button-background-primary-in)] text-[var(--color-button-icon-primary-in)] hover:bg-opacity-90 border-[var(--color-button-border-primary-in)]'
                      : 'bg-[var(--color-button-background-in)] text-gray-400 cursor-not-allowed border-[var(--color-button-border-in)]'
                }`}
              >
                {isResponding ? <Square className='w-5 h-5' /> : <BotMessageSquare className='w-5 h-5 text-gray-400' />}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return hash.toString();
}

export default App;
