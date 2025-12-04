# SBA (Smart Business Assistant) - Technical Documentation

## Overview

SBA is a comprehensive business assistant application built with modern web technologies, featuring AI-powered chat capabilities, conversation management, and intelligent business insights.

## Architecture

### Technology Stack

- **Frontend**: Next.js 14 with React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Zustand for client state, TanStack Query for server state
- **AI Integration**: AG-UI client for intelligent responses
- **Backend Services**: Supabase for authentication, database, and real-time features
- **Testing**: Vitest with React Testing Library
- **Build System**: Vite with TypeScript

### Project Structure (FSD - Feature-Sliced Design)

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (dashboard)/       # Dashboard layout and pages
│   │   ├── (auth)/           # Authentication pages
│   │   └── api/              # API routes
│   ├── features/             # Feature modules
│   │   ├── chat/             # Chat functionality
│   │   ├── auth/             # Authentication
│   │   └── dashboard/        # Dashboard features
│   ├── entities/             # Business entities
│   ├── shared/               # Shared utilities and components
│   ├── components/           # Reusable UI components
│   └── widgets/              # Complex UI widgets
├── packages/                 # Shared packages
│   ├── entities/             # Type definitions
│   ├── ui/                   # UI components library
│   ├── services/             # API services
│   ├── auth/                 # Authentication utilities
│   ├── utils/                # Utility functions
│   ├── agui-client/          # AI integration
│   └── supabase/             # Database client
```

## Core Features

### 1. Chat System

**Components:**
- `ChatWindow`: Main chat interface container
- `ChatMessage`: Individual message rendering with tool calls
- `ChatInput`: Message input with file attachments and voice recording
- `ConversationList`: Sidebar conversation management

**Key Features:**
- Real-time message streaming
- Tool call execution and display
- Message editing and deletion
- File attachments and voice input
- Conversation starring and organization

### 2. AI Integration

**AG-UI Client Features:**
- Intelligent response generation
- Tool execution capabilities
- Context-aware conversations
- Multi-turn dialogue support

**Supported Tools:**
- Search functionality
- Data analysis
- Business insights
- Custom tool integration

### 3. Authentication & User Management

**Features:**
- Supabase authentication
- Multi-tenant support
- User profile management
- Session management

### 4. Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile Optimizations:**
- Touch-friendly interfaces
- Optimized keyboard handling
- Collapsible navigation
- Gesture support

## Component Architecture

### Design System

**Color Palette:**
- Primary: Blue gradient (#3b82f6 to #1d4ed8)
- Secondary: Gray scale (zinc)
- Accent: Green for success, Red for errors
- Background: Light/dark mode support

**Typography:**
- Base font: System UI stack
- Sizes: xs, sm, base, lg, xl, 2xl
- Weights: 400, 500, 600, 700

**Spacing:**
- Based on 4px grid system
- Consistent padding and margins
- Responsive spacing utilities

### Component Patterns

**Card Components:**
```typescript
interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}
```

**Button Components:**
```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs';
  asChild?: boolean;
  loading?: boolean;
}
```

**Form Components:**
- Consistent validation patterns
- Accessible form controls
- Error handling and feedback

## API Integration

### Supabase Integration

**Database Schema:**
- `conversations`: Chat conversations
- `messages`: Individual messages
- `users`: User profiles
- `tenants`: Multi-tenant support

**Real-time Features:**
- Live message updates
- Conversation status changes
- User presence indicators

### AG-UI API Integration

**Endpoints:**
- `/api/agui/chat`: Chat message processing
- Tool execution endpoints
- Streaming response support

## State Management

### Zustand Stores

**Chat Store:**
```typescript
interface ChatStore {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  actions: {
    sendMessage: (message: string) => Promise<void>;
    createConversation: (title: string) => Promise<void>;
    selectConversation: (id: string) => void;
  };
}
```

### TanStack Query

**Query Keys:**
- `['conversations']`: Conversation list
- `['messages', conversationId]`: Messages for conversation
- `['user']`: Current user data

## Testing Strategy

### Unit Tests

**Component Tests:**
- Avatar component rendering
- Card component functionality
- Chat message interactions
- Input validation and submission

**Hook Tests:**
- Chat state management
- API integration
- Error handling

### Integration Tests

**Chat Flow Tests:**
- Message sending and receiving
- Conversation management
- Tool call execution
- File upload handling

### Test Configuration

**Vitest Setup:**
- React Testing Library integration
- Mock setup for Next.js router
- Browser API mocking
- Component testing utilities

## Performance Optimization

### Code Splitting

**Route-based Splitting:**
- Dashboard pages
- Authentication flows
- Chat interfaces
- Settings panels

**Component Lazy Loading:**
- Heavy components
- Third-party integrations
- Complex widgets

### Caching Strategy

**TanStack Query Caching:**
- Conversation data caching
- Message history caching
- User profile caching

**Browser Caching:**
- Static asset caching
- Service worker implementation
- Offline support

## Security Considerations

### Authentication

**Supabase Auth:**
- JWT token management
- Session handling
- Password reset flows
- Multi-factor authentication

### Data Protection

**API Security:**
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection

### Privacy

**Data Handling:**
- GDPR compliance
- Data encryption
- User consent management
- Data retention policies

## Deployment

### Build Process

**Development:**
```bash
npm run dev
```

**Production Build:**
```bash
npm run build
npm start
```

**Testing:**
```bash
npm test
npm run test:coverage
```

### Environment Variables

**Required Variables:**
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_AGUI_API_URL=
AGUI_API_KEY=
```

### Hosting

**Vercel Deployment:**
- Automatic deployments
- Environment variable management
- Performance monitoring
- Error tracking

## Monitoring & Analytics

### Error Tracking

**Sentry Integration:**
- Error reporting
- Performance monitoring
- User session tracking
- Release tracking

### Analytics

**User Analytics:**
- Conversation metrics
- Feature usage tracking
- Performance metrics
- User engagement

## Development Guidelines

### Code Style

**TypeScript Guidelines:**
- Strict type checking
- Interface definitions
- Generic type usage
- Error handling patterns

**React Best Practices:**
- Functional components
- Hook patterns
- Performance optimization
- Accessibility standards

### Git Workflow

**Branch Strategy:**
- Main branch protection
- Feature branch workflow
- Pull request reviews
- Automated testing

### Documentation

**Code Documentation:**
- JSDoc comments
- Type definitions
- API documentation
- Component stories

## Troubleshooting

### Common Issues

**Build Errors:**
- TypeScript compilation
- Module resolution
- Environment configuration
- Dependency conflicts

**Runtime Issues:**
- API connection errors
- Authentication failures
- Database connection issues
- Memory leaks

### Debug Tools

**Development Tools:**
- React DevTools
- Redux DevTools
- Network monitoring
- Performance profiling

## Future Enhancements

### Planned Features

**AI Improvements:**
- Better context understanding
- Multi-language support
- Voice recognition
- Image processing

**User Experience:**
- Advanced search
- Conversation templates
- Export functionality
- Mobile app

### Technical Debt

**Refactoring Opportunities:**
- Component optimization
- State management improvements
- API performance
- Testing coverage

## Support & Maintenance

### Update Schedule

**Regular Updates:**
- Security patches
- Dependency updates
- Feature enhancements
- Performance improvements

### Support Channels

**Documentation:**
- Technical docs
- User guides
- API reference
- Troubleshooting guides

**Community:**
- Issue tracking
- Feature requests
- Bug reports
- Discussion forums