SBA ChatWindow — UX & A11y Notes

- Landmarks: header `role="banner"` (Conversation header), messages container `role="main"` (`aria-label="Chat messages"`), input wrapper `role="form"` (`aria-label="Chat input"`).
- Live regions: streaming indicators use `role="status"` with `aria-live="polite"`; errors use `role="alert"` with `aria-live="assertive"`.
- List semantics: messages rendered in `ol` with `role="log"`, each item `li role="listitem"`; `aria-relevant="additions text"` and `aria-atomic="false"` for incremental updates.
- Keyboard: `main` supports `ArrowUp/Down`, `Home/End`, `PageUp/PageDown`, and `g` to go latest (`aria-keyshortcuts` documented). `tabIndex={0}` enables focus for shortcuts.
- Auto-scroll: respects `prefers-reduced-motion`; sticky controls show status and offer toggle plus "Go to latest" (`data-testid="go-latest-btn"`).
- Editing: title editing input labeled `aria-label="Edit conversation title"`; user message inline edit labeled `aria-label="Edit your message"` with Enter/Escape handlers.
- Clipboard: share/export use clipboard API; assistant copy button announces "Copied!" with an SR-only `role="status"`.
- Testing: unit tests validate landmarks, live regions, auto-scroll controls, keyboard shortcuts; E2E uses deterministic selectors and waits for landmarks.
