# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.4.x   | ✅ Active |
| < 1.4   | ❌ Not supported |

## Reporting a Vulnerability

If you discover a security issue, please **do not** open a public issue.

Instead, email: `bowufeng199@gmail.com`

You will receive an acknowledgement within 48 hours.

## Scope

This project runs **100% client-side in the browser**. No server-side code is involved. The potential attack surface is limited to:

- Malicious PDF/image files that exploit pdfjs-dist or Tesseract.js
- Third-party CDN dependencies (loaded via preconnect)
- localStorage-based session persistence

See [PRIVACY.md](./PRIVACY.md) for data handling details.
