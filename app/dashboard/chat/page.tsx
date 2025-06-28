"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Search,
  MessageCircle,
  Check,
  CheckCheck,
} from "lucide-react"
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
}

interface Conversation {
  id: string
  contactName: string
  contactPhone: string
  avatar?: string
  lastMessage: string
  timestamp: Date
  unreadCount: number
  isOnline: boolean
  isTyping: boolean
  company: string
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    contactName: "João Silva",
    contactPhone: "+55 11 99999-9999",
    lastMessage: "Olá, gostaria de saber mais sobre os planos",
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    unreadCount: 3,
    isOnline: true,
    isTyping: false,
    company: "TechStart",
  },
  {
    id: "2",
    contactName: "Ana Costa",
    contactPhone: "+55 11 88888-8888",
    lastMessage: "Obrigada pelo atendimento!",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    unreadCount: 0,
    isOnline: false,
    isTyping: false,
    company: "Fashion Store",
  },
  {
    id: "3",
    contactName: "Pedro Oliveira",
    contactPhone: "+55 11 77777-7777",
    lastMessage: "Preciso de ajuda com meu pedido",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    unreadCount: 1,
    isOnline: true,
    isTyping: true,
    company: "AutoPeças Plus",
  },
]

const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      content: "Olá! Como posso ajudar você hoje?",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isOutbound: true,
      isRead: true,
      isDelivered: true,
      messageType: "text",
    },
    {
      id: "2",
      content: "Olá, gostaria de saber mais sobre os planos disponíveis",
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      isOutbound: false,
      isRead: true,
      isDelivered: true,
      messageType: "text",
    },
    {
      id: "3",
      content: "Claro! Temos 3 planos principais: Básico, Profissional e Enterprise. Qual seria o seu interesse?",
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      isOutbound: true,
      isRead: true,
      isDelivered: true,
      messageType: "text",
    },
    {
      id: "4",
      content: "Me interessei pelo plano Profissional. Quais são os recursos inclusos?",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      isOutbound: false,
      isRead: false,
      isDelivered: true,
      messageType: "text",
    },
  ],
}

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>("1")
  const [message, setMessage] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations)
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages)
  const [searchTerm, setSearchTerm] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, selectedConversation])

  // WebSocket connection simulation
  useEffect(() => {
    // Simulate WebSocket connection
    const connectWebSocket = () => {
      console.log("Connecting to WebSocket...")

      // Simulate receiving messages
      const interval = setInterval(() => {
        if (Math.random() > 0.8 && selectedConversation) {
          const newMessage: Message = {
            id: Date.now().toString(),
            content: "Esta é uma mensagem simulada em tempo real!",
            timestamp: new Date(),
            isOutbound: false,
            isRead: false,
            isDelivered: true,
            messageType: "text",
          }

          setMessages((prev) => ({
            ...prev,
            [selectedConversation]: [...(prev[selectedConversation] || []), newMessage],
          }))

          // Update conversation
          setConversations((prev) =>
            prev.map((conv) =>
              conv.id === selectedConversation
                ? { ...conv, lastMessage: newMessage.content, unreadCount: conv.unreadCount + 1 }
                : conv,
            ),
          )
        }
      }, 10000)

      return () => clearInterval(interval)
    }

    const cleanup = connectWebSocket()
    return cleanup
  }, [selectedConversation])

  const sendMessage = () => {
    if (!message.trim() || !selectedConversation) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: message,
      timestamp: new Date(),
      isOutbound: true,
      isRead: false,
      isDelivered: false,
      messageType: "text",
    }

    setMessages((prev) => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), newMessage],
    }))

    // Update conversation
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation ? { ...conv, lastMessage: message, timestamp: new Date() } : conv,
      ),
    )

    setMessage("")

    // Simulate message delivery
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map((msg) =>
          msg.id === newMessage.id ? { ...msg, isDelivered: true } : msg,
        ),
      }))
    }, 1000)

    // Simulate message read
    setTimeout(() => {
      setMessages((prev) => ({
        ...prev,
        [selectedConversation]: prev[selectedConversation].map((msg) =>
          msg.id === newMessage.id ? { ...msg, isRead: true } : msg,
        ),
      }))
    }, 3000)
  }

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.contactName.toLowerCase().includes(searchTerm.toLowerCase()) || conv.contactPhone.includes(searchTerm),
  )

  const selectedConv = conversations.find((conv) => conv.id === selectedConversation)
  const currentMessages = selectedConversation ? messages[selectedConversation] || [] : []

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (date: Date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return formatTime(date)
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ontem"
    } else {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    }
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Conversations List */}
      <div className="w-80 border-r bg-background">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Conversas</h2>
            <Button size="sm" variant="outline">
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-120px)]">
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-accent transition-colors",
                  selectedConversation === conversation.id && "bg-accent",
                )}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={conversation.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {conversation.contactName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{conversation.contactName}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(conversation.timestamp)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.isTyping ? (
                        <span className="text-green-600 italic">digitando...</span>
                      ) : (
                        conversation.lastMessage
                      )}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <Badge variant="destructive" className="ml-2 h-5 min-w-5 text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{conversation.company}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {selectedConv ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b bg-background">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={selectedConv.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedConv.contactName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {selectedConv.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold">{selectedConv.contactName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConv.isOnline ? "Online" : `Visto por último ${formatDate(selectedConv.timestamp)}`}
                  </p>
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
              {currentMessages.map((msg, index) => {
                const showDate =
                  index === 0 ||
                  new Date(currentMessages[index - 1].timestamp).toDateString() !==
                    new Date(msg.timestamp).toDateString()

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
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
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
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="pr-10"
                />
                <Button size="sm" variant="ghost" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button onClick={sendMessage} disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/20">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Selecione uma conversa</h3>
            <p className="text-muted-foreground">Escolha uma conversa da lista para começar a conversar</p>
          </div>
        </div>
      )}
    </div>
  )
}
