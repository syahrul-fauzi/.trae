# Technical Specification - SBA API

## 📋 Overview

Dokumen ini berisi spesifikasi teknis lengkap untuk API Smart Business Assistant (SBA), termasuk endpoint definitions, request/response schemas, authentication mechanisms, dan integration patterns.

## 🔗 API Architecture

### Base URL
```
Production: https://api.sba.app/v1
Staging: https://staging-api.sba.app/v1
Development: http://localhost:3001/api/v1
```

### Authentication
All API requests require authentication using Bearer token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Content Type
All requests and responses use JSON format:
```
Content-Type: application/json
```

## 📡 API Endpoints

### 1. Authentication

#### POST /auth/login
Login dengan email dan password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user",
      "tenantId": "tenant-456"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": 3600
    }
  }
}
```

#### POST /auth/refresh
Refresh access token.

**Request:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600
  }
}
```

### 2. Chat & Conversations

#### POST /conversations
Create new conversation.

**Request:**
```json
{
  "title": "Product Inquiry",
  "metadata": {
    "source": "web",
    "campaign": "summer2024"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conv-789",
      "title": "Product Inquiry",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "metadata": {
        "source": "web",
        "campaign": "summer2024"
      }
    }
  }
}
```

#### GET /conversations
List conversations for current user.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `status` (optional): Filter by status (active, paused, completed)
- `search` (optional): Search in title

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "conv-789",
        "title": "Product Inquiry",
        "status": "active",
        "lastMessage": "Can you help me with...",
        "messageCount": 15,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-15T11:45:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "pages": 3
    }
  }
}
```

#### GET /conversations/{id}
Get conversation details.

**Response:**
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conv-789",
      "title": "Product Inquiry",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T11:45:00Z",
      "messages": [
        {
          "id": "msg-001",
          "role": "user",
          "content": "Hello, I need help with my order",
          "timestamp": "2024-01-15T10:30:00Z",
          "metadata": {
            "source": "web"
          }
        },
        {
          "id": "msg-002",
          "role": "assistant",
          "content": "I'd be happy to help you with your order. Could you please provide your order number?",
          "timestamp": "2024-01-15T10:30:01Z",
          "metadata": {
            "model": "gpt-4",
            "tokens": 25
          }
        }
      ]
    }
  }
}
```

#### POST /conversations/{id}/messages
Send message to conversation.

**Request:**
```json
{
  "content": "My order number is #12345",
  "metadata": {
    "source": "web",
    "userAgent": "Mozilla/5.0..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "msg-003",
      "role": "user",
      "content": "My order number is #12345",
      "timestamp": "2024-01-15T10:31:00Z",
      "metadata": {
        "source": "web",
        "userAgent": "Mozilla/5.0..."
      }
    },
    "reply": {
      "id": "msg-004",
      "role": "assistant",
      "content": "Thank you for providing your order number. I can see that order #12345 was placed on January 10th and is currently being processed...",
      "timestamp": "2024-01-15T10:31:01Z",
      "metadata": {
        "model": "gpt-4",
        "tokens": 150,
        "toolsUsed": ["order_lookup"]
      }
    }
  }
}
```

### 3. Knowledge Base

#### GET /knowledge/search
Search knowledge base.

