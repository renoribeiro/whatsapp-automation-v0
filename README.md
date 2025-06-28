# 🚀 WhatsApp Platform - SaaS de Gestão e Automação

Uma plataforma completa para gestão e automação de WhatsApp, desenvolvida com **NestJS**, **TypeScript**, **Prisma** e **PostgreSQL**.

## 📋 Funcionalidades

### 🏢 **Multi-tenant Hierárquico**
- **Super Admin**: Controle total da plataforma
- **Agências**: Gerenciam múltiplas empresas
- **Empresas**: Gerenciam vendedores e operações
- **Vendedores**: Atendem clientes via WhatsApp

### 📱 **Integração WhatsApp**
- **Evolution API V2**: Conexão via QR Code
- **API Oficial Meta**: Integração empresarial
- **Multi-números**: Múltiplas conexões por empresa
- **Monitoramento**: Status em tempo real

### 🤖 **Automação Inteligente**
- **Fluxos Visuais**: Criação de chatbots
- **Triggers**: Acionamento automático
- **Variáveis Dinâmicas**: Personalização de mensagens
- **Condições Lógicas**: Fluxos inteligentes

### 💬 **Chat em Tempo Real**
- **WebSocket**: Comunicação instantânea
- **Atribuição**: Conversas por vendedor
- **Histórico**: Todas as mensagens salvas
- **Mídia**: Suporte a imagens, áudios e documentos

### 📊 **Relatórios e Analytics**
- **Dashboard Executivo**: Métricas principais
- **Performance**: Análise de vendedores
- **Leads**: Origem e conversão
- **Exportação**: PDF, Excel, CSV

### 💰 **Sistema de Faturamento**
- **Planos**: R$ 150 base + R$ 100/vendedor
- **Trial**: 7 dias gratuitos
- **Stripe**: Pagamentos automáticos
- **Comissões**: 25% para agências

### 🔗 **Integrações**
- **Google Sheets**: Exportação automática
- **Webhooks**: Integração com CRMs
- **OpenAI**: Chatbots inteligentes
- **Extensível**: Novas integrações facilmente

## 🛠️ **Tecnologias**

- **Backend**: NestJS + TypeScript
- **Banco**: PostgreSQL + Prisma ORM
- **Cache**: Redis + Bull Queue
- **Auth**: JWT + Refresh Tokens
- **Docs**: Swagger/OpenAPI
- **WebSocket**: Socket.IO
- **Pagamentos**: Stripe
- **IA**: OpenAI GPT

## 🚀 **Instalação**

### **Pré-requisitos**
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Yarn ou NPM

### **1. Clone o repositório**
\`\`\`bash
git clone <repository-url>
cd whatsapp-platform-backend
\`\`\`

### **2. Instale as dependências**
\`\`\`bash
yarn install
# ou
npm install
\`\`\`

### **3. Configure as variáveis de ambiente**
\`\`\`bash
cp .env.example .env
\`\`\`

Edite o arquivo `.env` com suas configurações:

\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/whatsapp_platform"

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-here"

# Evolution API
EVOLUTION_API_URL="http://localhost:8080"
EVOLUTION_API_KEY="your-evolution-api-key"

# Meta WhatsApp API
META_ACCESS_TOKEN="your-meta-access-token"
META_PHONE_NUMBER_ID="your-phone-number-id"

# Stripe
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"

# OpenAI
OPENAI_API_KEY="sk-your-openai-api-key"
\`\`\`

### **4. Configure o banco de dados**
\`\`\`bash
# Gerar cliente Prisma
yarn prisma generate

# Executar migrações
yarn prisma migrate dev

# Popular banco com dados iniciais
yarn seed
\`\`\`

### **5. Inicie o servidor**
\`\`\`bash
# Desenvolvimento
yarn start:dev

# Produção
yarn build
yarn start:prod
\`\`\`

## 📚 **Documentação da API**

Após iniciar o servidor, acesse:
- **Swagger UI**: `http://localhost:3000/api/v1/docs`
- **API Base**: `http://localhost:3000/api/v1`

## 🔐 **Credenciais Padrão**

Após executar o seed, use estas credenciais para testar:

\`\`\`
Super Admin: admin@whatsapp-platform.com / admin123
Admin Agência: admin@agencia.com / admin123
Admin Empresa: admin@empresa.com / admin123
Vendedor: vendedor@empresa.com / admin123
\`\`\`

## 🏗️ **Estrutura do Projeto**

\`\`\`
src/
├── auth/              # Autenticação e autorização
├── users/             # Gestão de usuários
├── companies/         # Gestão de empresas
├── agencies/          # Gestão de agências
├── whatsapp/          # Integração WhatsApp
├── contacts/          # Gestão de contatos
├── conversations/     # Gestão de conversas
├── messages/          # Gestão de mensagens
├── tags/              # Sistema de tags
├── automation/        # Fluxos de automação
├── reports/           # Relatórios e analytics
├── billing/           # Sistema de faturamento
├── integrations/      # Integrações externas
├── websocket/         # WebSocket para chat
└── prisma/            # Configuração do banco
\`\`\`

## 🔄 **Fluxo de Desenvolvimento**

### **1. Desenvolvimento Local**
\`\`\`bash
# Instalar dependências
yarn install

# Configurar banco
yarn prisma migrate dev
yarn seed

# Iniciar em modo desenvolvimento
yarn start:dev
\`\`\`

### **2. Testes**
\`\`\`bash
# Testes unitários
yarn test

# Testes e2e
yarn test:e2e

# Coverage
yarn test:cov
\`\`\`

### **3. Build e Deploy**
\`\`\`bash
# Build para produção
yarn build

# Executar migrações em produção
yarn prisma migrate deploy

# Iniciar em produção
yarn start:prod
\`\`\`

## 📊 **Monitoramento**

### **Logs**
- Todos os logs são estruturados
- Níveis: error, warn, log, debug
- Contexto por módulo

### **Métricas**
- Rate limiting configurado
- Monitoramento de performance
- Logs de atividade dos usuários

### **Saúde da API**
- Health checks automáticos
- Status das integrações
- Monitoramento do banco

## 🔧 **Configurações Avançadas**

### **Rate Limiting**
\`\`\`typescript
// 100 requests por minuto por IP
ThrottlerModule.forRoot([{
  ttl: 60000,
  limit: 100,
}])
\`\`\`

### **CORS**
\`\`\`typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
})
\`\`\`

### **Validação**
\`\`\`typescript
// Validação global com class-validator
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}))
\`\`\`

## 🚀 **Deploy**

### **Docker**
\`\`\`dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
\`\`\`

### **Vercel/Railway/Heroku**
1. Configure as variáveis de ambiente
2. Configure o banco PostgreSQL
3. Configure o Redis
4. Deploy automático via Git

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 **Suporte**

- **Documentação**: Swagger UI em `/api/v1/docs`
- **Issues**: GitHub Issues
- **Email**: suporte@whatsapp-platform.com

---

**Desenvolvido com ❤️ usando NestJS + TypeScript**
