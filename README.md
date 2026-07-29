# Prime Capital Admin Portal

Enterprise KYC compliance dashboard for Prime Capital Investment Bank.

## Quick Start

```bash
npm install
npm run dev
```

Runs on **http://localhost:3001**

Requires the backend API at **https://dev-api.primecapitalsc.com**.

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `https://dev-api.primecapitalsc.com` | Backend API base URL |

## Pages

- **Dashboard** — Metrics overview and recent applications
- **Applications** — Searchable, filterable KYC list
- **Application Review** — 15-section detail view with document preview and approval controls
- **Settings & Audit** — Compliance audit trail