**Query Parameters:**
- `q` (required): Search query
- `category` (optional): Filter by category
- `limit` (optional): Max results (default: 10, max: 50)
- `locale` (optional): Language locale (default: en)

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "doc-123",
        "title": "How to track your order",
        "content": "You can track your order by visiting the order status page...",
        "category": "shipping",
        "score": 0.95,
        "metadata": {
          "author": "support-team",
          "lastUpdated": "2024-01-10T09:00:00Z",
          "tags": ["order", "tracking", "shipping"]
        }
      },
      {
        "id": "doc-456",
        "title": "Shipping policies",
        "content": "All orders are shipped within 2-3 business days...",
        "category": "policies",
        "score": 0.82,
        "metadata": {
          "author": "policy-team",
          "lastUpdated": "2024-01-05T14:30:00Z",
          "tags": ["shipping", "policy"]
        }
      }
    ],
    "total": 2,
    "query": "track order",
    "took": 45
  }
}
```

#### GET /knowledge/documents/{id}
Get document details.

**Response:**
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "doc-123",
      "title": "How to track your order",
      "content": "You can track your order by visiting the order status page and entering your order number...",
      "category": "shipping",
      "version": 2,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-10T09:00:00Z",
      "metadata": {
        "author": "support-team",
        "reviewer": "manager-1",
        "tags": ["order", "tracking", "shipping"],
        "attachments": [
          {
            "name": "tracking-screenshot.png",
            "url": "https://cdn.example.com/tracking-screenshot.png",
            "type": "image/png"
          }
        ]
      }
    }
  }
}
```

### 4. Documents

#### POST /documents/generate
Generate document from template.

**Request:**
```json
{
  "templateId": "template-invoice",
  "data": {
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "address": "123 Main St, City, State 12345"
    },
    "items": [
      {
        "description": "Product A",
        "quantity": 2,
        "price": 50.00,
        "total": 100.00
      }
    ],
    "total": 100.00,
    "tax": 8.00,
    "grandTotal": 108.00
  },
  "format": "pdf",
  "options": {
    "includeLogo": true,
    "watermark": "DRAFT"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "jobId": "job-789",
    "status": "processing",
    "estimatedTime": 30,
    "template": {
      "id": "template-invoice",
      "name": "Invoice Template",
      "version": 1
    },
    "metadata": {
      "createdBy": "user-123",
      "createdAt": "2024-01-15T10:35:00Z"
    }
  }
}
```

#### GET /documents/jobs/{jobId}
Check document generation status.

**Response:**
```json
{
  "success": true,
  "data": {
    "job": {
      "id": "job-789",
      "status": "completed",
      "progress": 100,
      "result": {
        "documentId": "doc-generated-123",
        "url": "https://cdn.example.com/documents/invoice-123.pdf",
        "expiresAt": "2024-01-22T10:35:00Z",
        "size": 245760,
        "checksum": "sha256:abc123..."
      },
      "startedAt": "2024-01-15T10:35:00Z",
      "completedAt": "2024-01-15T10:35:25Z",
      "metadata": {
        "templateId": "template-invoice",
        "format": "pdf",
        "pages": 2
      }
    }
  }
}
```

#### GET /documents/templates
List available templates.

**Response:**
```json
{
  "success": true,
  "data": {
    "templates": [
      {
        "id": "template-invoice",
        "name": "Invoice Template",
        "description": "Professional invoice template with company branding",
        "category": "finance",
        "formats": ["pdf", "docx"],
        "fields": [
          {
            "name": "customer.name",
            "type": "string",
            "required": true,
            "description": "Customer name"
          },
          {
            "name": "items",
            "type": "array",
            "required": true,
            "description": "List of invoice items"
          }
        ],
        "previewUrl": "https://cdn.example.com/templates/invoice-preview.png",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-10T12:00:00Z"
      }
    ]
  }
}
```

### 5. Workflows

#### POST /workflows
Create new workflow.

**Request:**
```json
{
  "name": "Employee Onboarding",
  "description": "Automated onboarding process for new employees",
  "trigger": {
    "type": "manual",
    "config": {}
  },
  "steps": [
    {
      "id": "step-1",
      "name": "Send welcome email",
      "type": "email",
      "config": {
        "template": "welcome-email",
        "recipient": "{{employee.email}}"
      }
    },
    {
      "id": "step-2",
      "name": "Create accounts",
      "type": "api",
      "config": {
        "endpoint": "https://hr-system.example.com/api/employees",
        "method": "POST",
        "payload": {
          "name": "{{employee.name}}",
          "email": "{{employee.email}}",
          "department": "{{employee.department}}"
        }
      }
    }
  ],
  "metadata": {
    "category": "hr",
    "department": "all"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "workflow": {
      "id": "wf-456",
      "name": "Employee Onboarding",
      "version": 1,
      "status": "active",
      "createdAt": "2024-01-15T10:40:00Z",
      "createdBy": "user-123"
    }
  }
}
```

