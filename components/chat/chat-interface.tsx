"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useWebSocket } from "@/hooks/use-websocket"
import { Send, Phone, Video, MoreVertical, Paperclip, Smile, CheckCheck, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  content: string
  timestamp: Date
  isOutbound: boolean
  isRead: boolean
  isDelivered: boolean
  messageType: "text" | "image" | "document"
  mediaUrl?: string
  senderId?: string
}

interface ChatInterfaceProps {
  conversationId: string
  contactName: string
  contactPhone: string
  contactAvatar?: string
  isOnline: boolean
  initialMessages?: Message[]
  onSendMessage?: (message: string) => void
}

export function ChatInterface({
  conversationId,
  contactName,
  contactPhone,
  contactAvatar,
  isOnline,
  initialMessages = [],
  onSendMessage,
}: ChatInterfaceProps) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // WebSocket connection for real-time messaging
  const { isConnected, sendMessage: sendWebSocketMessage } = useWebSocket(
    `ws://localhost:3001/chat/${conversationId}`,
    {
      onMessage: (data) => {
        if (data.type === "new_message") {
          setMessages((prev) => [...prev, data.message])
        } else if (data.type === "message_read") {
          setMessages((prev) => prev.map((msg) => (msg.id === data.messageId ? { ...msg, isRead: true } : msg)))
        } else if (data.type === "typing") {
          setIsTyping(data.isTyping)
          if (data.isTyping) {
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current)
            }
            typingTimeoutRef.current = setTimeout(() => {
              setIsTyping(false)
            }, 3000)
          }
        }
      },
      onConnect: () => {
        console.log("Connected to chat WebSocket")
      },
      onDisconnect: () => {
        console.log("Disconnected from chat WebSocket")
      },
    },
  )

  const handleSendMessage = () => {
    if (!message.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date(),
      isOutbound: true,
      isRead: false,
      isDelivered: false,
      messageType: "text",
    }

    setMessages((prev) => [...prev, newMessage])

    // Send via WebSocket
    sendWebSocketMessage({
      type: "send_message",
      conversationId,
      message: newMessage,
    })

    // Call parent callback
    onSendMessage?.(message)

    setMessage("")

    // Simulate message delivery and read status
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, isDelivered: true } : msg)))
    }, 1000)

    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => (msg.id === newMessage.id ? { ...msg, isRead: true } : msg)))
    }, 3000)
  }

  const handleTyping = () => {
    sendWebSocketMessage({
      type: "typing",
      conversationId,
      isTyping: true,
    })

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      sendWebSocketMessage({
        type: "typing",
        conversationId,
        isTyping: false,
      })
    }, 1000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b bg-background">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar>
                <AvatarImage src={contactAvatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {contactName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{contactName}</h3>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">{isOnline ? "Online" : "Offline"}</p>
                {!isConnected && (
                  <Badge variant="outline" className="text-xs">
                    Reconectando...
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" variant="ghost">
              <Phone className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <Video className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg, index) => {
            const showDate =
              index === 0 ||
              new Date(messages[index - 1].timestamp).toDateString() !== new Date(msg.timestamp).toDateString()

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                      {new Date(msg.timestamp).toLocaleDateString("pt-BR", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}

                <div className={cn("flex", msg.isOutbound ? "justify-end" : "justify-start")}>
                  <div
                    className={cn(
                      "max-w-[70%] rounded-lg px-3 py-2",
                      msg.isOutbound ? "bg-whatsapp-500 text-white" : "bg-muted",
                    )}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div
                      className={cn(
                        "flex items-center justify-end space-x-1 mt-1",
                        msg.isOutbound ? "text-whatsapp-100" : "text-muted-foreground",
                      )}
                    >
                      <span className="text-xs">{formatTime(msg.timestamp)}</span>
                      {msg.isOutbound && (
                        <div className="flex">
                          {msg.isRead ? (
                            <CheckCheck className="h-3 w-3 text-blue-300" />
                          ) : msg.isDelivered ? (
                            <CheckCheck className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-background">
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="ghost">
            <Paperclip className="h-4 w-4" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                handleTyping()
              }}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              className="pr-10"
            />
            <Button size="sm" variant="ghost" className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={handleSendMessage} disabled={!message.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
