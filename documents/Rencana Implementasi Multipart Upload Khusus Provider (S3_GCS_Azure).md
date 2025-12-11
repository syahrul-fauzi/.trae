## Goals & Scope
- Implement robust multipart/resumable upload for AWS S3, Google Cloud Storage (GCS), and Azure Blob.
- Maintain backward compatibility for single-part uploads.
- Persist full upload metadata (`storage_url`, size, mime, checksums, timestamps) transaction-safely.
- Expand tests (unit, integration/E2E, performance, negative cases) and documentation.

## Backend Architecture
- Create `UploadProvider` interface with methods:
  - `init(params): InitResponse` (returns session/uploadId and either parts or a resumable URL)
  - `getPartUrl(params): { url, headers? }` for S3/Azure; for GCS return `resumableUrl`
  - `complete(params): { storageUrl }` (finalize & produce canonical URL)
  - `abort(params): { ok: true }`
- Implement provider handlers:
  - **S3MultipartProvider**
    - `CreateMultipartUpload` → returns `UploadId` and planned `partSize`/parts count
    - Presign `UploadPart` URLs (SigV4) with TTL; collect `ETag`s from client; `CompleteMultipartUpload`
    - Retry policy: exponential backoff on 5xx/timeout; idempotency with `partNumber`
    - Chunking: 5MB min; recommend 8–16MB depending on size
  - **GCSResumableProvider**
    - `createResumableUpload` → returns `resumableUrl`
    - Client uploads chunks with `Content-Range`; server can optionally refresh session URL
    - Completion inferred by final `PUT` with full range; server verifies object and returns `storageUrl`
    - Retry policy: resume with `Range` queries; handle 308 Resume Incomplete
    - Chunking: multiples of 256KB (optimal 8MB)
  - **AzureBlockBlobProvider**
    - Use `BlockBlobClient` → `stageBlock(blockId, data)` presigned or SAS per block; `commitBlockList`
    - `blockId` base64-encoded, sequential; collect server responses as commit list
    - Retry policy: backoff with idempotent `stageBlock`; re-commit on transient failures
    - Chunking: 4–8MB blocks typical; max block count considered
- Orchestrator service (`StorageUploadService`) selects provider based on request and delegates.
- Controller remains: `POST /api/storage/init`, `GET /api/storage/part`, `POST /api/storage/complete`, `POST /api/storage/abort`.

## Upload Persistence
- Define `UploadRecord` model: `{ id, provider, bucket, key, storage_url, size, mime, checksum?, parts, status, initiated_at, completed_at?, expires_at? }`.
- Transaction-safe persistence flow:
  - On `init`: create record with `status='initiated'`, timestamps.
  - On each part (optional): append part metadata (number, etag, size) in durable store.
  - On `complete`: finalize provider, set `status='completed'`, `storage_url`, `completed_at`, calculate `expires_at` for signed policies.
  - On `abort`: mark `status='aborted'`.
- For chat attachments: update message repository to store attachment `{ id, name, mimeType, size, url: storage_url }` consistently (standardize on `storage_url`).
- Use transactions (Prisma or Supabase RPC) to ensure atomicity for completion + repository write.

## SDK Integration & Config
- Add official SDKs in API:
  - AWS: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`
  - GCS: `@google-cloud/storage`
  - Azure: `@azure/storage-blob`
- Config management:
  - Centralize credentials/env: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_PUBLIC_DOMAIN?`; `GCP_SERVICE_ACCOUNT_JSON`; `AZURE_ACCOUNT_NAME`, `AZURE_ACCESS_KEY`, `AZURE_CONTAINER`.
  - Validate presence at startup; provide compatibility checks and version pinning.
  - Security: never log secrets; presigned TTL reasonable; validate content-type/size against policy.

## Frontend Adjustments
- Strategy abstraction in `ChunkedUploader`:
  - **S3/Azure**: current per-part presigned PUT flow retained; capture `ETag` and call `/complete` with part list.
  - **GCS**: single `resumableUrl` returned; uploader uses `PUT` with `Content-Range` in chunks; upon finalization calls `/complete` without part list but with final object info.
- Use `DEFAULT_STORAGE_CONFIG` for size/type validation; support pause/resume/abort and retries.

## Testing Plan
- Unit tests (backend):
  - Mock SDKs for each provider: init → part URL/signing → complete/abort.
  - Edge cases: network errors, quota exceeded, invalid credentials, expired presign.
- Integration/E2E:
  - Local/mock servers to simulate provider responses.
  - End-to-end: UI → API → provider mock → persistence → message attachment updated with `storage_url`.
- Performance benchmarks:
  - Measure upload throughput with varying chunk sizes; concurrency control; record latencies.
- Negative cases:
  - Simulate network drops mid-upload; ensure resume/backoff; abort correctness.
- Coverage goal ≥ 80% across new modules; include HTML/PDF/coverage export in CI reports.

## Documentation
- Provider-specific guides:
  - S3 multipart: API calls, chunk sizing, ETag handling.
  - GCS resumable: `Content-Range`, 308 handling, resume strategies.
  - Azure block blobs: block staging, commit list, block size limits.
- Code examples: init/part/complete for each provider.
- Troubleshooting: common errors (expired URL, 403, quota, network), mitigation steps.

## Security & Compliance
- Validate MIME/size vs config; sanitize filenames to safe keys.
- Limit presigned TTL; scope credentials to minimum needed.
- Audit logging without sensitive data; track requestId and timestamps.
- Rate limiting on upload endpoints; per-tenant isolation.

## Backward Compatibility
- Single-part uploads: if `size <= threshold` or `multipartDisabled`, return single presigned PUT URL and accept `/complete` without parts.

## Implementation Steps
1. Add `UploadProvider` interface and provider classes (S3/GCS/Azure).
2. Refactor `StorageUploadService` to delegate to providers; normalize responses.
3. Implement persistence model and transactions on init/complete/abort.
4. Extend `ChunkedUploader` with provider strategies (S3/Azure per-part, GCS resumable).
5. Write unit tests per provider; mock SDKs.
6. Add E2E flow and performance scripts; integrate with CI reports.
7. Document provider details and troubleshooting.

## Acceptance Criteria
- Multipart upload succeeds across providers; `storage_url` persisted and used in attachments.
- Resume and abort flows behave correctly.
- Coverage ≥80% for new modules; CI reports published.
- Docs complete with examples and guides.

Konfirmasi rencana ini. Setelah disetujui, saya akan mengintegrasikan SDK, menulis handler per provider, menerapkan persistence, memperbarui uploader FE, menambah suite pengujian komprehensif, dan melengkapi dokumentasi.