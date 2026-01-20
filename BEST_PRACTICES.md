# Stem Synergy - Best Practices Guide

## Code Organization

### Component Structure
```tsx
// ✅ DO: Proper component structure
import { useState } from 'react';
import { logger } from '@/lib/logger';

interface Props {
  title: string;
  onSubmit: (data: string) => void;
}

export function MyComponent({ title, onSubmit }: Props) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);
      logger.info('Starting operation', 'MyComponent');
      await onSubmit('data');
      logger.info('Operation completed', 'MyComponent');
    } catch (error) {
      logger.error('Operation failed', 'MyComponent', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {title}
    </button>
  );
}

// ❌ DON'T: Avoid these patterns
// - Using any types
// - Direct console.log
// - No error handling
// - Unclear prop types
// - Missing loading states
```

### API Requests
```typescript
// ✅ DO: Type-safe API calls
import { api } from '@/lib/api';
import { handleError } from '@/lib/logger';

interface UserResponse {
  id: string;
  name: string;
  email: string;
}

async function getUser(id: string): Promise<UserResponse> {
  try {
    const { data } = await api.get<UserResponse>(`/api/users/${id}`);
    return data;
  } catch (error) {
    throw handleError(error, 'getUser');
  }
}

// ❌ DON'T: Avoid these patterns
// - Untyped API responses
// - Missing error handling
// - No request validation
// - Direct fetch calls
```

### State Management
```typescript
// ✅ DO: Use proper state patterns
interface LoadingState {
  isLoading: boolean;
  error: Error | null;
  data: MyData | null;
}

// ❌ DON'T: Avoid scattered state
// const [loading1, setLoading1] = useState(false);
// const [loading2, setLoading2] = useState(false);
// const [error1, setError1] = useState(null);
```

## Error Handling

### API Errors
```typescript
// ✅ DO: Handle API errors properly
try {
  const { data } = await api.post<Response>('/endpoint', payload);
  // Use data
} catch (error) {
  const appError = handleError(error, 'FeatureName');
  // Handle appError.message, appError.statusCode
}

// ❌ DON'T: Ignore errors
// await api.post('/endpoint', payload);
```

### Component Errors
```typescript
// ✅ DO: Use error boundaries
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary>
  <RiskyComponent />
</ErrorBoundary>

// ❌ DON'T: Don't let errors bubble up uncaught
```

## Performance

### Image Loading
```tsx
// ✅ DO: Use next/image
import Image from 'next/image';

<Image
  src="/blueprint.png"
  alt="Blueprint"
  width={800}
  height={600}
  priority={false}
/>

// ❌ DON'T: Use img tag
// <img src="/blueprint.png" />
```

### Code Splitting
```typescript
// ✅ DO: Use dynamic imports for large components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/heavy-component'),
  { loading: () => <div>Loading...</div> }
);

// ❌ DON'T: Import everything statically
```

### Lazy Loading
```typescript
// ✅ DO: Lazy load non-critical features
const observer = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting) {
    loadFeature();
  }
});

// ❌ DON'T: Load everything upfront
```

## Type Safety

### Generic Types
```typescript
// ✅ DO: Use proper generics
async function fetchData<T>(url: string): Promise<T> {
  const { data } = await api.get<T>(url);
  return data;
}

// Usage
const users = await fetchData<User[]>('/api/users');

// ❌ DON'T: Use any
// async function fetchData(url: string): Promise<any> {
```

### Union Types
```typescript
// ✅ DO: Use union types for variants
type Status = 'idle' | 'loading' | 'success' | 'error';

interface State {
  status: Status;
  data?: DataType;
  error?: Error;
}

// ❌ DON'T: Use boolean flags
// const [isLoading, setIsLoading] = useState(false);
// const [isError, setIsError] = useState(false);
```

## Logging

### When to Log
```typescript
// ✅ DO: Log important events
logger.info('User logged in', 'Auth', { userId: user.id });
logger.warn('API rate limit approaching', 'API');
logger.error('Database connection failed', 'DB', error);

// ❌ DON'T: Log everything
// logger.debug('Variable x is now 5');
```

### Log Levels
```typescript
// Debug - Development only
logger.debug('Entering function', 'ComponentName');

// Info - Important state changes
logger.info('State updated', 'ComponentName', newState);

// Warn - Unexpected but recoverable
logger.warn('Deprecated method used', 'ComponentName');

// Error - Serious issues that need attention
logger.error('Request failed', 'API', error);
```

## Testing

### Unit Tests
```typescript
// ✅ DO: Test pure functions
function calculatePrice(quantity: number, price: number): number {
  return quantity * price;
}

test('calculatePrice should return correct total', () => {
  expect(calculatePrice(2, 10)).toBe(20);
});

// ❌ DON'T: Test everything
```

### Component Tests
```typescript
// ✅ DO: Test user interactions
test('button click triggers callback', async () => {
  const handleClick = jest.fn();
  render(<MyButton onClick={handleClick} />);
  await userEvent.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalled();
});

// ❌ DON'T: Test implementation details
```

## Naming Conventions

### Variables
```typescript
// ✅ DO: Use clear, descriptive names
const userCount = 42;
const isAuthenticated = true;
const selectedCategory = 'technology';

// ❌ DON'T: Use abbreviations or single letters (except loops)
// const uc = 42;
// const auth = true;
// const cat = 'technology';
```

### Functions
```typescript
// ✅ DO: Use verb prefixes
function handleClick() {}
function fetchUsers() {}
function validateEmail(email: string) {}
function calculateTotal(items: Item[]) {}

// ❌ DON'T: Use vague names
// function process() {}
// function getData() {}
// function check(x: any) {}
```

### Constants
```typescript
// ✅ DO: Use UPPER_SNAKE_CASE
const MAX_ITEMS_PER_PAGE = 20;
const API_TIMEOUT_MS = 5000;
const DEFAULT_LANGUAGE = 'en';

// ❌ DON'T: Use lowercase
// const maxItems = 20;
```

## Security

### Sensitive Data
```typescript
// ✅ DO: Never log sensitive data
logger.info('User action', 'Auth', { userId: user.id });

// ❌ DON'T: Log passwords or tokens
// logger.info('Login', 'Auth', { password: pwd, token: token });
```

### Input Validation
```typescript
// ✅ DO: Validate input
import { z } from 'zod';

const EmailSchema = z.string().email();
const validEmail = EmailSchema.parse(email);

// ❌ DON'T: Trust user input
// const email = req.body.email; // Could be anything
```

### Environment Variables
```typescript
// ✅ DO: Use validated config
const config = getEnvConfig();
const apiKey = config.ANTHROPIC_API_KEY;

// ❌ DON'T: Access raw process.env
// const apiKey = process.env.ANTHROPIC_API_KEY;
```

## Comments

### When to Comment
```typescript
// ✅ DO: Comment complex logic
// Calculate tax based on location and item type
const tax = calculateTax(item, userLocation);

// ✅ DO: Document why, not what
// We use setTimeout here because the DOM needs to be flushed
setTimeout(() => {
  updateUI();
}, 0);

// ❌ DON'T: Comment obvious code
// const count = items.length; // Get the length of items
```

## Summary

### Checklist Before Committing
- ✅ No `any` types
- ✅ No `console.log` in production code
- ✅ Error handling on all async operations
- ✅ Type-safe API calls
- ✅ Proper prop typing for components
- ✅ No hardcoded values (use constants)
- ✅ Meaningful variable names
- ✅ No console errors/warnings
- ✅ Uses ErrorBoundary where needed
- ✅ Uses logger for important events

---

**Remember:** Write code for humans first, machines second.
