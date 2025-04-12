"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Bot, Send, User, Sparkles, Paperclip, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDropzone } from "react-dropzone";

type Message = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  files?: File[];
};

export function AICopilotSidebar() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hello Jane! I'm your healthcare assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: true,
    maxFiles: 5,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
      "application/pdf": [".pdf"],
    },
    onDrop: (acceptedFiles) => {
      setUploadedFiles([...uploadedFiles, ...acceptedFiles]);
    },
  });

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  const handleSendMessage = async () => {
    if (!input.trim() && uploadedFiles.length === 0) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
      files: uploadedFiles.length > 0 ? [...uploadedFiles] : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setUploadedFiles([]);
    setIsLoading(true);

    try {
      // Prepare messages for API
      const apiMessages = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Add system message
      apiMessages.unshift({
        role: "system",
        content: `You are a healthcare assistant called 0G MD. Here's some health data for the patient:
          - Heart Rate: 72 bpm (Normal range, trend: stable)
          - Blood Pressure: 120/80 mmHg (Optimal, trend: improving)
          - Temperature: 98.6°F (Normal, trend: stable)
          - Glucose Level: 95 mg/dL (Fasting, trend: stable)
          - Weight: 145 lbs (BMI: 22.5, trend: improving)
          - Cholesterol: 180 mg/dL (Total, trend: needs attention)
          
          Provide helpful, accurate information based on this health data. Be friendly and supportive.`,
      });

      // Add the new user message
      apiMessages.push({
        role: "user",
        content: input,
      });

      // Call our backend API route
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse =
        data.choices[0]?.message?.content ||
        "I'm sorry, I couldn't process that request.";

      // Add AI response
      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error calling chat API:", error);

      // Fallback to hardcoded responses if API fails
      const responses = [
        "Based on your recent lab results, your cholesterol levels have improved since your last test.",
        "Your next appointment with Dr. Johnson is scheduled for April 10th at 2:00 PM.",
        "I notice you've been prescribed Atorvastatin. Would you like information about this medication?",
        "Your blood pressure readings have been stable over the last three months.",
        "I can help you understand your recent test results. Which one would you like to discuss?",
        "I've uploaded your recent lab results. Would you like me to explain them to you?",
      ];

      const aiMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sidebar side="left" variant="inset">
      <div {...getRootProps()} className="relative h-full flex flex-col">
        <input {...getInputProps()} />
        {isDragActive && (
          <div className="absolute inset-0 bg-primary/20 z-50 rounded-lg border-2 border-dashed border-primary flex items-center justify-center">
            <p className="text-primary font-medium">Drop files here</p>
          </div>
        )}
        <SidebarHeader className="p-4 border-b">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-semibold ml-2">0G MD</h2>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex w-full gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}

                  <div
                    className={`p-3 rounded-lg max-w-[80%] ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-none"
                        : "bg-background text-secondary-foreground rounded-tl-none"
                    }`}
                  >
                    {message.content}

                    {message.files && message.files.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {message.files.map((file, index) => (
                          <div
                            key={index}
                            className="text-xs flex items-center gap-1"
                          >
                            <Paperclip className="h-3 w-3" />
                            <span>{file.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {message.role === "user" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src="/placeholder.svg?height=32&width=32"
                        alt="User"
                      />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex w-full gap-3 justify-start">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="p-3 rounded-lg max-w-[80%] bg-background text-secondary-foreground rounded-tl-none">
                    <div className="flex space-x-2">
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "600ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </SidebarContent>

        <SidebarFooter className="p-0 border-t">
          <div className="flex flex-col">
            {uploadedFiles.length > 0 && (
              <div className="p-2 flex flex-wrap gap-2">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="bg-muted text-xs rounded-full px-3 py-1 flex items-center gap-1"
                  >
                    <span className="truncate max-w-[100px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Ask about your health records..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendMessage();
                  }
                }}
                className="flex-1 shadow shadow-2xl hover:shadow-none hover:border-primary"
                onClick={(e) => e.stopPropagation()}
                disabled={isLoading}
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  const fileInput = document.querySelector(
                    'input[type="file"]',
                  ) as HTMLInputElement;
                  if (fileInput) fileInput.click();
                }}
                size="icon"
                variant="outline"
                disabled={isLoading}
              >
                <Paperclip className="h-4 w-4" />
                <span className="sr-only">Upload file</span>
              </Button>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendMessage();
                }}
                size="icon"
                disabled={isLoading}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Your health assistant uses your <strong>encrypted</strong> medical
            records to provide personalized information.
          </div>
        </SidebarFooter>
      </div>
      <SidebarRail />
    </Sidebar>
  );
}