#### POST /workflows/{id}/execute
Execute workflow.

**Request:**
```json
{
  "input": {
    "employee": {
      "name": "Jane Smith",
      "email": "jane.smith@example.com",
      "department": "engineering"
    }
  },
  "metadata": {
    "requestedBy": "manager-789",
    "priority": "high"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "execution": {
      "id": "exec-123",
      "workflowId": "wf-456",
      "status": "running",
      "progress": 0,
      "startedAt": "2024-01-15T10:41:00Z",
      "estimatedDuration": 300
    }
  }
}
```

### 6. Tenant Management

#### GET /tenant
Get current tenant information.

**Response:**
```json
{
  "success": true,
  "data": {
    "tenant": {
      "id": "tenant-123",
      "name": "Acme Corporation",
      "plan": "pro",
      "status": "active",
      "features": {
        "knowledgeBase": true,
        "documentGeneration": true,
        "workflowAutomation": true,
        "analytics": true,
        "apiAccess": true
      },
      "limits": {
        "conversationsPerMonth": 10000,
        "documentsPerMonth": 1000,
        "workflowsPerMonth": 500,
        "storageGB": 100,
        "apiCallsPerMonth": 50000
      },
      "usage": {
        "conversationsThisMonth": 3456,
        "documentsThisMonth": 234,
        "workflowsThisMonth": 89,
        "storageUsedGB": 45.2,
        "apiCallsThisMonth": 12345
      },
      "billing": {
        "cycle": "monthly",
        "nextBillingDate": "2024-02-01T00:00:00Z",
        "status": "active"
      },
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-15T08:30:00Z"
    }
  }
}
```

#### PUT /tenant/settings
Update tenant settings.

**Request:**
```json
{
  "settings": {
    "chat": {
      "welcomeMessage": "Welcome to Acme Corp support!",
      "businessHours": {
        "enabled": true,
        "timezone": "America/New_York",
        "schedule": [
          {
            "day": "monday",
            "start": "09:00",
            "end": "17:00"
          }
        ]
      }
    },
    "branding": {
      "primaryColor": "#2563eb",
      "logoUrl": "https://cdn.example.com/acme-logo.png",
      "faviconUrl": "https://cdn.example.com/acme-favicon.ico"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "settings": {
      "chat": {
        "welcomeMessage": "Welcome to Acme Corp support!",
        "businessHours": {
          "enabled": true,
          "timezone": "America/New_York",
          "schedule": [
            {
              "day": "monday",
              "start": "09:00",
              "end": "17:00"
            }
          ]
        }
      },
      "branding": {
        "primaryColor": "#2563eb",
        "logoUrl": "https://cdn.example.com/acme-logo.png",
        "faviconUrl": "https://cdn.example.com/acme-favicon.ico"
      }
    }
  }
}
```

## 🔄 WebSocket Events

### Connection
Connect to WebSocket for real-time updates:
```javascript
const ws = new WebSocket('wss://api.sba.app/ws');

ws.onopen = () => {
  // Authenticate
  ws.send(JSON.stringify({
    type: 'auth',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  }));
};
```

### Events

#### conversation.message
New message in conversation.
```json
{
  "type": "conversation.message",
  "data": {
    "conversationId": "conv-789",
    "message": {
      "id": "msg-005",
      "role": "assistant",
      "content": "I'll help you track your order",
      "timestamp": "2024-01-15T10:45:00Z"
    }
  }
}
```

#### conversation.typing
Typing indicator.
```json
{
  "type": "conversation.typing",
  "data": {
    "conversationId": "conv-789",
    "userId": "assistant-123",
    "isTyping": true
  }
}
```

#### document.job.update
Document generation progress.
```json
{
  "type": "document.job.update",
  "data": {
    "jobId": "job-789",
    "status": "processing",
    "progress": 75,
    "message": "Rendering page 2 of 3"
  }
}
```

