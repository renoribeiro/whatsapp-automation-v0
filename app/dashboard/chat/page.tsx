"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Phone, Video, MoreVertical, Search, Paperclip, Smile } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "contact"
  timestamp: string
  type: "text" | "image" | "file"
}

interface Contact {
  id: string
  name: string
  phone: string
  avatar?: string
  lastSeen: string
  isOnline: boolean
  unreadCount: number
}

const mockContacts: Contact[] = [
  {
    id: "1",
    name: "João Silva",
    phone: "+55 11 99999-9999",
    avatar: "/placeholder-user.jpg",
    lastSeen: "online",
    isOnline: true,
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Maria Santos",
    phone: "+55 11 88888-8888",
    lastSeen: "há 5 min",
    isOnline: false,
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Pedro Costa",
    phone: "+55 11 77777-7777",
    lastSeen: "há 1 hora",
    isOnline: false,
    unreadCount: 1,
  },
]

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Olá! Gostaria de saber mais sobre os produtos",
    sender: "contact",
    timestamp: "2024-01-20T10:30:00Z",
    type: "text",
  },
  {
    id: "2",
    content: "Olá João! Claro, ficarei feliz em ajudar. Que tipo de produto você está procurando?",
    sender: "user",
    timestamp: "2024-01-20T10:31:00Z",
    type: "text",
  },
  {
    id: "3",
    content: "Estou interessado nos planos de automação para WhatsApp",
    sender: "contact",
    timestamp: "2024-01-20T10:32:00Z",
    type: "text",
  },
  {
    id: "4",
    content: "Perfeito! Temos várias opções que podem atender suas necessidades. Posso te enviar mais detalhes?",
    sender: "user",
    timestamp: "2024-01-20T10:33:00Z",
    type: "text",
  },
]

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact>(mockContacts[0])
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredContacts = mockContacts.filter(
    (contact) => contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || contact.phone.includes(searchTerm),
  )

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        sender: "user",
        timestamp: new Date().toISOString(),
        type: "text",
      }
      setMessages([...messages, message])
      setNewMessage("")
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Contacts Sidebar */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold mb-3">Conversas</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
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
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedContact.id === contact.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {contact.isOnline && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-sm truncate">{contact.name}</h3>
                    {contact.unreadCount > 0 && (
                      <Badge className="bg-red-500 text-white text-xs">{contact.unreadCount}</Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{contact.phone}</p>
                  <p className="text-xs text-gray-400">{contact.isOnline ? "online" : contact.lastSeen}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} />
              <AvatarFallback>
                {selectedContact.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{selectedContact.name}</h3>
              <p className="text-sm text-gray-500">{selectedContact.isOnline ? "online" : selectedContact.lastSeen}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="h-4 w-4" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Digite sua mensagem..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                className="pr-10"
              />
              <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                <Smile className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={sendMessage} disabled={!newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
