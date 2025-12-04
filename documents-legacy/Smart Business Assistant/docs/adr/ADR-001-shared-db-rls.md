# ADR-001 — Shared DB + RLS untuk MVP

Keputusan: gunakan Postgres shared dengan RLS untuk isolasi tenant.
Alasan: cepat, biaya rendah, cukup aman dengan RLS + audit.
Konsekuensi: rencana migrasi ke schema/instance per tenant untuk enterprise.
