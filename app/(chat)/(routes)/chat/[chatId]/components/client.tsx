"use client";

import { useCompletion, useChat } from "ai/react";
import { FormEvent, useEffect, useState } from "react";
import { Companion, Message } from "@prisma/client";
import { useRouter } from "next/navigation";

import { ChatHeader } from "@/components/chat-header";
import { ChatForm } from "@/components/chat-form";
import { ChatMessages } from "@/components/chat-messages";
import { ChatMessageProps } from "@/components/chat-message";

interface ChatClientProps {
  companion: Companion & {
    messages: Message[];
    _count: {
      messages: number;
    };
  };
}

export const ChatClient = ({ companion }: ChatClientProps) => {
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessageProps[]>(
    companion.messages
  );  

  const {
    input,
    isLoading,
    handleInputChange,
    handleSubmit,
    setInput,
    error,
  } = useChat({
    api: `/api/chat/${companion.id}`,
    onFinish: (message) => {
      console.log("onFinish callback triggered"); // Debugging log
      const systemMessage: ChatMessageProps = {
        role: "system",
        content: message.content,
      };

      setMessages((current) => [...current, systemMessage]);
      console.log("last message ",systemMessage );
      setInput("");
      router.refresh();
    },
    onError: (err) => {
      console.error("Chat error: ", err); // Log errors
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userMessage: ChatMessageProps = {
      role: "user",
      content: input,
    };

    setMessages((current) => [...current, userMessage]);
    try {
       handleSubmit(e);
    } catch (err) {
      console.error("Handle submit error: ", err); // Log errors from handleSubmit
    }
  };

  useEffect(() => {
    if (error) {
      console.error("Error from useChat: ", error);
    }
  }, [error]);

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <ChatHeader companion={companion} />
      <ChatMessages
        companion={companion}
        isLoading={isLoading}
        messages={messages}
      />
      <ChatForm
        isLoading={isLoading}
        input={input}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
      />
    </div>
  );
};
