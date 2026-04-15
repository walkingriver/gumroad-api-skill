# Writing Effective Product Descriptions

## HTML Format Required

Gumroad product descriptions use **HTML**, not Markdown. Your descriptions will render with HTML tags.

## Recommended HTML Tags

### Headings
```html
<h1><strong>Main Headline</strong></h1>
<h2><strong>Section Title</strong></h2>
<h3><strong>Subsection</strong></h3>
```

### Text Formatting
```html
<p>Regular paragraph text</p>
<p><strong>Bold text</strong></p>
<p><em>Italic text</em></p>
<p><code>Inline code</code></p>
```

### Lists
```html
<ul>
<li>Unordered list item</li>
<li>Another item</li>
</ul>

<ol>
<li>Ordered list item</li>
<li>Second item</li>
</ol>
```

### Links
```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer nofollow">Link text</a>
```

### Horizontal Rules
```html
<hr>
```

### Checkmarks and Symbols
Use Unicode characters directly:
- ✅ (Checkmark): `✅`
- ❌ (Cross): `❌`
- 🎯 (Target): `🎯`

## Best Practices

### 1. Start Strong
Open with a compelling headline that addresses a pain point or desire:
```html
<h2><strong>Stop Spending Hours on [Problem]</strong></h2>
<p>Your customers face [specific pain point]. This product solves it in [timeframe].</p>
```

### 2. Use Visual Hierarchy
```html
<h2><strong>Main Benefit</strong></h2>
<p>Explanation paragraph</p>

<h3><strong>What's Included</strong></h3>
<ul>
<li>Feature 1</li>
<li>Feature 2</li>
<li>Feature 3</li>
</ul>
```

### 3. Include Social Proof
```html
<h3><strong>What Customers Are Saying</strong></h3>
<p><em>"This saved me 10 hours a week!"</em> — Customer Name</p>
```

### 4. Clear Call to Action
```html
<hr>
<p><strong>Ready to get started?</strong> Download now and see results in [timeframe].</p>
```

## Complete Example (Free Product)

```html
<h2><strong>Your Free Gift: [Title]</strong></h2>

<p>Brief intro that hooks the reader and explains what they're getting.</p>

<p><strong>This is completely free.</strong></p>

<h3><strong>What You'll Get</strong></h3>

<p>A practical guide that helps you:</p>

<p>✅ <strong>Benefit 1</strong> with specific outcome</p>
<p>✅ <strong>Benefit 2</strong> with specific outcome</p>
<p>✅ <strong>Benefit 3</strong> with specific outcome</p>

<h3><strong>Who This Is For</strong></h3>

<ul>
<li>Target audience 1</li>
<li>Target audience 2</li>
<li>Target audience 3</li>
</ul>

<h3><strong>Your Privacy Matters</strong></h3>

<p><strong>My promise:</strong> No spam, no sharing your email, unsubscribe anytime.</p>

<hr>

<p><strong>Download now</strong> — instant access, no credit card required.</p>
```

## Complete Example (Paid Product)

```html
<h1><strong>Headline That Captures Attention</strong></h1>

<h2><strong>Hook with a Story or Pain Point</strong></h2>

<p>Opening paragraph that connects with the reader's experience.</p>

<p>Continue building the narrative...</p>

<hr>

<h2><strong>What You Get</strong></h2>

<p>✅ <strong>DRM-free ePub</strong> (read on any device)</p>
<p>✅ <strong>DRM-free PDF</strong> (print it, own it)</p>
<p>✅ <strong>BONUS: Template files</strong> (ready to customize)</p>

<p>No restrictions. No platform lock-in.</p>

<hr>

<h2><strong>Real Results</strong></h2>

<p>Social proof with specific numbers:</p>

<ul>
<li><strong>X customers</strong> have used this</li>
<li><strong>Y% improvement</strong> in their workflow</li>
<li><strong>Z hours saved</strong> per week</li>
</ul>

<hr>

<h2><strong>What This Actually Teaches You</strong></h2>

<h3><strong>Section 1 Title</strong></h3>
<p>What they'll learn and why it matters</p>

<h3><strong>Section 2 Title</strong></h3>
<p>More specific outcomes</p>

<hr>

<h2><strong>Who This Is For</strong></h2>

<p>✅ <strong>Persona 1</strong> who wants [specific outcome]</p>
<p>✅ <strong>Persona 2</strong> looking to [specific goal]</p>
<p>✅ <strong>Persona 3</strong> ready to [specific transformation]</p>

<hr>

<h2><strong>FAQ</strong></h2>

<p><strong>Q: Common question?</strong> A: Clear answer addressing the concern.</p>

<p><strong>Q: Another question?</strong> A: Specific, helpful response.</p>

<hr>

<h2><strong>Get It Now</strong></h2>

<p>Final call to action with guarantee or urgency.</p>

<p><em>30-day money-back guarantee. Questions? Email support@example.com</em></p>
```

## Tips for Better Descriptions

### Do:
- Use checkmarks (✅) for benefits
- Break content into scannable sections
- Include specific numbers and outcomes
- Address objections in FAQ
- End with clear call to action
- Add horizontal rules (`<hr>`) to separate major sections

### Don't:
- Use Markdown syntax (it won't render)
- Write walls of text without formatting
- Forget to close HTML tags
- Use complex nested structures
- Skip the call to action

## Testing Your Description

1. Preview in Gumroad's editor before publishing
2. Check formatting on desktop and mobile
3. Verify all links open correctly
4. Ensure checkmarks and symbols display properly
5. Test readability — can someone scan and understand in 30 seconds?
