"use client";

import { Plus, Send, Sparkles } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatClient() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Ciao! Sono il tuo concierge per la serata. Hai già dei piani o vuoi scoprire qualcosa di nuovo a Genova stasera?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/recommendations/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      const assistantId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: "assistant", content: "" },
      ]);

      if (reader) {
        let text = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          text += decoder.decode(value);
          setMessages((prev) =>
            prev.map((m) => (m.id === assistantId ? { ...m, content: text } : m)),
          );
        }
      }
    } finally {
      setLoading(false);
      scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }
  }, [input, loading]);

  return (
    <div className="flex h-[calc(100dvh-8rem)] flex-col">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-lg overflow-y-auto px-container-margin py-lg">
        {/* Day divider */}
        <div className="flex justify-center">
          <span className="text-label-sm rounded-full border border-outline-variant bg-surface-container-low px-4 py-1 uppercase tracking-widest text-outline">
            Oggi
          </span>
        </div>

        {messages.map((msg) =>
          msg.role === "assistant" ? (
            <AiBubble key={msg.id} content={msg.content} />
          ) : (
            <UserBubble key={msg.id} content={msg.content} />
          ),
        )}

        {loading && (
          <AiBubble content="" loading />
        )}
      </div>

      {/* Input */}
      <div className="border-t border-outline-variant bg-surface-container/80 px-container-margin py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-screen-xl items-center gap-sm">
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container-highest text-primary active:scale-90"
          >
            <Plus className="h-5 w-5" />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Scrivi un messaggio..."
            className="text-body-md h-11 flex-1 rounded-full border border-outline-variant bg-surface-container px-6 text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-container text-on-primary-container transition-transform active:scale-90 disabled:opacity-40"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AiBubble({ content, loading }: { content: string; loading?: boolean }) {
  return (
    <div className="flex max-w-[85%] flex-col items-start md:max-w-[60%]">
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-container">
          <Sparkles className="h-3.5 w-3.5 text-on-primary-container" />
        </div>
        <span className="text-label-sm text-on-surface-variant">Stasera AI</span>
      </div>
      <div className="rounded-tr-xl rounded-br-xl rounded-bl-xl border border-outline-variant bg-surface-container-high p-md shadow-lg">
        {loading ? (
          <div className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant [animation-delay:0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant [animation-delay:0.3s]" />
          </div>
        ) : (
          <p className="text-body-md whitespace-pre-wrap text-on-surface">{content}</p>
        )}
      </div>
    </div>
  );
}

function UserBubble({ content }: { content: string }) {
  return (
    <div className="ml-auto flex max-w-[85%] flex-col items-end md:max-w-[60%]">
      <div className="rounded-tl-xl rounded-bl-xl rounded-br-xl bg-primary-container p-md shadow-lg">
        <p className="text-body-md font-medium text-on-primary-container">{content}</p>
      </div>
    </div>
  );
}
