# Example API Responses

## User Endpoint

**Request:** `GET /v2/user`

```json
{
  "success": true,
  "user": {
    "id": "abc123",
    "name": "Jane Creator",
    "email": "jane@example.com",
    "url": "https://gumroad.com/janecreator",
    "profile_url": "https://gumroad.com/janecreator"
  }
}
```

## Products

### List Products

**Request:** `GET /v2/products`

```json
{
  "success": true,
  "products": [
    {
      "id": "prod_123",
      "name": "Ultimate Guide to Productivity",
      "url": "https://gumroad.com/l/productivity",
      "price": 2900,
      "description": "A comprehensive guide...",
      "customizable_price": true,
      "suggested_price": 2900,
      "published": true,
      "sales_count": 142,
      "sales_usd_cents": 411800,
      "is_tiered_membership": false,
      "thumbnail_url": "https://...",
      "tags": ["productivity", "guide"]
    },
    {
      "id": "prod_456",
      "name": "Monthly Membership",
      "url": "https://gumroad.com/l/membership",
      "price": 999,
      "description": "Access to exclusive content",
      "published": true,
      "is_tiered_membership": true,
      "recurrence": "monthly",
      "sales_count": 58,
      "sales_usd_cents": 57942
    }
  ]
}
```

### Single Product

**Request:** `GET /v2/products/:id`

```json
{
  "success": true,
  "product": {
    "id": "prod_123",
    "name": "Ultimate Guide to Productivity",
    "url": "https://gumroad.com/l/productivity",
    "price": 2900,
    "description": "A comprehensive guide...",
    "currency": "usd",
    "short_url": "https://janecreator.gumroad.com/l/productivity",
    "thumbnail_url": "https://...",
    "tags": ["productivity", "guide"],
    "formatted_price": "$29",
    "published": true,
    "shown_on_profile": true,
    "file_info": {},
    "customizable_price": true,
    "suggested_price": 2900,
    "minimum_price": 2900,
    "purchase_url": "https://janecreator.gumroad.com/l/productivity",
    "preview_url": null,
    "require_shipping": false,
    "custom_receipt": null,
    "custom_permalink": "productivity",
    "custom_fields": [],
    "sales_count": 142,
    "sales_usd_cents": 411800
  }
}
```

## Sales

### List Sales

**Request:** `GET /v2/sales`

```json
{
  "success": true,
  "sales": [
    {
      "id": "sale_abc123",
      "product_id": "prod_123",
      "product_name": "Ultimate Guide to Productivity",
      "permalink": "productivity",
      "email": "customer@example.com",
      "price": 2900,
      "currency": "usd",
      "formatted_display_price": "$29",
      "formatted_total_price": "$29",
      "gumroad_fee": 284,
      "seller_id": "abc123",
      "seller_name": "Jane Creator",
      "purchase_email": "customer@example.com",
      "purchaser_id": "cust_xyz789",
      "refunded": false,
      "subscription_id": null,
      "is_multiseat_license": false,
      "quantity": 1,
      "created_at": "2024-01-15T10:30:00Z",
      "sale_timestamp": "2024-01-15T10:30:00Z",
      "variants": "",
      "license_key": "ABC123-DEF456-GHI789-JKL012",
      "ip_country": "US"
    }
  ],
  "next_page_key": "eyJwYWdlIjoyLCJ0b3RhbCI6NTB9"
}
```

### Single Sale

**Request:** `GET /v2/sales/:id`

```json
{
  "success": true,
  "sale": {
    "id": "sale_abc123",
    "product_id": "prod_123",
    "product_name": "Ultimate Guide to Productivity",
    "permalink": "productivity",
    "email": "customer@example.com",
    "full_name": "John Customer",
    "price": 2900,
    "currency": "usd",
    "formatted_display_price": "$29",
    "gumroad_fee": 284,
    "seller_id": "abc123",
    "purchase_email": "customer@example.com",
    "refunded": false,
    "disputed": false,
    "dispute_won": false,
    "quantity": 1,
    "created_at": "2024-01-15T10:30:00Z",
    "custom_fields": {},
    "chargebacked": false,
    "license_key": "ABC123-DEF456-GHI789-JKL012",
    "variants": {},
    "ip_country": "US",
    "is_gift_receiver_purchase": false,
    "recurrence": null,
    "subscription_cancelled_at": null,
    "subscription_failed_at": null,
    "subscription_ended_at": null,
    "subscription_duration": null
  }
}
```

## License Verification

### Valid License

**Request:** `POST /v2/licenses/verify`

```json
{
  "success": true,
  "uses": 1,
  "purchase": {
    "id": "sale_abc123",
    "product_id": "prod_123",
    "product_name": "Ultimate Guide to Productivity",
    "permalink": "productivity",
    "email": "customer@example.com",
    "price": 2900,
    "created_at": "2024-01-15T10:30:00Z",
    "license_key": "ABC123-DEF456-GHI789-JKL012",
    "variants": {},
    "subscription_id": null,
    "subscription_cancelled_at": null,
    "subscription_failed_at": null
  }
}
```

### Invalid License

```json
{
  "success": false,
  "message": "That license does not exist for the provided product."
}
```

### Disabled License

```json
{
  "success": false,
  "message": "The license key provided was disabled by the seller."
}
```

## Webhooks

### Webhook Subscription Created

**Request:** `PUT /v2/resource_subscriptions`

```json
{
  "success": true,
  "resource_subscription": {
    "id": "sub_123",
    "resource_name": "sale",
    "post_url": "https://example.com/webhook/gumroad"
  }
}
```

### Webhook Payload (Sale Event)

When a sale occurs, Gumroad POSTs this to your webhook URL:

```json
{
  "seller_id": "abc123",
  "product_id": "prod_123",
  "product_name": "Ultimate Guide to Productivity",
  "permalink": "productivity",
  "product_permalink": "https://janecreator.gumroad.com/l/productivity",
  "email": "customer@example.com",
  "full_name": "John Customer",
  "purchase_email": "customer@example.com",
  "price": 2900,
  "currency": "usd",
  "gumroad_fee": 284,
  "quantity": 1,
  "sale_id": "sale_abc123",
  "sale_timestamp": "2024-01-15T10:30:00Z",
  "purchaser_id": "cust_xyz789",
  "subscription_id": null,
  "variants": {},
  "custom_fields": {},
  "license_key": "ABC123-DEF456-GHI789-JKL012",
  "ip_country": "US",
  "refunded": false,
  "disputed": false,
  "dispute_won": false,
  "is_gift_receiver_purchase": false,
  "is_multiseat_license": false,
  "recurrence": null,
  "discover_fee_charged": false,
  "can_contact": true,
  "referrer": "https://twitter.com/janecreator",
  "card": {
    "visual": null,
    "type": null,
    "bin": null,
    "expiry_month": null,
    "expiry_year": null
  },
  "url_params": {},
  "test": false
}
```

## Subscribers

### List Subscribers

**Request:** `GET /v2/products/:id/subscribers`

```json
{
  "success": true,
  "subscribers": [
    {
      "id": "sub_abc123",
      "product_id": "prod_456",
      "user_id": "cust_xyz789",
      "user_email": "subscriber@example.com",
      "purchase_ids": ["sale_def456", "sale_ghi789"],
      "created_at": "2024-01-01T00:00:00Z",
      "user_requested_cancellation_at": null,
      "charge_occurrence_count": 3,
      "recurrence": "monthly",
      "status": "alive",
      "cancelled_at": null,
      "failed_at": null,
      "free_trial_ends_at": null
    }
  ]
}
```
