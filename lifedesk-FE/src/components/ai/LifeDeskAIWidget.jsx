import { useEffect, useRef, useState } from "react";
import {
  Bot,
  Sparkles,
  X,
  Send,
  ListChecks,
  CalendarDays,
  Target,
  Lightbulb,
  Maximize2,
  Minimize2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { sendAiMessage} from "../../api/aiApi";
import { connectGoogleCalendar } from "../../api/calendarService";

const suggestions = [
  {
    icon: CalendarDays,
    label: "Plan my day",
    prompt: "Help me plan my day around my deadlines.",
  },
  {
    icon: ListChecks,
    label: "Prioritize my tasks",
    prompt: "Look at my tasks and tell me what I should focus on today.",
  },
  {
    icon: Target,
    label: "Review my workload",
    prompt: "Review my workload and suggest how to manage it.",
  },
  {
    icon: Lightbulb,
    label: "Get suggestions",
    prompt: "Give me practical suggestions to improve my productivity.",
  },
];

export default function LifeDeskAIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && !isExpanded) {
      textareaRef.current?.focus();
    }
  }, [isOpen, isExpanded]);

  function startMessage(prompt) {
    setInput(prompt);
    setIsOpen(true);
    setTimeout(() => textareaRef.current?.focus(), 0);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const content = input.trim();
    if (!content || isSending) return;

    setInput("");
    setError("");
    setIsSending(true);
    setMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        role: "user",
        content,
      },
    ]);
    try {
      const response = await sendAiMessage(content, conversationId);
      if (!response?.reply) {
        throw new Error("The AI returned an empty response");
      }
      if (response.conversationId) {
        setConversationId(response.conversationId);
      }
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.reply,
        },
      ]);
      if(response.action=="CONNECT_GOOGLE_CALENDAR"){
        await connectGoogleCalendar();
      }
    } catch (error) {
      console.error("LifeDesk AI request failed", error);
      setError(
        error.response?.data?.datail ||
          error.response?.data?.message ||
          "I couldn't reach LifeDesk AI. Please try again.",
      );
    } finally {
      setIsSending(false);
    }

    setInput("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event);
    }

    if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  function closeWidget() {
    setIsOpen(false);
    setIsExpanded(false);
  }

  return (
    <>
      {/* Floating launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open LifeDesk AI"
          className="fixed bottom-5 right-5 z-[1000] flex items-center gap-3 rounded-full bg-emerald-950 py-3 pl-4 pr-5 text-white shadow-xl shadow-emerald-950/20 transition hover:-translate-y-0.5 hover:bg-emerald-900 focus:outline-none focus:ring-4 focus:ring-emerald-200"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-200 text-emerald-950">
            <Sparkles size={20} />
          </span>

          <span className="text-left">
            <span className="block text-sm font-semibold">LifeDesk AI</span>
            <span className="block text-xs text-emerald-100">
              How can I help?
            </span>
          </span>
        </button>
      )}

      {/* Assistant panel */}
      {isOpen && (
        <section
          aria-label="LifeDesk AI assistant"
          className={`fixed z-[1001] flex flex-col overflow-hidden border border-slate-200 bg-white shadow-2xl shadow-slate-900/20
            inset-0 rounded-none
            sm:inset-auto sm:bottom-5 sm:right-5 sm:rounded-2xl
            ${
              isExpanded
                ? "sm:h-[min(760px,calc(100dvh-40px))] sm:w-[min(680px,calc(100vw-40px))]"
                : "sm:h-[min(650px,calc(100dvh-40px))] sm:w-[min(420px,calc(100vw-40px))]"
            }`}
        >
          {/* Header */}
          <header className="flex shrink-0 items-center gap-3 border-b border-slate-100 bg-white px-4 py-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-emerald-950">
              <Bot size={24} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-slate-900">LifeDesk AI</h2>
              <p className="text-xs text-slate-500">
                Your productivity partner
              </p>
            </div>

            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              AI assistant
            </span>

            <button
              type="button"
              onClick={() => setIsExpanded((previous) => !previous)}
              aria-label={isExpanded ? "Reduce panel size" : "Expand panel"}
              className="hidden h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 sm:flex"
            >
              {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>

            <button
              type="button"
              onClick={closeWidget}
              aria-label="Close LifeDesk AI"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
            >
              <X size={20} />
            </button>
          </header>

          {/* Scrollable conversation */}
          <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-slate-50/70">
            {!hasMessages ? (
              <div className="flex flex-1 flex-col justify-center px-5 py-7">
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-lime-100 to-emerald-50 text-emerald-900 ring-1 ring-emerald-100">
                  <Sparkles size={31} />
                </div>

                <h3 className="text-center text-xl font-semibold tracking-tight text-slate-900">
                  How can I help you today?
                </h3>

                <p className="mx-auto mt-2 max-w-xs text-center text-sm leading-5 text-slate-500">
                  Let's make progress on your tasks, one step at a time.
                </p>

                <div className="mt-7 space-y-2.5">
                  {suggestions.map((suggestion) => {
                    const Icon = suggestion.icon;

                    return (
                      <button
                        key={suggestion.label}
                        type="button"
                        onClick={() => startMessage(suggestion.prompt)}
                        className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left transition hover:border-emerald-200 hover:bg-emerald-50/60 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lime-50 text-emerald-800">
                          <Icon size={19} />
                        </span>

                        <span className="flex-1 text-sm font-medium text-slate-800">
                          {suggestion.label}
                        </span>

                        <span className="text-lg text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-emerald-700">
                          →
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="mt-5 text-center text-xs text-slate-400">
                  Ask about your tasks, deadlines, or daily plan.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5 px-4 py-5">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-2.5 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.role === "assistant" && (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-lime-100 text-emerald-900">
                        <Bot size={18} />
                      </div>
                    )}

                    
<div
  className={`min-w-0 max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[85%] ${
    message.role === "user"
      ? "whitespace-pre-wrap rounded-br-md bg-emerald-950 text-white"
      : "rounded-bl-md border border-slate-200 bg-white text-slate-800 shadow-sm"
  }`}
>
  {message.role === "user" ? (
    message.content
  ) : (
    <div
      className="
        min-w-0 break-words
        [&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:text-slate-900
        [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-slate-900
        [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-slate-900
        [&_p]:my-3
        [&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5
        [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5
        [&_li]:pl-1
        [&_strong]:font-semibold [&_strong]:text-slate-900
        [&_em]:italic
        [&_hr]:my-5 [&_hr]:border-slate-200
        [&_blockquote]:my-3 [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-300 [&_blockquote]:pl-3 [&_blockquote]:text-slate-600
        [&_a]:text-emerald-800 [&_a]:underline [&_a]:underline-offset-2
        [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-xs
        [&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-xl [&_pre]:bg-slate-900 [&_pre]:p-3 [&_pre]:text-slate-100
        [&_pre_code]:bg-transparent [&_pre_code]:p-0
        [&_table]:w-full [&_table]:min-w-[420px] [&_table]:border-collapse [&_table]:text-left
        [&_thead]:bg-slate-100
        [&_th]:border [&_th]:border-slate-200 [&_th]:px-3 [&_th]:py-2 [&_th]:font-semibold
        [&_td]:border [&_td]:border-slate-200 [&_td]:px-3 [&_td]:py-2
      "
    >
      <div className="overflow-x-auto">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  )}
</div>

                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </main>
          {error && (
            <div
              role="alert"
              className="mx-4 mb-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {error}
              <button
                type="button"
                onClick={() => setError("")}
                className="ml-2 font-medium underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Composer */}
          <footer className="shrink-0 border-t border-slate-100 bg-white px-3 pb-3 pt-3 sm:px-4">
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 transition focus-within:border-emerald-300 focus-within:ring-4 focus-within:ring-emerald-50"
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your tasks..."
                rows={1}
                className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2.5 py-2.5 text-sm leading-5 text-slate-800 outline-none placeholder:text-slate-400"
              />

              <button
                type="submit"
                disabled={!input.trim() || isSending}
                aria-label="Send message"
                className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-900 text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <Send size={17} />
              </button>
            </form>

            <p className="mt-2.5 text-center text-[11px] leading-4 text-slate-400">
              AI can make mistakes. Review important decisions.
            </p>
          </footer>
        </section>
      )}
    </>
  );
}
