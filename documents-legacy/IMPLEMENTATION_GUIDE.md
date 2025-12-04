# Implementation Guide - Smart Business Assistant (SBA)

## 🚀 Getting Started

This guide provides step-by-step instructions for setting up and developing the Smart Business Assistant (SBA) platform using our monorepo architecture.

### Prerequisites

- **Node.js**: v20.x or higher
- **pnpm**: v8.x or higher
- **Docker**: v24.x or higher
- **Git**: v2.x or higher

### System Requirements

- **RAM**: Minimum 8GB, Recommended 16GB
- **Storage**: 10GB free space
- **OS**: macOS, Linux, or Windows (WSL2)

## 📦 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/sba-monorepo.git
cd sba-monorepo
```

### 2. Install Dependencies
```bash
# Install pnpm globally if not already installed
npm install -g pnpm

# Install all dependencies
pnpm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

Required environment variables:
```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/sba_dev"
REDIS_URL="redis://localhost:6379"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# External Services
BASEHUB_TOKEN="your-basehub-token"
OPENAI_API_KEY="your-openai-api-key"
ANTHROPIC_API_KEY="your-anthropic-api-key"
STRIPE_SECRET_KEY="your-stripe-secret-key"

# Monitoring
SENTRY_DSN="your-sentry-dsn"
```

### 4. Start Development Infrastructure
```bash
# Start PostgreSQL, Redis, and other services
docker-compose up -d

# Verify services are running
docker-compose ps
```

### 5. Database Setup
```bash
# Run database migrations
pnpm --filter api db:migrate

# Seed the database with sample data
pnpm --filter api db:seed
```

### 6. Start Development Servers
```bash
# Start all development servers
pnpm dev

# Or start specific services
pnpm --filter web dev      # Frontend only
pnpm --filter api dev      # API only
pnpm --filter worker dev   # Workers only
```

## 🏗️ Development Workflow

### Daily Development
```bash
# Pull latest changes
git pull origin main

# Install any new dependencies
pnpm install

# Start development environment
pnpm dev

# Run tests in watch mode
pnpm test:watch

# Check for TypeScript errors
pnpm type-check

# Run linting
pnpm lint

# Format code
pnpm format
```

### Before Committing
```bash
# Run all checks
pnpm check

# Run tests
pnpm test

# Build all packages (to ensure no build errors)
pnpm build
```

## 📁 Project Structure

### Monorepo Organization
```
sba-monorepo/
├── apps/                          # Applications
│   ├── web/                     # Next.js frontend
│   ├── admin/                   # Admin dashboard
│   ├── api/                     # NestJS API
│   └── worker/                  # Background workers
├── packages/                    # Shared packages
│   ├── ui/                      # Design system
│   ├── features/                # Feature modules
│   ├── entities/                # Domain models
│   ├── services/                # Domain services
│   ├── tools/                   # Tool adapters
│   ├── sdk/                     # API clients
│   ├── db/                      # Database utilities
│   └── utils/                   # Shared utilities
├── docs/                        # Documentation
├── scripts/                     # Development scripts
└── tools/                       # Build tools
```

### Frontend Structure (apps/web)
```
apps/web/src/
├── app/                         # Next.js App Router
├── processes/                   # Business processes
├── widgets/                     # UI widgets
├── features/                    # Feature modules (FSD)
│   ├── chat/
│   │   ├── model/              # State management
│   │   ├── ui/                 # Components
│   │   ├── api/                # API integration
│   │   └── lib/                # Utilities
├── entities/                    # Domain entities
└── shared/                      # Shared utilities
```

### Backend Structure (apps/api)
```
apps/api/src/
├── controllers/                 # API controllers
├── services/                    # Business services
├── repositories/                # Data access
├── entities/                    # Domain entities
├── tools/                       # Tool implementations
├── middleware/                  # Express middleware
└── utils/                       # Utilities
```

## 🔧 Development Guidelines

### Code Style
- Use **TypeScript** strict mode
- Follow **ESLint** configuration
- Use **Prettier** for formatting
- Write **self-documenting** code
- Add **JSDoc** for public APIs

### Component Development
```typescript
// features/chat/ui/ChatWindow.tsx
import { useChatStore } from '../model/chat.store'
import { MessageList } from './MessageList'
import { MessageInput } from './MessageInput'

export function ChatWindow() {
  const { messages, sendMessage, isLoading } = useChatStore()

  return (
    <div className="flex h-full flex-col">
      <MessageList messages={messages} />
      <MessageInput 
        onSend={sendMessage}
        disabled={isLoading}
      />
    </div>
  )
}
```

