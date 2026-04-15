# Gumroad API Skill

A Claude Code skill for automating Gumroad workflows including product management, sales tracking, license verification, and webhook setup.

## What is This?

This is a [Claude Skill](https://docs.anthropic.com/claude/docs/skills) that teaches Claude how to work with the Gumroad API effectively. It includes:

- 📚 Step-by-step workflow documentation
- 🔧 Ready-to-use code templates
- 📖 Complete API reference
- 🛡️ Error handling examples
- 🚀 Quick start guide

## Quick Start

**Recommended:** Install using the [skills.sh](https://skills.sh) CLI:

```bash
npx skills add https://github.com/walkingriver/gumroad-api-skill -g -a cursor -a claude-code
```

This installs the skill globally (`-g`) for both Cursor and Claude Code agents (`-a`).

### Installation Options

**For any AI agent:**
```bash
# Install globally for specific agents
npx skills add https://github.com/walkingriver/gumroad-api-skill -g -a <agent-name>

# Install for all agents
npx skills add https://github.com/walkingriver/gumroad-api-skill --all

# Install for current project only (no -g flag)
npx skills add https://github.com/walkingriver/gumroad-api-skill -a cursor
```

**Common flags:**
- `-g, --global` - Install globally (user-level) instead of project-level
- `-a, --agent` - Specify which agent(s) to install for (cursor, claude-code, cline, etc.)
- `-y, --yes` - Skip confirmation prompts
- `--all` - Install for all agents with all skills
- `-l, --list` - List available skills in the repo without installing

**Supported agents:** cursor, claude-code, cline, windsurf, github-copilot, vscode, and more

### Alternative Installation Methods

**For Claude.ai Users:**
1. Download this repository as a ZIP file
2. Open Claude.ai → Settings → Skills
3. Click "Upload skill" and select the ZIP file
4. Enable the Gumroad API skill

**Manual Installation (Claude Code):**
1. Clone or download this repository
2. Place it in your skills directory:
   ```bash
   # Mac/Linux
   ~/.claude/skills/gumroad-api/
   
   # Windows
   %USERPROFILE%\.claude\skills\gumroad-api\
   ```

### Verify Installation

After installation, verify the skill is available:

```bash
# List installed skills
npx skills list -g

# Or check your agent's skills directory
ls ~/.claude/skills/           # Claude Code
ls ~/.cursor/skills/           # Cursor
```

Ask your AI agent: "Do you have access to the Gumroad API skill?" It should confirm and describe what it can do.

## What's Included

```
gumroad-api-skill/
├── SKILL.md                              # Main skill file with workflows
├── references/                           # Detailed documentation
│   ├── authentication.md                # OAuth & token management
│   ├── endpoints.md                     # Full API endpoint reference
│   ├── error-codes.md                   # Complete error guide
│   ├── product-descriptions.md          # ⭐ HTML formatting guide
│   └── examples/
│       ├── rate-limiting.md             # Pagination & retry logic
│       └── responses.md                 # Example API responses
└── templates/                           # Ready-to-use code
    ├── digital-product.json             # Product creation template (HTML)
    ├── membership-product.json          # Subscription template (HTML)
    ├── physical-product.json            # Physical goods template (HTML)
    ├── webhook-handler.py               # Flask webhook receiver
    ├── license-validator.js             # Client-side validation
    └── simple-test.sh                   # Quick API test script
```

**⚠️ Important:** Gumroad product descriptions use **HTML**, not Markdown. See `references/product-descriptions.md` for complete formatting guide with examples.

## Usage

### Invoking the Skill

**Direct invocation with slash command:**
```
/gumroad-api
```

This explicitly loads the skill and asks Claude to help with Gumroad API tasks.

**Automatic activation:**

The skill activates automatically when you mention keywords like:
- "Gumroad"
- "verify license"
- "list my products"
- "check sales"
- "set up webhooks"
- "Gumroad API"

### Example Requests

Once installed, ask Claude:

- "List my Gumroad products"
- "Verify this license key for my product"
- "Help me set up a webhook for new sales"
- "Create a new product with these details"
- "Fetch all sales from last month"
- "Show me how to implement license verification in my app"

Or use the slash command first:
```
/gumroad-api help me create a new digital product
```

Claude will automatically use the skill to guide you through the workflows.

### Updating the Skill

Keep your skill up to date with the latest API changes and improvements:

```bash
# Update all globally installed skills
npx skills update -g

# Update specific skill
npx skills update gumroad-api-skill -g

# Update with auto-confirm
npx skills update -g -y
```

---

## Getting Started

### Prerequisites

- A Gumroad creator account
- Terminal/command line access
- (Optional) Python or Node.js for running examples

## Step 1: Get Your Access Token

1. **Log into Gumroad** at [gumroad.com](https://gumroad.com)

2. **Navigate to Advanced Settings:**
   - Go to [https://app.gumroad.com/settings/advanced](https://app.gumroad.com/settings/advanced)
   - Scroll down to "Application Form" section

3. **Create Application or Generate Token:**
   - Click "Create application" or "Generate access token"
   - Fill in application name (e.g., "My Scripts")
   - Copy the access token - **save it somewhere safe!**

4. **IMPORTANT:** This token has full access to your account. Never:
   - Commit it to Git
   - Share it publicly
   - Put it in client-side code
   - Share it with others

## Step 2: Set Environment Variable

The skill requires **GUMROAD_ACCESS_TOKEN** to be set as an environment variable. Choose the method that works best for your workflow:

**Quick Start (Current Session):**
```bash
# Mac/Linux
export GUMROAD_ACCESS_TOKEN="your_token_here"

# Windows PowerShell
$env:GUMROAD_ACCESS_TOKEN="your_token_here"
```

**Common Approaches:**

| Method | When to Use |
|--------|-------------|
| **Shell profile** (.zshrc, .bashrc) | Persistent across all terminal sessions |
| **IDE configuration** | When working within a specific editor |
| **.env file** | Project-specific development |
| **Secrets manager** | Production or team environments |
| **System variables** | Windows persistent configuration |

See `.env.example` for variable names and format. How you manage these variables is entirely up to you and your security requirements.

## Step 3: Test Your Setup

**Simple curl test:**
```bash
curl -H "Authorization: Bearer $GUMROAD_ACCESS_TOKEN" \
  https://api.gumroad.com/v2/user
```

**Expected output:**
```json
{
  "success": true,
  "user": {
    "id": "abc123",
    "name": "Your Name",
    "email": "your@email.com",
    "url": "https://gumroad.com/yourname"
  }
}
```

**If you get an error:**
- `"Token not provided"` → Environment variable not set correctly
- `"Invalid token"` → Token is wrong or expired, get a new one
- `curl: command not found` → Install curl or use Python/Node examples below

## Step 4: Try a Real API Call

### List Your Products

**curl:**
```bash
curl -H "Authorization: Bearer $GUMROAD_ACCESS_TOKEN" \
  https://api.gumroad.com/v2/products
```

**Python:**
```python
import os
import requests

token = os.environ.get('GUMROAD_ACCESS_TOKEN')
headers = {'Authorization': f'Bearer {token}'}

response = requests.get('https://api.gumroad.com/v2/products', headers=headers)
data = response.json()

if data['success']:
    for product in data['products']:
        print(f"{product['name']}: ${product['price']/100:.2f}")
else:
    print(f"Error: {data.get('message')}")
```

**Node.js:**
```javascript
const token = process.env.GUMROAD_ACCESS_TOKEN;

fetch('https://api.gumroad.com/v2/products', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {
  if (data.success) {
    data.products.forEach(product => {
      console.log(`${product.name}: $${product.price/100}`);
    });
  } else {
    console.log(`Error: ${data.message}`);
  }
});
```

## Step 5: Explore the Examples

Check out the templates folder for complete examples:

- `templates/webhook-handler.py` - Receive and process webhooks
- `templates/license-validator.js` - Verify license keys
- `templates/digital-product.json` - Product creation template
- `templates/membership-product.json` - Subscription template

## Common Issues

### "Token not provided"

Your environment variable isn't set. Verify:
```bash
# Check if it's set
echo $GUMROAD_ACCESS_TOKEN  # Mac/Linux
echo %GUMROAD_ACCESS_TOKEN%  # Windows CMD
echo $env:GUMROAD_ACCESS_TOKEN  # Windows PowerShell
```

If empty, set the GUMROAD_ACCESS_TOKEN environment variable using your preferred method.

### "Invalid token"

Token is wrong. Get a new one:
1. Go to https://app.gumroad.com/settings/advanced
2. Generate a new token
3. Update your environment variable or .env file

### "curl: command not found"

Install curl:
```bash
# Mac
brew install curl

# Ubuntu/Debian
sudo apt-get install curl

# Windows
# Use PowerShell or install from https://curl.se/windows/
```

Or use Python/Node.js instead.

## Next Steps

- Read `SKILL.md` for complete workflow documentation
- Check `references/` folder for detailed API documentation
- Review `references/examples/` for pagination and error handling
- Explore `templates/` for production-ready code examples

---

## Contributing

Found a bug or want to improve the skill? Pull requests welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT - See LICENSE file for details

## Resources

- **Official Gumroad API docs:** [gumroad.com/api](https://gumroad.com/api)
- **Claude Skills documentation:** [docs.anthropic.com/claude/docs/skills](https://docs.anthropic.com/claude/docs/skills)
- **Gumroad support:** [help.gumroad.com](https://help.gumroad.com)

---

**Note:** This is an unofficial community skill, not affiliated with Gumroad or Anthropic.
