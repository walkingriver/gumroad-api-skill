# Authentication Guide

## Personal Access Tokens (For Testing & Personal Use)

The simplest way to get started with the Gumroad API is using a personal access token.

### Getting a Personal Access Token

1. Log into your Gumroad account
2. Go to [Advanced Settings](https://app.gumroad.com/settings/advanced#application-form)
3. Scroll to "Application Form" section
4. Click "Generate access token" or "Create application"
5. Copy the token - it won't be shown again!

**Important:** Personal access tokens have full access to your account. Use them for:
- Personal scripts and automation
- Testing and development
- Single-user integrations

**Don't use them for:**
- Apps serving multiple Gumroad creators (use OAuth instead)
- Client-side code (tokens would be exposed)
- Sharing with others

### Using Your Access Token

The skill expects your token in the **GUMROAD_ACCESS_TOKEN** environment variable. How you set this is up to you - choose the method that fits your workflow:

#### Common Approaches

**Shell Profile (Persistent across sessions)**
```bash
# Mac/Linux - add to ~/.zshrc or ~/.bashrc
export GUMROAD_ACCESS_TOKEN="your_token_here"

# Then reload: source ~/.zshrc
```

**Current Session Only**
```bash
# Mac/Linux
export GUMROAD_ACCESS_TOKEN="your_token_here"

# Windows PowerShell
$env:GUMROAD_ACCESS_TOKEN="your_token_here"

# Windows Command Prompt
set GUMROAD_ACCESS_TOKEN=your_token_here
```

**IDE/Editor Configuration**
- VS Code: `.vscode/settings.json` → `"terminal.integrated.env"`
- JetBrains IDEs: Run Configurations → Environment Variables
- Most editors have environment variable configuration

**Secrets Managers**
- 1Password: `op run --env-file=".env" -- command`
- AWS Secrets Manager: Retrieve at runtime
- HashiCorp Vault: Inject via vault agent
- Docker: `docker run -e GUMROAD_ACCESS_TOKEN=...`

**Project .env Files** (Development)
```bash
# Create .env (add to .gitignore!)
echo "GUMROAD_ACCESS_TOKEN=your_token_here" > .env

# Load with python-dotenv or dotenv package
```

**System Environment Variables** (Windows)
1. Search "Environment Variables"
2. Edit system environment variables
3. Add GUMROAD_ACCESS_TOKEN

#### Using in Code

```python
# Python
import os
token = os.environ['GUMROAD_ACCESS_TOKEN']

headers = {'Authorization': f'Bearer {token}'}
```

```javascript
// Node.js
const token = process.env.GUMROAD_ACCESS_TOKEN;

const headers = {
  'Authorization': `Bearer ${token}`
};
```

```bash
# Shell scripts
curl -H "Authorization: Bearer $GUMROAD_ACCESS_TOKEN" \
  https://api.gumroad.com/v2/user
```

### Testing Your Token

```bash
# Should return your user info
curl -H "Authorization: Bearer $GUMROAD_ACCESS_TOKEN" \
  https://api.gumroad.com/v2/user

# Expected success response:
{
  "success": true,
  "user": {
    "id": "...",
    "name": "Your Name",
    "email": "your@email.com"
  }
}
```

---

## OAuth 2.0 (For Multi-User Applications)

If you're building an app that serves multiple Gumroad creators, use OAuth 2.0 instead of personal access tokens.

Gumroad uses OAuth 2.0 (Doorkeeper implementation) for authentication.

**Application Settings:** [https://gumroad.com/settings/applications](https://gumroad.com/settings/applications)

## Grant Types

### 1. Authorization Code (Recommended for Third-Party Apps)

**Step 1: Redirect user to authorization URL**

```
https://gumroad.com/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=YOUR_REDIRECT_URI&
  response_type=code&
  scope=view_sales edit_products&
  state=RANDOM_STATE_STRING
```

**Step 2: Exchange code for access token**

```bash
curl -X POST https://gumroad.com/oauth/token \
  -d "grant_type=authorization_code" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "code=AUTHORIZATION_CODE" \
  -d "redirect_uri=YOUR_REDIRECT_URI"
```

**Response:**
```json
{
  "access_token": "abc123...",
  "token_type": "Bearer",
  "expires_in": null,
  "refresh_token": "xyz789...",
  "scope": "view_sales edit_products"
}
```

### 2. Client Credentials

For server-to-server automation where you control both ends:

```bash
curl -X POST https://gumroad.com/oauth/token \
  -d "grant_type=client_credentials" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

### 3. Refresh Token

When tokens expire (future-proofing):

```bash
curl -X POST https://gumroad.com/oauth/token \
  -d "grant_type=refresh_token" \
  -d "refresh_token=YOUR_REFRESH_TOKEN" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

## Scopes

Request only the minimum scopes needed:

| Scope | Permissions |
|-------|-------------|
| `view_public` | Basic public profile |
| `view_profile` | Detailed profile information |
| `edit_products` | Create, update, delete products |
| `view_sales` | Access sales data, customers; **required for webhooks** |
| `view_payouts` | View payout history |
| `mark_sales_as_shipped` | Mark physical orders as shipped |
| `refund_sales` | Process refunds |
| `edit_sales` | Resend receipts, modify sale records |

**Reserved (internal use only):** `mobile_api`, `creator_api`, `unfurl`, `helper_api`

## Using Access Tokens

### Preferred Method: Bearer Header

```bash
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://api.gumroad.com/v2/user
```

### Alternative: Query Parameter (Not Recommended)

```bash
curl https://api.gumroad.com/v2/user?access_token=YOUR_ACCESS_TOKEN
```

⚠️ **Warning:** Query parameters may appear in server logs.

## Token Behavior

- **Current:** Tokens show `"expires_in": null` (treated as non-expiring)
- **Future:** Expiration may be enforced; use refresh tokens
- **Best Practice:** Always handle refresh token flow for production apps

## Testing Authentication

```bash
# Test if token is valid
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  https://api.gumroad.com/v2/user

# Success:
{
  "success": true,
  "user": {
    "id": "...",
    "name": "...",
    "email": "..."
  }
}

# Failure:
{
  "success": false,
  "message": "Token not provided"
}
```

## Security Best Practices

1. **Never hardcode credentials** - Use environment variables or secret managers
2. **Use state parameter** - Prevents CSRF attacks in OAuth flow
3. **Validate redirect_uri** - Prevent authorization code theft
4. **Rotate compromised tokens** - Revoke and regenerate immediately
5. **Store securely** - Use encrypted storage for tokens
6. **HTTPS only** - Never transmit tokens over unencrypted connections
