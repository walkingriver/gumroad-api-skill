---
name: gumroad-api
description: >-
  Integrates with the Gumroad REST API v2 (OAuth 2.0, products, sales, licenses,
  subscribers, offer codes, payouts, webhooks). Use when building or debugging
  Gumroad API calls, scripts, or webhooks; when the user mentions Gumroad API,
  api.gumroad.com, license verification, or creator storefront automation.
---

# Gumroad REST API (v2)

## Canonical URLs

- **REST base:** `https://api.gumroad.com` (same API is also reachable via `https://gumroad.com/api` for backward compatibility).
- **API version:** `v2` — all routes are under `/v2/...`.
- **Human docs:** [gumroad.com/api](https://gumroad.com/api). For a full page index, see [llms.txt](https://mintlify.com/antiwork/gumroad/llms.txt) and [reference.md](reference.md).

## Authentication

Gumroad uses **OAuth 2.0** (Doorkeeper). Obtain **Client ID** and **Client Secret** at [Application settings](https://gumroad.com/settings/applications).

**Token endpoint:** `POST https://gumroad.com/oauth/token`

Supported grant types include **authorization code** (preferred for third-party apps), **password** (trusted first-party only), **client credentials**, and **refresh_token**.

**Calling the API:** Send the access token on every request:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Alternative (less preferred — token may appear in logs):

```http
GET https://api.gumroad.com/v2/user?access_token=YOUR_ACCESS_TOKEN
```

**Token behavior:** Responses may include `"expires_in": null` (tokens treated as non-expiring today, but refresh tokens exist for future use).

**Test auth:** `GET https://api.gumroad.com/v2/user` — expect `success: true` and a `user` object.

### Scopes (request only what you need)

| Scope | Purpose |
|-------|---------|
| `view_public` | Basic / public profile (default-style access) |
| `view_profile` | Detailed profile |
| `edit_products` | Create/update/delete products |
| `view_sales` | Sales data, customers; required for **resource subscriptions (webhooks)** |
| `view_payouts` | Payout history |
| `mark_sales_as_shipped` | Physical orders — shipped + tracking |
| `refund_sales` | Refunds |
| `edit_sales` | Resend receipts and other sale edits |
| Revenue-share related scopes | As named in OAuth registration |

Reserved for internal use (not for public apps): `mobile_api`, `creator_api`, `unfurl`, `helper_api`.

**Authorize URL (authorization code flow):**

```text
https://gumroad.com/oauth/authorize?client_id=...&redirect_uri=...&response_type=code&scope=SPACE_SEPARATED_SCOPES&state=...
```

Exchange `code` at `POST /oauth/token` with `grant_type=authorization_code` and matching `redirect_uri`.

## Response shape

JSON responses typically include `"success": true|false`. **Always check `success` in the body**, not only HTTP status — some failures may still return `200` with `success: false`.

Common HTTP codes: `200`, `400`, `401`, `403`, `404`, `422`, `429`, `500`. Rate limiting returns **429**; back off exponentially and prefer webhooks over tight polling.

## Endpoint map (high level)

**User:** `GET /v2/user`

**Products:** `GET/POST /v2/products`, `GET/PUT/DELETE /v2/products/:id`, `PUT /v2/products/:id/enable`, `PUT /v2/products/:id/disable`

**Sales:** `GET /v2/sales`, `GET /v2/sales/:id`, `PUT /v2/sales/:id/mark_as_shipped`, `PUT /v2/sales/:id/refund`, `POST /v2/sales/:id/resend_receipt`

**Licenses:** `POST /v2/licenses/verify`, `PUT /v2/licenses/enable`, `PUT /v2/licenses/disable`, `PUT /v2/licenses/rotate`, `PUT /v2/licenses/decrement_uses_count`

**Subscribers:** `GET /v2/products/:id/subscribers`, `GET /v2/subscribers/:id`

**Offer codes:** `GET/POST /v2/products/:id/offer_codes`, `GET/PUT/DELETE /v2/products/:id/offer_codes/:code_id`

**Variants:** `GET/POST .../variant_categories`, `GET/POST .../variants`, etc.

**Custom fields:** `GET/POST/PUT/DELETE /v2/products/:id/custom_fields/...`

**Payouts:** `GET /v2/payouts`, `GET /v2/payouts/:id`, `GET /v2/payouts/upcoming`

**Webhooks (resource subscriptions):** `GET /v2/resource_subscriptions`, `PUT /v2/resource_subscriptions`, `DELETE /v2/resource_subscriptions/:id`

## Operations that agents use often

### List products

`GET https://api.gumroad.com/v2/products` with Bearer token. Requires `view_public` or a public-class scope. `sales_count` / `sales_usd_cents` on each product need **`view_sales`**.

### List sales (pagination)

`GET https://api.gumroad.com/v2/sales` requires **`view_sales`**.

- **Use cursor pagination:** pass `page_key` from the previous response’s `next_page_key`. The `page` parameter is **deprecated** and may time out on large datasets.
- **Filters:** `after`, `before` (dates as `YYYY-MM-DD`), `email`, `product_id`, `order_id`.
- Typical page size: **10** sales per response (per docs).

### Verify a license (often unauthenticated)

`POST https://api.gumroad.com/v2/licenses/verify` with form body:

- `license_key` (required)
- `product_id` **strongly recommended**; may be required for newer products
- `permalink` — alternative to `product_id`
- `increment_uses_count` — default behavior increments uses; use `false` for checks without bumping the counter

This endpoint is commonly called **without** a Bearer token from shipped apps. Handle `success: false` and 404-style error messages for invalid/disabled/expired licenses.

### Webhooks (resource subscriptions)

Requires **`view_sales`**. Subscribe with `PUT /v2/resource_subscriptions` and form fields `resource_name` + `post_url`.

**Resource names include:** `sale`, `refund`, `cancellation`, `subscription_ended`, `subscription_restarted`, `subscription_updated`, `dispute`, `dispute_won`.

`post_url` must be reachable (no localhost in production docs). Verify deliveries by cross-checking critical data (e.g. sale lookup) per Gumroad guidance.

## Security

- Never commit client secrets or access tokens; use environment variables or a secrets manager.
- Prefer `Authorization: Bearer` over query-string tokens.
- Use `state` in OAuth to mitigate CSRF.

## When to open reference.md

For per-endpoint request/response fields, errors, and examples, use [reference.md](reference.md) and follow links to the specific doc page.