#### workflow.execution.update
Workflow execution status.
```json
{
  "type": "workflow.execution.update",
  "data": {
    "executionId": "exec-123",
    "workflowId": "wf-456",
    "status": "running",
    "currentStep": "step-2",
    "progress": 50
  }
}
```

## 📊 Rate Limiting

API implements rate limiting per tenant:

| Endpoint | Limit | Window |
|----------|-------|----------|
| Authentication | 10 requests | 1 minute |
| Chat messages | 100 requests | 1 minute |
| Knowledge search | 200 requests | 1 minute |
| Document generation | 10 requests | 1 minute |
| Workflow execution | 50 requests | 1 minute |
| General API | 1000 requests | 1 minute |

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642262400
```

## 🚨 Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "requestId": "req-123456"
}
```

### Error Codes
| Code | Description | HTTP Status |
|------|-------------|-------------|
| `VALIDATION_ERROR` | Request validation failed | 400 |
| `UNAUTHORIZED` | Authentication required | 401 |
| `FORBIDDEN` | Insufficient permissions | 403 |
| `NOT_FOUND` | Resource not found | 404 |
| `RATE_LIMITED` | Rate limit exceeded | 429 |
| `INTERNAL_ERROR` | Server error | 500 |
| `SERVICE_UNAVAILABLE` | Service temporarily unavailable | 503 |
| `QUOTA_EXCEEDED` | Tenant quota exceeded | 402 |

### Error Handling Best Practices
1. Always include `requestId` for debugging
2. Provide specific field errors in `details`
3. Use appropriate HTTP status codes
4. Include helpful error messages
5. Log errors with context

## 🧪 Testing

### Test Environment
```
Base URL: https://sandbox-api.sba.app/v1
```

### Test Credentials
```json
{
  "testUser": {
    "email": "test@example.com",
    "password": "testpassword123",
    "tenantId": "test-tenant"
  }
}
```

### Load Testing
- Concurrent connections: 1000
- Requests per second: 500
- Response time p95: < 500ms
- Error rate: < 0.1%

## 📚 SDK & Tools

### Official SDKs
- **JavaScript/TypeScript**: `@sba/sdk`
- **Python**: `sba-python`
- **Go**: `sba-go`
- **PHP**: `sba-php`

### Postman Collection
Download Postman collection: `https://api.sba.app/postman-collection.json`

### OpenAPI Specification
Download OpenAPI spec: `https://api.sba.app/openapi.json`

## 🔧 Integration Examples

### JavaScript/TypeScript
```typescript
import { SBAClient } from '@sba/sdk';

const client = new SBAClient({
  baseURL: 'https://api.sba.app/v1',
  token: 'your-jwt-token'
});

// Send message
const response = await client.chat.sendMessage({
  conversationId: 'conv-789',
  content: 'Hello, I need help'
});

console.log(response.data.reply);
```

### Python
```python
import requests

headers = {
    'Authorization': 'Bearer your-jwt-token',
    'Content-Type': 'application/json'
}

# Send message
response = requests.post(
    'https://api.sba.app/v1/conversations/conv-789/messages',
    headers=headers,
    json={'content': 'Hello, I need help'}
)

data = response.json()
print(data['data']['reply']['content'])
```

### cURL
```bash
# Send message
curl -X POST 'https://api.sba.app/v1/conversations/conv-789/messages' \
  -H 'Authorization: Bearer your-jwt-token' \
  -H 'Content-Type: application/json' \
  -d '{
    "content": "Hello, I need help"
  }'
```

## 📋 Changelog

### Version 1.0.0 (2024-01-15)
- Initial API release
- Chat and conversation management
- Knowledge base search
- Document generation
- Workflow automation
- Multi-tenant support

### Version 1.1.0 (Planned)
- Advanced analytics endpoints
- Bulk operations
- Webhook support
- Advanced filtering
- Export functionality

---

For support and questions, please contact: api-support@sba.app

Last updated: January 15, 2024