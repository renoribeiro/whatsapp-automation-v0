"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { name: "Jan", revenue: 4000 },
  { name: "Fev", revenue: 3000 },
  { name: "Mar", revenue: 5000 },
  { name: "Abr", revenue: 2800 },
  { name: "Mai", revenue: 5900 },
  { name: "Jun", revenue: 3200 },
  { name: "Jul", revenue: 4500 },
]

export function RevenueChart() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Receita Mensal</CardTitle>
        <CardDescription>Receita gerada nos últimos 7 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`R$ ${value}`, "Receita"]} />
            <Line type="monotone" dataKey="revenue" stroke="#25D366" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
