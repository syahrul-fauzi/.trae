# SBA (Smart Business Assistant) - Technical Documentation

## Overview

The Smart Business Assistant (SBA) is a comprehensive AI-powered business automation platform built with modern web technologies. This document provides technical guidance for developers working on the SBA project.

## Architecture

### Technology Stack

**Frontend:**
- React 18 with TypeScript
- Next.js 14 (App Router)
- Tailwind CSS for styling
- Zustand for state management
- TanStack Query for data fetching
- AG-UI for AI agent integration

**Backend:**
- Node.js with Express
- Supabase for database and authentication
- PostgreSQL database
- Real-time subscriptions via WebSocket

**Development Tools:**
- Vitest for testing
- ESLint for code linting
- TypeScript for type safety
- Turbo for monorepo management

### Project Structure

The project follows Feature-Sliced Design (FSD) architecture:

```
apps/
├── web/                    # Next.js frontend application
├── api/                    # Express backend API
└── docs/                   # Documentation and shared packages

packages/
├── ui/                     # Shared UI components
├── entities/               # Domain entities and types
└── services/              # Shared services and utilities
```

### Key Features

1. **AI-Powered Chat Interface**
   - Real-time conversation with AI agents
   - Tool execution capabilities
   - Message streaming and history

2. **Agent Management**
   - Create and configure AI agents
   - Monitor agent performance
   - Agent analytics and insights

3. **Task Management**
   - Create and track business tasks
   - Automated task processing
   - Task status monitoring

4. **User Authentication**
   - Secure user registration and login
   - Session management
   - Role-based access control

5. **Real-time Features**
   - Live chat updates
   - Notification system
   - Real-time agent status

## Development Setup

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sba-agentic
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run development server:
```bash
npm run dev
```

### Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend (.env):**
```
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=your_database_url
```

## Component Architecture

### UI Components

The project uses a component-based architecture with atomic design principles:

- **Atoms**: Basic UI elements (Button, Input, Card, etc.)
- **Molecules**: Combinations of atoms (SearchBar, FormField, etc.)
- **Organisms**: Complex components (Header, Sidebar, ChatWindow, etc.)
- **Templates**: Page layouts (DashboardLayout, etc.)

### State Management

- **Zustand**: Global state management for chat, user, and UI state
- **TanStack Query**: Server state management for data fetching and caching
- **React Context**: Component-specific state when appropriate

### API Integration

The project uses a layered API architecture:

1. **API Client**: Centralized HTTP client with authentication
2. **Services**: Business logic and data transformation
3. **Hooks**: React hooks for data access and mutations

## Testing Strategy

### Unit Testing

- **Framework**: Vitest with React Testing Library
- **Coverage**: Component and utility function testing
- **Mocking**: API calls and external dependencies

### Integration Testing

- **API Testing**: Backend endpoint testing
- **Database Testing**: Data layer testing with test database
- **E2E Testing**: User journey testing (planned)

### Test Structure

```
src/
├── components/
│   └── __tests__/         # Component tests
├── features/
│   └── __tests__/         # Feature tests
└── shared/
    └── __tests__/         # Shared utility tests
```

## Deployment

### Build Process

1. **Frontend Build**:
```bash
cd apps/web
npm run build
```

2. **Backend Build**:
```bash
cd apps/api
npm run build
```

### Deployment Options

1. **Vercel**: Recommended for frontend deployment
2. **Railway/Render**: For backend API deployment
3. **Docker**: Containerized deployment support

### Database Migrations

```bash
# Run migrations
npm run db:migrate

# Generate new migration
npm run db:generate <migration-name>
```

## Performance Optimization

### Frontend Optimization

- **Code Splitting**: Dynamic imports for route-based splitting
- **Image Optimization**: Next.js Image component for automatic optimization
- **Bundle Analysis**: Webpack Bundle Analyzer for size monitoring
- **Caching**: TanStack Query for intelligent data caching

### Backend Optimization

- **Database Indexing**: Optimized queries with proper indexing
- **Connection Pooling**: Efficient database connection management
- **Rate Limiting**: API protection against abuse
- **Caching**: Redis integration for high-performance caching

## Security Considerations

### Authentication

- **JWT Tokens**: Secure token-based authentication
- **Session Management**: Secure session handling
- **Password Security**: Bcrypt hashing with salt rounds

### Data Protection

- **Input Validation**: Comprehensive input sanitization
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing
- **HTTPS Enforcement**: SSL/TLS encryption

### Privacy

- **Data Encryption**: Sensitive data encryption at rest
- **GDPR Compliance**: User data protection and privacy controls
- **Audit Logging**: Comprehensive activity logging

## Monitoring and Analytics

### Application Monitoring

- **Error Tracking**: Sentry integration for error monitoring
- **Performance Monitoring**: Application performance tracking
- **User Analytics**: User behavior and engagement tracking

### Health Checks

- **Database Health**: Regular database connectivity checks
- **API Health**: Endpoint availability monitoring
- **Real-time Status**: System status dashboard

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify environment variables
   - Clear node_modules and reinstall

2. **Database Connection Issues**
   - Verify database URL configuration
   - Check network connectivity
   - Ensure proper database permissions

3. **Authentication Problems**
   - Verify Supabase configuration
   - Check JWT token validity
   - Ensure proper CORS settings

### Debug Mode

Enable debug logging:
```bash
DEBUG=sba:* npm run dev
```

### Support

For technical support, please refer to:
- GitHub Issues: Report bugs and feature requests
- Documentation: Comprehensive guides and examples
- Community: Developer community forums

## Contributing

### Code Style

- **ESLint**: Follow configured linting rules
- **Prettier**: Use automatic code formatting
- **TypeScript**: Maintain strict type safety
- **Conventional Commits**: Use semantic commit messages

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request with detailed description

### Code Review

- All code must be reviewed before merging
- Tests must pass for all changes
- Documentation must be updated for new features

## License

This project is licensed under the MIT License. See LICENSE file for details.