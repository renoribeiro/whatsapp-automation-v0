"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, Paperclip, Smile, Phone, Video, MoreVertical, Circle } from "lucide-react"

// Mock data
const contacts = [
  {
    id: 1,
    name: "João Silva",
    phone: "+55 11 99999-9999",
    lastMessage: "Olá, gostaria de saber mais sobre o produto",
    timestamp: "14:30",
    unread: 3,
    online: true,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "Maria Santos",
    phone: "+55 11 88888-8888",
    lastMessage: "Obrigada pelo atendimento!",
    timestamp: "12:15",
    unread: 0,
    online: false,
    avatar: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "Pedro Costa",
    phone: "+55 11 77777-7777",
    lastMessage: "Quando vocês podem me ligar?",
    timestamp: "10:45",
    unread: 1,
    online: true,
    avatar: "/placeholder-user.jpg",
  },
]

const messages = [
  {
    id: 1,
    text: "Olá! Como posso ajudá-lo hoje?",
    sender: "me",
    timestamp: "14:25",
    status: "read",
  },
  {
    id: 2,
    text: "Olá, gostaria de saber mais sobre o produto",
    sender: "contact",
    timestamp: "14:26",
    status: "delivered",
  },
  {
    id: 3,
    text: "Claro! Qual produto específico você tem interesse?",
    sender: "me",
    timestamp: "14:27",
    status: "read",
  },
  {
    id: 4,
    text: "Estou interessado no plano Enterprise",
    sender: "contact",
    timestamp: "14:30",
    status: "delivered",
  },
]

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState(contacts[0])
  const [messageText, setMessageText] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Aqui você enviaria a mensagem
      console.log("Enviando mensagem:", messageText)
      setMessageText("")
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Contacts Sidebar */}
      <div className="w-80 border-r bg-background">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <ScrollArea className="h-[calc(100%-5rem)]">
          <div className="p-2">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-accent ${
                  selectedContact.id === contact.id ? "bg-accent" : ""
                }`}
              >
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={contact.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {contact.online && (
                    <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{contact.name}</p>
                    <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                    {contact.unread > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {contact.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={selectedContact.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {selectedContact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  {selectedContact.online && (
                    <Circle className="absolute -bottom-1 -right-1 h-3 w-3 fill-green-500 text-green-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{selectedContact.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedContact.online ? "Online" : "Offline"} • {selectedContact.phone}
                  </p>
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
                  <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage()
                      }
                    }}
                  />
                </div>
                <Button variant="ghost" size="sm">
                  <Smile className="h-4 w-4" />
                </Button>
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium">Selecione uma conversa</p>
              <p className="text-muted-foreground">Escolha uma conversa da lista para começar a conversar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
