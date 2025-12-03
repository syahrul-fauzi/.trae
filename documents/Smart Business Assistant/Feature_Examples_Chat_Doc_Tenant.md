# Contoh Fitur Kunci — Chat, Document, Tenant

## Chat (FSD)
- model: useChatSession, useStream
- ui: ChatWindow, ChatBubble
- api: ws client ke orchestrator

## Document Generation
- model: useRenderJob
- ui: DocumentEditor, ProgressPanel
- api: POST /tools/renderDocument

## Tenant
- model: useTenantSwitcher, useTenantConfig
- ui: TenantSwitcher
- api: GET /tenant/config
