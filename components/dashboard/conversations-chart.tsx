"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", conversations: 400 },
  { name: "Fev", conversations: 300 },
  { name: "Mar", conversations: 500 },
  { name: "Abr", conversations: 280 },
  { name: "Mai", conversations: 590 },
  { name: "Jun", conversations: 320 },
  { name: "Jul", conversations: 450 },
]

export function ConversationsChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Conversas por Mês</CardTitle>
        <CardDescription>Número de conversas iniciadas nos últimos 7 meses</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="conversations" fill="#25D366" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