### API Development
```typescript
// apps/api/src/controllers/chat.controller.ts
import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { ChatService } from '../services/chat.service'
import { SendMessageDto } from '../dto/chat.dto'

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('message')
  async sendMessage(@Body() dto: SendMessageDto) {
    return this.chatService.sendMessage(dto)
  }
}
```

### Service Development
```typescript
// apps/api/src/services/chat.service.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { OpenAIService } from '../integrations/openai.service'

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private openAI: OpenAIService
  ) {}

  async sendMessage(dto: SendMessageDto) {
    // Validate input
    // Process message
    // Generate response
    // Store in database
    // Return response
  }
}
```

## 🧪 Testing

### Unit Tests
```typescript
// features/chat/model/chat.store.test.ts
import { describe, it, expect } from 'vitest'
import { createChatStore } from './chat.store'

describe('ChatStore', () => {
  it('should add message to conversation', () => {
    const store = createChatStore()
    
    store.addMessage({
      role: 'user',
      content: 'Hello'
    })
    
    expect(store.messages).toHaveLength(1)
    expect(store.messages[0].content).toBe('Hello')
  })
})
```

### Integration Tests
```typescript
// apps/api/test/chat.integration.test.ts
import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('Chat Integration', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('should create conversation', () => {
    return request(app.getHttpServer())
      .post('/conversations')
      .set('Authorization', 'Bearer test-token')
      .send({ title: 'Test Conversation' })
      .expect(201)
      .expect((res) => {
        expect(res.body.success).toBe(true)
        expect(res.body.data.conversation).toBeDefined()
      })
  })
})
```

### E2E Tests
```typescript
// tests/e2e/chat.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Chat Flow', () => {
  test('user can send message and receive response', async ({ page }) => {
    // Login
    await page.goto('/login')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password')
    await page.click('button[type="submit"]')

    // Navigate to chat
    await page.goto('/chat')
    
    // Send message
    await page.fill('[data-testid="message-input"]', 'Hello AI')
    await page.click('[data-testid="send-button"]')
    
    // Wait for response
    await expect(page.locator('[data-testid="message"]')).toContainText('Hello')
  })
})
```

## 📊 Database Development

### Schema Changes
```bash
# Create new migration
pnpm --filter api db:generate --name add_user_preferences

# Apply migration
pnpm --filter api db:migrate

# Rollback migration
pnpm --filter api db:rollback
```

### Database Seeding
```typescript
// apps/api/prisma/seed.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample tenants
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Acme Corporation',
      plan: 'pro',
      features: {
        knowledgeBase: true,
        documentGeneration: true
      }
    }
  })

  // Create sample users
  await prisma.user.create({
    data: {
      email: 'admin@acme.com',
      name: 'Admin User',
      tenantId: tenant.id
    }
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

## 🔧 Tool Development

### Creating a New Tool
```typescript
// packages/tools/src/knowledge-tool.ts
import { Tool } from '@sba/tools'
import { BaseHubClient } from '@sba/basehub'

export class KnowledgeTool implements Tool {
  name = 'knowledge_search'
  description = 'Search knowledge base for information'
  
  schema = z.object({
    query: z.string().min(1),
    limit: z.number().optional().default(10)
  })

  constructor(private basehub: BaseHubClient) {}

  async execute(params: z.infer<typeof this.schema>) {
    const results = await this.basehub.search({
      query: params.query,
      limit: params.limit
    })

    return {
      success: true,
      data: results
    }
  }
}
```

### Tool Registration
```typescript
// apps/api/src/tools/tool-registry.ts
import { KnowledgeTool } from '@sba/tools'

export class ToolRegistry {
  private tools = new Map<string, Tool>()

  constructor() {
    this.registerTools()
  }

  private registerTools() {
    this.tools.set('knowledge_search', new KnowledgeTool())
    this.tools.set('document_generate', new DocumentTool())
    this.tools.set('task_create', new TaskTool())
  }

