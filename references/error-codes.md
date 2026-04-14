# Error Codes and Handling

## Response Structure

All responses include a `success` field. **Always check this field**, even for HTTP 200 responses.

```json
{
  "success": true,
  "data": {...}
}
```

Or:

```json
{
  "success": false,
  "message": "Error description"
}
```

## HTTP Status Codes

| Code | Meaning | Common Causes |
|------|---------|---------------|
| 200 | OK | Request successful (check `success` in body) |
| 400 | Bad Request | Invalid parameters, malformed JSON |
| 401 | Unauthorized | Missing or invalid access token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side issue |

## Common Errors

### Authentication Errors

**"Token not provided"**
```json
{
  "success": false,
  "message": "Token not provided"
}
```
**Solution:** Add `Authorization: Bearer TOKEN` header

**"Invalid token"**
```json
{
  "success": false,
  "message": "Invalid token"
}
```
**Solution:** Token expired or revoked; obtain new token

### Validation Errors

**Missing required field**
```json
{
  "success": false,
  "message": "Name can't be blank"
}
```
**Solution:** Provide all required fields per endpoint documentation

**Invalid format**
```json
{
  "success": false,
  "message": "Price must be a number"
}
```
**Solution:** Check data types and formats

### License Verification Errors

**Invalid or disabled license**
```json
{
  "success": false,
  "message": "That license does not exist for the provided product."
}
```
**Causes:**
- Wrong `product_id` or `permalink`
- License was refunded
- License was manually disabled
- License key typo

**Solution:** Verify license key and product ID; check refund status

**Uses exceeded**
```json
{
  "success": false,
  "message": "License has exceeded maximum uses"
}
```
**Solution:** License hit activation limit; user needs new license or limit increase

### Rate Limiting

**HTTP 429 Response**
```json
{
  "success": false,
  "message": "Rate limit exceeded"
}
```

**Handling Strategy:**
```python
import time

def call_api_with_retry(url, headers, max_retries=5):
    wait_time = 2  # Start with 2 seconds
    
    for attempt in range(max_retries):
        response = requests.get(url, headers=headers)
        
        if response.status_code == 429:
            if attempt < max_retries - 1:
                time.sleep(wait_time)
                wait_time *= 2  # Exponential backoff
                continue
        
        return response
    
    raise Exception("Max retries exceeded")
```

### Resource Not Found

**Product not found**
```json
{
  "success": false,
  "message": "Product not found"
}
```
**Solution:** Verify product ID; product may have been deleted

**Sale not found**
```json
{
  "success": false,
  "message": "Sale not found"
}
```
**Solution:** Verify sale ID and access permissions

### Webhook Errors

**Invalid post_url**
```json
{
  "success": false,
  "message": "Post url is invalid"
}
```
**Causes:**
- URL not publicly accessible
- Using localhost
- Invalid URL format

**Solution:** Use public HTTPS endpoint; test with curl first

## Debugging Checklist

1. **Check `success` field** before processing response
2. **Log full response body** for failed requests
3. **Verify HTTP status code** matches expectations
4. **Check authentication** if 401/403
5. **Validate parameters** if 400/422
6. **Implement retry logic** for 429/500
7. **Handle edge cases** (refunded, disabled, expired)

## Error Handling Best Practices

```javascript
async function makeGumroadRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`https://api.gumroad.com/v2${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${process.env.GUMROAD_ACCESS_TOKEN}`,
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    
    // Check success field
    if (!data.success) {
      throw new Error(`Gumroad API error: ${data.message}`);
    }
    
    // Check HTTP status
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${data.message}`);
    }
    
    return data;
    
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}
```
