# Rate Limiting and Pagination

## Rate Limiting

Gumroad doesn't publish specific rate limits, but HTTP 429 responses indicate you've exceeded them.

### Handling Rate Limits

#### Python Example with Exponential Backoff

```python
import time
import requests
import os

# Get token from environment variable
# Set with: export GUMROAD_ACCESS_TOKEN="your_token_here"
ACCESS_TOKEN = os.environ.get('GUMROAD_ACCESS_TOKEN')

def gumroad_request(url, headers, max_retries=5):
    """Make a Gumroad API request with exponential backoff."""
    wait_time = 2  # Initial wait: 2 seconds
    
    for attempt in range(max_retries):
        response = requests.get(url, headers=headers)
        
        if response.status_code == 429:
            if attempt < max_retries - 1:
                print(f"Rate limited. Waiting {wait_time}s before retry {attempt + 1}/{max_retries}")
                time.sleep(wait_time)
                wait_time *= 2  # Double the wait time
                continue
            else:
                raise Exception("Max retries exceeded due to rate limiting")
        
        return response
    
    raise Exception("Request failed after all retries")

# Usage
if not ACCESS_TOKEN:
    raise Exception("GUMROAD_ACCESS_TOKEN not set. Run: export GUMROAD_ACCESS_TOKEN='your_token'")

headers = {"Authorization": f"Bearer {ACCESS_TOKEN}"}
response = gumroad_request("https://api.gumroad.com/v2/products", headers)
```

#### JavaScript Example

```javascript
// Get token from environment variable
// Set with: export GUMROAD_ACCESS_TOKEN="your_token_here"
// In Node.js: process.env.GUMROAD_ACCESS_TOKEN
const accessToken = process.env.GUMROAD_ACCESS_TOKEN;

if (!accessToken) {
  throw new Error('GUMROAD_ACCESS_TOKEN not set');
}

async function gumroadRequestWithRetry(url, options = {}, maxRetries = 5) {
  let waitTime = 2000; // Initial wait: 2 seconds
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fetch(url, options);
    
    if (response.status === 429) {
      if (attempt < maxRetries - 1) {
        console.log(`Rate limited. Waiting ${waitTime/1000}s before retry ${attempt + 1}/${maxRetries}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        waitTime *= 2; // Double the wait time
        continue;
      } else {
        throw new Error('Max retries exceeded due to rate limiting');
      }
    }
    
    return response;
  }
}

// Usage
const response = await gumroadRequestWithRetry(
  'https://api.gumroad.com/v2/products',
  {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  }
);
```

### Best Practices

1. **Use webhooks instead of polling** - Real-time notifications without rate limits
2. **Cache responses** - Don't fetch the same data repeatedly
3. **Batch operations** - Minimize number of API calls
4. **Exponential backoff** - Always implement retry logic
5. **Monitor response times** - Slow responses may precede rate limiting

## Pagination

### Cursor-Based Pagination (Recommended)

Gumroad uses cursor-based pagination for large datasets. The `page` parameter is **deprecated** and may timeout.

#### List Sales with Pagination

```python
import os

# Get token from environment
ACCESS_TOKEN = os.environ.get('GUMROAD_ACCESS_TOKEN')

def fetch_all_sales(access_token):
    """Fetch all sales using cursor pagination."""
    headers = {"Authorization": f"Bearer {access_token}"}
    all_sales = []
    page_key = None
    
    while True:
        # Build URL with page_key if we have one
        url = "https://api.gumroad.com/v2/sales"
        if page_key:
            url += f"?page_key={page_key}"
        
        response = requests.get(url, headers=headers)
        data = response.json()
        
        if not data.get("success"):
            raise Exception(f"API error: {data.get('message')}")
        
        # Add sales to our collection
        sales = data.get("sales", [])
        all_sales.extend(sales)
        
        # Check if there are more pages
        page_key = data.get("next_page_key")
        if not page_key:
            break  # No more pages
        
        print(f"Fetched {len(sales)} sales. Total so far: {len(all_sales)}")
        time.sleep(0.5)  # Be nice to the API
    
    return all_sales

# Usage
if not ACCESS_TOKEN:
    raise Exception("Set GUMROAD_ACCESS_TOKEN environment variable")

all_sales = fetch_all_sales(ACCESS_TOKEN)
print(f"Total sales: {len(all_sales)}")
```

#### JavaScript Example

```javascript
async function fetchAllSales(accessToken) {
  const headers = {
    'Authorization': `Bearer ${accessToken}`
  };
  
  let allSales = [];
  let pageKey = null;
  
  while (true) {
    // Build URL with page_key if we have one
    let url = 'https://api.gumroad.com/v2/sales';
    if (pageKey) {
      url += `?page_key=${encodeURIComponent(pageKey)}`;
    }
    
    const response = await fetch(url, { headers });
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(`API error: ${data.message}`);
    }
    
    // Add sales to our collection
    const sales = data.sales || [];
    allSales = allSales.concat(sales);
    
    // Check if there are more pages
    pageKey = data.next_page_key;
    if (!pageKey) {
      break; // No more pages
    }
    
    console.log(`Fetched ${sales.length} sales. Total so far: ${allSales.length}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Be nice to the API
  }
  
  return allSales;
}

// Usage
const allSales = await fetchAllSales('your_access_token');
console.log(`Total sales: ${allSales.length}`);
```

### Filtering Sales

Combine pagination with filters to narrow results:

```python
def fetch_sales_for_date_range(access_token, after_date, before_date):
    """Fetch sales within a specific date range."""
    headers = {"Authorization": f"Bearer {access_token}"}
    all_sales = []
    page_key = None
    
    while True:
        # Build URL with filters and pagination
        url = f"https://api.gumroad.com/v2/sales?after={after_date}&before={before_date}"
        if page_key:
            url += f"&page_key={page_key}"
        
        response = requests.get(url, headers=headers)
        data = response.json()
        
        if not data.get("success"):
            raise Exception(f"API error: {data.get('message')}")
        
        sales = data.get("sales", [])
        all_sales.extend(sales)
        
        page_key = data.get("next_page_key")
        if not page_key:
            break
    
    return all_sales

# Usage: Get all sales from January 2024
sales = fetch_sales_for_date_range(
    "your_access_token",
    "2024-01-01",
    "2024-01-31"
)
```

### Available Filters for Sales

| Parameter | Format | Description |
|-----------|--------|-------------|
| `after` | YYYY-MM-DD | Sales created after this date |
| `before` | YYYY-MM-DD | Sales created before this date |
| `email` | string | Filter by customer email |
| `product_id` | string | Filter by specific product |
| `order_id` | string | Filter by order ID |
| `page_key` | string | Cursor for next page |

### Pagination Response Format

```json
{
  "success": true,
  "sales": [...],
  "next_page_key": "eyJwYWdlIjoyLCJ0b3RhbCI6NTB9"
}
```

When `next_page_key` is `null` or absent, you've reached the last page.

### Performance Tips

1. **Typical page size is ~10 items** - Plan for multiple requests
2. **Use date filters** - Narrow the dataset when possible
3. **Add delays between requests** - 0.5-1 second prevents rate limiting
4. **Store page_key** - For resumable fetches if interrupted
5. **Avoid the deprecated `page` parameter** - Use `page_key` only