  getTool(name: string): Tool | undefined {
    return this.tools.get(name)
  }
}
```

## 🎨 UI Component Development

### Atomic Design Components
```typescript
// packages/ui/src/atoms/Button.tsx
import { forwardRef } from 'react'
import { cn } from '@sba/utils'
import { buttonVariants } from './button-variants'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Spinner className="mr-2" />}
        {children}
      </button>
    )
  }
)
```

### Feature Components
```typescript
// features/chat/ui/ChatBubble.tsx
import { cn } from '@sba/utils'
import { Message } from '../model/chat.types'

interface ChatBubbleProps {
  message: Message
  className?: string
}

export function ChatBubble({ message, className }: ChatBubbleProps) {
  const isUser = message.role === 'user'
  
  return (
    <div
      className={cn(
        'flex w-full',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
    >
      <div
        className={cn(
          'max-w-[70%] rounded-lg px-4 py-2',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <time className="text-xs opacity-70">
          {formatTime(message.timestamp)}
        </time>
      </div>
    </div>
  )
}
```

## 🔌 Integration Development

### LLM Integration
```typescript
// apps/api/src/integrations/openai.service.ts
import { Injectable } from '@nestjs/common'
import OpenAI from 'openai'

@Injectable()
export class OpenAIService {
  private openai: OpenAI

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }

  async generateResponse(
    messages: ChatMessage[],
    options?: {
      model?: string
      temperature?: number
      maxTokens?: number
    }
  ): Promise<ChatCompletion> {
    return this.openai.chat.completions.create({
      model: options?.model || 'gpt-4',
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.maxTokens,
      stream: true,
    })
  }
}
```

### BaseHub Integration
```typescript
// packages/tools/src/basehub-client.ts
import { GraphQLClient } from 'graphql-request'

export class BaseHubClient {
  private client: GraphQLClient

  constructor(token: string) {
    this.client = new GraphQLClient('https://api.basehub.com/graphql', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  async searchDocuments(params: SearchParams) {
    const query = `
      query SearchDocuments($query: String!, $limit: Int) {
        documents(
          where: { 
            _search: { query: $query }
          }
          first: $limit
        ) {
          edges {
            node {
              id
              title
              content
              category
              metadata
            }
          }
        }
      }
    `

    return this.client.request(query, params)
  }
}
```

## 📊 Monitoring & Logging

### Application Logging
```typescript
// packages/utils/src/logger.ts
import winston from 'winston'

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: {
    service: 'sba-api',
    environment: process.env.NODE_ENV,
  },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
})
```

### Performance Monitoring
```typescript
// apps/api/src/middleware/metrics.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { performance } from 'perf_hooks'

@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = performance.now()
    
    res.on('finish', () => {
      const duration = performance.now() - start
      
      // Record metrics
      metrics.httpRequestDuration.observe(
        {
          method: req.method,
          route: req.route?.path || req.path,
          status: res.statusCode,
        },
        duration / 1000
      )
    })
    
    next()
  }
}
```

## 🚀 Deployment

### Development Deployment
```bash
# Build all packages
pnpm build

# Start production build locally
pnpm start:prod
```

### Docker Build
```bash
# Build Docker images
docker build -t sba-web:latest -f apps/web/Dockerfile .
docker build -t sba-api:latest -f apps/api/Dockerfile .

# Run with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Production Deployment
```bash
# Deploy to staging
pnpm deploy:staging

# Deploy to production
pnpm deploy:production
```

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>
```

#### Database Connection Issues
```bash
# Check PostgreSQL status
docker-compose logs postgres

# Reset database
pnpm --filter api db:reset
```

#### Build Errors
```bash
# Clear cache
pnpm store prune

# Reinstall dependencies
rm -rf node_modules
pnpm install
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=sba:* pnpm dev

# Debug specific module
DEBUG=sba:api:* pnpm --filter api dev
```

## 📚 Additional Resources

### Documentation
- [Architecture Guide](./docs/architecture.md)
- [API Documentation](./docs/api.md)
- [Component Library](./docs/components.md)
- [Deployment Guide](./docs/deployment.md)

### Tools
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Next.js](https://nextjs.org/docs)
- [NestJS](https://docs.nestjs.com/)
- [Prisma](https://www.prisma.io/docs/)
- [TailwindCSS](https://tailwindcss.com/docs)

### Community
- [Discord Server](https://discord.gg/sba-dev)
- [GitHub Discussions](https://github.com/your-org/sba-monorepo/discussions)
- [Issue Tracker](https://github.com/your-org/sba-monorepo/issues)

---

For additional support, please contact the development team or create an issue in the GitHub repository.

Last updated: January 2025