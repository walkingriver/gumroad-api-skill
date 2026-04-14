# Environment Variables Reference

This skill uses standard environment variables. How you set them is up to you.

## Required Variables

### GUMROAD_ACCESS_TOKEN

**Required for:** All authenticated API operations

**Get it from:** [https://app.gumroad.com/settings/advanced#application-form](https://app.gumroad.com/settings/advanced#application-form)

**Used in:**
- Product management (create, update, delete)
- Sales data fetching
- Webhook setup
- Refund processing
- Account information

**Example:**
```bash
export GUMROAD_ACCESS_TOKEN="abc123def456..."
```

**Security Note:** This token has full access to your Gumroad account. Never commit it to version control.

## Optional Variables

### GUMROAD_WEBHOOK_SECRET

**Used for:** Webhook signature verification (additional security)

**Purpose:** If you implement webhook signing, set this to verify incoming webhook requests are authentic.

**Example:**
```bash
export GUMROAD_WEBHOOK_SECRET="your_secret_here"
```

### GUMROAD_PRODUCT_ID

**Used for:** Simplifying license verification workflows

**Purpose:** Default product ID when verifying licenses. Useful if you only have one product or want a default for testing.

**Example:**
```bash
export GUMROAD_PRODUCT_ID="your_product_id"
```

## Setting Environment Variables

Choose the method that works for your setup:

| Method | Use Case | Persistence |
|--------|----------|-------------|
| **Shell profile** | Development workstation | Permanent |
| **Current session** | Quick testing | Temporary |
| **IDE config** | Editor-based development | Per-project |
| **.env file** | Local development | Project-specific |
| **Secrets manager** | Production/team | Centralized |
| **Container env** | Docker/K8s | Deployment-specific |
| **System variables** | Windows global | Permanent |

See `references/authentication.md` for detailed examples of each method.

## Verification

Test that your environment variables are set:

```bash
# Mac/Linux
echo $GUMROAD_ACCESS_TOKEN

# Windows PowerShell  
echo $env:GUMROAD_ACCESS_TOKEN

# Windows Command Prompt
echo %GUMROAD_ACCESS_TOKEN%
```

## Quick Test

Verify your token works:

```bash
curl -H "Authorization: Bearer $GUMROAD_ACCESS_TOKEN" \
  https://api.gumroad.com/v2/user
```

Expected: `{"success": true, "user": {...}}`
