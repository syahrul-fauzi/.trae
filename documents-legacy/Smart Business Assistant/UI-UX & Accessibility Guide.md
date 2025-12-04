UI & UX Accessibility Guide for SBA Chat

Overview
- Establishes consistent landmarks: `role="banner"` for header, `role="main"` for chat messages, `role="form"` for input.
- Implements live regions for streaming and status: "Thinking...", "Assistant is typing...", and recording indicator, using `role="status"` and `aria-live="polite"`.
- Ensures keyboard-first operation with discoverable shortcuts and focus management.

Keyboard Shortcuts
- Chat messages container (`role="main"`): `ArrowUp`/`ArrowDown` scroll by row, `Home`/`End` jump to top/bottom, `PageUp`/`PageDown` scroll by viewport, `g` go to latest and enable auto-scroll.
- Input textarea: `Enter` to send, `Shift+Enter` new line, `Ctrl+Shift+U` open file picker, `Ctrl+Shift+R` toggle recording, `Escape` clear message.
- Message editing: `Enter` save, `Escape` cancel and restore content.

Auto-Scroll Behavior
- When scrolled away from bottom, shows a sticky "Go to latest" button (`aria-label="Go to latest"`). Clicking re-enables auto-scroll and scrolls to bottom.
- Respects reduced motion via `prefers-reduced-motion`; uses smooth scroll only when appropriate.

Accessible Labels & Semantics
- Search inputs labeled "Search conversations" across sidebar and mobile header.
- Header actions include labeled buttons: "Star conversation", "Share conversation", "Export conversation", and menu trigger "Open conversation menu".
- Conversation actions menu items are labeled and expose `data-testid` for testing: rename and delete actions.
- Overlay elements use `role="presentation"` and `aria-hidden="true"` to avoid noise in accessibility tree.

Chat Message Accessibility
- Each message is focusable and exposes actions on `:hover` and `:focus-within` for keyboard users.
- Streaming messages are marked with live region; copy action provides audible confirmation via hidden status text.

Testing & Verification
- Unit tests validate landmarks, live regions, keyboard shortcuts, auto-scroll toggle, and interaction flows.
- Vitest configuration tuned for stability in CI with `pool: 'forks'` and increased memory.
- Chat component test coverage: input, window behaviors, message actions, and hook state transitions.

Integration Notes
- `useChat` integrates with `/api/agui/chat` for agent replies with a fallback path when unavailable; streaming state and query invalidation ensure UI reflects activity.

References
- ChatWindow: `apps/web/src/features/chat/components/ChatWindow.tsx`
- ChatInput: `apps/web/src/features/chat/components/ChatInput.tsx`
- ChatMessage: `apps/web/src/features/chat/components/ChatMessage.tsx`
- Hook: `apps/web/src/features/chat/hooks/useChat.ts`
- Tests: `apps/web/src/features/chat/components/__tests__/*`, `apps/web/src/features/chat/hooks/__tests__/useChat.test.ts`
