"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import {
  testDatabaseConnection,
  optimizeDatabase,
  createBackup,
  mockDatabaseConnection,
  mockDatabaseStats,
} from "@/lib/db"
import {
  Database,
  Server,
  HardDrive,
  Activity,
  Download,
  RefreshCw,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Zap,
  Shield,
  Archive,
} from "lucide-react"

export function DatabaseSettings() {
  const [isConnected, setIsConnected] = useState(mockDatabaseConnection.isConnected)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isCreatingBackup, setIsCreatingBackup] = useState(false)
  const [optimizationProgress, setOptimizationProgress] = useState(0)
  const [backupProgress, setBackupProgress] = useState(0)

  const [connectionSettings, setConnectionSettings] = useState(mockDatabaseConnection)
  const [databaseStats] = useState(mockDatabaseStats)

  const [backupHistory] = useState([
    {
      id: "1",
      filename: "backup_2024-01-15.sql",
      size: "2.3 GB",
      date: new Date(2024, 0, 15),
      status: "completed",
    },
    {
      id: "2",
      filename: "backup_2024-01-14.sql",
      size: "2.2 GB",
      date: new Date(2024, 0, 14),
      status: "completed",
    },
    {
      id: "3",
      filename: "backup_2024-01-13.sql",
      size: "2.1 GB",
      date: new Date(2024, 0, 13),
      status: "failed",
    },
  ])

  const handleTestConnection = async () => {
    setIsTestingConnection(true)
    try {
      const result = await testDatabaseConnection()
      setIsConnected(result)
      toast({
        title: result ? "Conexão bem-sucedida" : "Falha na conexão",
        description: result
          ? "A conexão com o banco de dados foi estabelecida com sucesso."
          : "Não foi possível conectar ao banco de dados.",
        variant: result ? "default" : "destructive",
      })
    } catch (error) {
      toast({
        title: "Erro no teste",
        description: "Ocorreu um erro ao testar a conexão.",
        variant: "destructive",
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  const handleOptimizeDatabase = async () => {
    setIsOptimizing(true)
    setOptimizationProgress(0)

    const interval = setInterval(() => {
      setOptimizationProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 300)

    try {
      await optimizeDatabase()
      toast({
        title: "Otimização concluída",
        description: "O banco de dados foi otimizado com sucesso.",
      })
    } catch (error) {
      toast({
        title: "Erro na otimização",
        description: "Ocorreu um erro durante a otimização.",
        variant: "destructive",
      })
    } finally {
      setIsOptimizing(false)
      setOptimizationProgress(0)
    }
  }

  const handleCreateBackup = async () => {
    setIsCreatingBackup(true)
    setBackupProgress(0)

    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 5
      })
    }, 250)

    try {
      const filename = await createBackup()
      toast({
        title: "Backup criado",
        description: `Backup salvo como ${filename}`,
      })
    } catch (error) {
      toast({
        title: "Erro no backup",
        description: "Ocorreu um erro ao criar o backup.",
        variant: "destructive",
      })
    } finally {
      setIsCreatingBackup(false)
      setBackupProgress(0)
    }
  }

  const getStatusBadge = (connected: boolean) => {
    return connected ? (
      <Badge className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Conectado
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Desconectado
      </Badge>
    )
  }

  const getBackupStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>
      case "failed":
        return <Badge variant="destructive">Falhou</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">Em andamento</Badge>
      default:
        return <Badge variant="secondary">Desconhecido</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Configurações do Banco de Dados</h3>
        <p className="text-sm text-muted-foreground">Gerencie a conexão, backup e manutenção do banco de dados.</p>
      </div>

      <Tabs defaultValue="status" className="space-y-4">
        <TabsList>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="connection">Conexão</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="maintenance">Manutenção</TabsTrigger>
        </TabsList>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status da Conexão</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  {getStatusBadge(isConnected)}
                  <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={isTestingConnection}>
                    {isTestingConnection ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Testar Conexão"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registros Totais</CardTitle>
                <HardDrive className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{databaseStats.totalRecords.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">registros no banco</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Armazenamento</CardTitle>
                <Server className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{databaseStats.storageUsed}</div>
                <p className="text-xs text-muted-foreground">espaço utilizado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conexões Ativas</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{databaseStats.connections}</div>
                <p className="text-xs text-muted-foreground">conexões simultâneas</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Tempo de Atividade</Label>
                  <p className="text-sm text-muted-foreground">{databaseStats.uptime}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Versão do PostgreSQL</Label>
                  <p className="text-sm text-muted-foreground">14.9</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Último Backup</Label>
                  <p className="text-sm text-muted-foreground">Hoje, 03:00</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Última Otimização</Label>
                  <p className="text-sm text-muted-foreground">Ontem, 02:00</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connection" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Conexão</CardTitle>
              <CardDescription>Configure os parâmetros de conexão com o banco de dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="db-host">Host</Label>
                  <Input
                    id="db-host"
                    value={connectionSettings.host}
                    onChange={(e) => setConnectionSettings((prev) => ({ ...prev, host: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="db-port">Porta</Label>
                  <Input
                    id="db-port"
                    type="number"
                    value={connectionSettings.port}
                    onChange={(e) =>
                      setConnectionSettings((prev) => ({ ...prev, port: Number.parseInt(e.target.value) }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="db-name">Nome do Banco</Label>
                <Input
                  id="db-name"
                  value={connectionSettings.database}
                  onChange={(e) => setConnectionSettings((prev) => ({ ...prev, database: e.target.value }))}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SSL Habilitado</Label>
                    <p className="text-sm text-muted-foreground">Usar conexão SSL para maior segurança</p>
                  </div>
                  <Switch
                    checked={connectionSettings.ssl}
                    onCheckedChange={(checked) => setConnectionSettings((prev) => ({ ...prev, ssl: checked }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="connection-timeout">Timeout de Conexão (s)</Label>
                  <Input id="connection-timeout" type="number" defaultValue="30" />
                </div>
                <div>
                  <Label htmlFor="query-timeout">Timeout de Query (s)</Label>
                  <Input id="query-timeout" type="number" defaultValue="60" />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleTestConnection} disabled={isTestingConnection}>
                  {isTestingConnection ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4 mr-2" />
                      Testar Conexão
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Backup do Banco de Dados</CardTitle>
              <CardDescription>Gerencie backups automáticos e manuais do banco de dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Backup Automático</h4>
                  <p className="text-sm text-muted-foreground">Backup diário às 03:00 (horário do servidor)</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="backup-retention">Retenção (dias)</Label>
                  <Input id="backup-retention" type="number" defaultValue="30" />
                </div>
                <div>
                  <Label htmlFor="backup-format">Formato</Label>
                  <Select defaultValue="sql">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sql">SQL</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                      <SelectItem value="tar">TAR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleCreateBackup} disabled={isCreatingBackup}>
                  {isCreatingBackup ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Criando Backup...
                    </>
                  ) : (
                    <>
                      <Archive className="h-4 w-4 mr-2" />
                      Criar Backup Manual
                    </>
                  )}
                </Button>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Último Backup
                </Button>
              </div>

              {isCreatingBackup && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso do backup</span>
                    <span>{backupProgress}%</span>
                  </div>
                  <Progress value={backupProgress} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Histórico de Backups</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backupHistory.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Archive className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{backup.filename}</p>
                        <p className="text-sm text-muted-foreground">
                          {backup.date.toLocaleDateString()} • {backup.size}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getBackupStatusBadge(backup.status)}
                      {backup.status === "completed" && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ferramentas de Manutenção</CardTitle>
              <CardDescription>Otimize e mantenha a performance do banco de dados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-5 w-5 text-blue-500" />
                    <div>
                      <h4 className="font-medium">Otimizar Banco de Dados</h4>
                      <p className="text-sm text-muted-foreground">Reorganiza índices e atualiza estatísticas</p>
                    </div>
                  </div>
                  <Button onClick={handleOptimizeDatabase} disabled={isOptimizing}>
                    {isOptimizing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Otimizando...
                      </>
                    ) : (
                      "Otimizar"
                    )}
                  </Button>
                </div>

                {isOptimizing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso da otimização</span>
                      <span>{optimizationProgress}%</span>
                    </div>
                    <Progress value={optimizationProgress} />
                  </div>
                )}

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <HardDrive className="h-5 w-5 text-green-500" />
                    <div>
                      <h4 className="font-medium">Limpeza de Dados</h4>
                      <p className="text-sm text-muted-foreground">Remove dados antigos e temporários</p>
                    </div>
                  </div>
                  <Button variant="outline">Executar Limpeza</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Activity className="h-5 w-5 text-purple-500" />
                    <div>
                      <h4 className="font-medium">Análise de Performance</h4>
                      <p className="text-sm text-muted-foreground">Identifica queries lentas e gargalos</p>
                    </div>
                  </div>
                  <Button variant="outline">Analisar</Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-orange-500" />
                    <div>
                      <h4 className="font-medium">Verificação de Integridade</h4>
                      <p className="text-sm text-muted-foreground">Verifica a consistência dos dados</p>
                    </div>
                  </div>
                  <Button variant="outline">Verificar</Button>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Atenção</p>
                    <p className="text-sm text-yellow-700">
                      Operações de manutenção podem afetar a performance temporariamente. Recomendamos executar durante
                      períodos de baixo uso.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agendamento Automático</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Otimização Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Executar otimização semanalmente aos domingos às 02:00
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Limpeza Automática</Label>
                  <p className="text-sm text-muted-foreground">
                    Executar limpeza mensalmente no primeiro domingo às 01:00
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Análise de Performance</Label>
                  <p className="text-sm text-muted-foreground">Executar análise diariamente às 04:00</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
