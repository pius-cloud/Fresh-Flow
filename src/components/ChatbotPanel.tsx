import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Sparkles, Loader2, Lightbulb } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface ChatbotPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStoreId: string;
  selectedSkuId?: string;
  initialQuestion?: string;
}

const SUGGESTED_QUESTIONS = [
  'Why did Slough Bath Road waste so much fresh food?',
  'Which stores may run out of milk this weekend?',
  'What should we move from Slough Bath Road to London Clapham Junction?',
  'Which supplier caused the most stockouts and when?',
];

export const ChatbotPanel: React.FC<ChatbotPanelProps> = ({
  isOpen,
  onClose,
  selectedStoreId,
  selectedSkuId,
  initialQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Hello. I am FreshFlow AI, your grocery risk and transfer analyst for FreshBasket UK. Ask me about stockout causes, expiry surplus, supplier reliability, or transfer recommendations.',
      timestamp: '08:30',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle auto-sent initial question (e.g. from Live Demo button)
  useEffect(() => {
    if (initialQuestion && isOpen) {
      handleSend(initialQuestion);
    }
  }, [initialQuestion, isOpen]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!questionText) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          selectedStore: selectedStoreId !== 'ALL' ? selectedStoreId : undefined,
          selectedSku: selectedSkuId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get answer from server');
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || 'No response returned from the model.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Error: Unable to connect to FreshFlow AI server (${err.message || 'Unknown issue'}). Please check the server logs.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] bg-white border-l border-[#FED7AA] shadow-2xl flex flex-col">
      {/* Panel Header */}
      <div className="p-4 border-b border-[#FED7AA] bg-[#FFF7ED] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#EA580C] text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#9A3412] font-heading">
              Ask FreshFlow
            </h2>
            <p className="text-[11px] text-[#111111]/70">
              Gemini AI Grocery Risk Intelligence (Server-Side)
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg border border-[#111111]/20 hover:bg-white text-[#111111] transition-colors cursor-pointer"
          title="Close chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Questions */}
      <div className="px-4 py-2.5 bg-white border-b border-[#FFF7ED]">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#9A3412] mb-2">
          <Lightbulb className="w-3.5 h-3.5 text-[#EA580C]" />
          <span>Suggested Questions</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-left text-[11px] px-2.5 py-1 rounded-md bg-[#FFF7ED] hover:bg-[#FED7AA] text-[#111111] border border-[#FED7AA] transition-colors line-clamp-1 cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-white">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] p-3 rounded-xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-[#EA580C] text-white rounded-br-xs'
                    : 'bg-[#FFF7ED] text-[#111111] border border-[#FED7AA] rounded-bl-xs'
                }`}
              >
                {/* Parse bold and line breaks cleanly */}
                <div className="whitespace-pre-line font-normal">
                  {m.text.split('**').map((part, index) =>
                    index % 2 === 1 ? (
                      <strong key={index} className={isUser ? 'font-bold underline' : 'font-bold text-[#9A3412]'}>
                        {part}
                      </strong>
                    ) : (
                      part
                    )
                  )}
                </div>
              </div>
              <span className="text-[10px] text-[#111111]/40 mt-1 px-1 font-mono">
                {m.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] text-xs text-[#9A3412] w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#EA580C]" />
            <span>Analyzing tables & formulating action...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-[#FED7AA] bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about waste, stockouts, or transfer solutions..."
            disabled={isLoading}
            className="flex-1 px-3 py-2 text-xs rounded-lg border border-[#111111]/20 bg-white text-[#111111] placeholder:text-[#111111]/50 focus:outline-hidden focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-2 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white disabled:opacity-50 transition-colors cursor-pointer"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </aside>
  );
};
