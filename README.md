# Korvai's Made Easy — Static PWA

Offline-first Progressive Web Application for computing Carnatic multi-nadai rhythmic compositions (*Korvais*) using the `basic` and `difference_basic` kernel method.

## Local Development & Testing

Run a static HTTP server from this directory:

```bash
python3 -m http.server 8090
```

- **Main Calculator App**: `http://localhost:8090/index.html`
- **Browser Unit Test Suite**: `http://localhost:8090/test.html`
- **Shareable URL Example**: `http://localhost:8090/index.html?nadai=4-66-888&thalam=32&eduppu=4`

## Deploying to Vercel

```bash
vercel
```
