# MDX Integration Guide

## Overview

This project now supports **dual content sources**: 
- **Notion API** for existing content management
- **MDX files** for rich HTML content with React components

Both sources work seamlessly together, allowing you to overcome Notion's HTML limitations while maintaining your existing workflow.

## ✅ What's Been Implemented

### 1. Content Collections
- ✅ `posts` + `postsMdx` - Blog posts from both sources
- ✅ `projects` + `projectsMdx` - Project pages from both sources  
- ✅ `services` + `servicesMdx` - Service listings from both sources
- ✅ `products` + `productsMdx` - Product pages from both sources
- ✅ `stays` + `staysMdx` - Accommodation listings from both sources

### 2. Folder Structure
```
/content/
├── posts/          # MDX blog posts
├── projects/       # MDX project pages  
├── services/       # MDX service listings
├── products/       # MDX product pages
└── stays/          # MDX accommodation pages
```

### 3. Page Templates Updated
- ✅ All page templates now handle both Notion and MDX sources
- ✅ Automatic data normalization between formats
- ✅ Seamless URL routing for both content types

### 4. Sample Content Created
- ✅ 5 sample posts covering travel, digital nomad, food, photography
- ✅ 5 sample projects covering environmental and social impact
- ✅ 2 sample stays (eco lodge, glamping)
- ✅ 1 sample product (bamboo water bottle)
- ✅ 1 sample service (eco tour guide)

## 🚀 How to Use MDX Content

### Creating New MDX Content

1. **Create MDX file** in appropriate `/content/[type]/` folder
2. **Add frontmatter** with required fields
3. **Write content** using Markdown + HTML + React components

### Example MDX File Structure

```mdx
---
title: "Your Amazing Post Title"
tags: ["travel", "sustainability"] 
slug: "your-amazing-post"
published: 2024-01-15
description: "Brief description of your content"
---

# Your Amazing Post Title

Regular **markdown** content works great!

<div className="bg-blue-50 p-4 rounded-lg my-4">
  <strong>💡 Pro Tip:</strong><br/>
  You can use HTML and Tailwind classes for rich formatting!
</div>

```javascript
const codeExample = {
  feature: "Code blocks with syntax highlighting",
  support: "Multiple languages supported"
};
```

## Interactive components work too!

<CustomComponent prop="value" />
```

### Required Frontmatter Fields

#### Posts (postsMdx)
```yaml
title: string
tags: array of strings  
slug: string (unique)
published: date
description: string
coverImage: string (optional)
lastUpdated: date (optional)
```

#### Projects (projectsMdx)
```yaml
title: string
country: array of strings
locale: array of strings
category: array of strings
slug: string (unique)
published: date
organiser: string (optional)
cost: array of strings (optional)
url: string (optional)
review: string (optional)
getInvolved: string (optional)
```

#### Services (servicesMdx)
```yaml
title: string
category: array of strings
slug: string (unique)
published: date
provider: string (optional)
price: string (optional)
url: string (optional)
whatsappUrl: string (optional)
review: string (optional)
```

#### Products (productsMdx)
```yaml
title: string
price: string (optional)
country: array of strings
category: array of strings
slug: string (unique)
published: date
features: array of strings (optional)
url: string (optional)
review: string (optional)
```

#### Stays (staysMdx)
```yaml
title: string
country: array of strings
locale: array of strings
category: array of strings
slug: string (unique)
published: date
facilities: array of strings (optional)
url: string (optional)
review: string (optional)
```

## 🎨 Rich Content Features

### HTML & Tailwind CSS
Use any HTML tags with Tailwind CSS classes for beautiful formatting:

```html
<div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500 my-6">
  <h4 className="text-green-800 font-semibold mb-3">🌱 Eco Tip</h4>
  <p className="text-green-700">Your environmental tip here!</p>
</div>
```

### Code Blocks
Support for syntax highlighting in multiple languages:

```javascript
const example = {
  language: "JavaScript",
  highlighting: true,
  theme: "GitHub"
};
```

### Tables
Create beautiful responsive tables:

| Feature | Notion | MDX |
|---------|--------|-----|
| HTML Support | ❌ | ✅ |
| React Components | ❌ | ✅ |
| Rich Formatting | Limited | Full |
| Code Highlighting | Basic | Advanced |

### Interactive Elements
- Collapsible sections
- Tabbed content  
- Image galleries
- Custom React components

## 🔄 Content Workflow

### Option 1: Notion-First (Existing)
1. Create content in Notion
2. Publish via Notion API
3. Content appears on site

### Option 2: MDX-First (New)
1. Create `.mdx` file in `/content/[type]/`
2. Add frontmatter and content
3. Commit to repository
4. Content appears on site

### Option 3: Hybrid Approach
- Use Notion for quick content creation
- Use MDX for content requiring rich HTML/components
- Both appear seamlessly on the same site

## 🛠️ Technical Implementation

### Content Collections (src/content.config.ts)
- Dual loaders: `notionLoader` + `glob` loader
- Schema validation for both sources
- Automatic type generation

### Page Templates
- Unified data handling for both sources
- Automatic source detection (`notion` vs `mdx`)
- Data normalization for consistent layouts

### URL Structure
- Notion content: Uses existing slug structure
- MDX content: Uses frontmatter `slug` field
- No conflicts between sources

## 📝 Content Migration

### From Notion to MDX
1. Export Notion page as Markdown
2. Add proper frontmatter
3. Enhance with HTML/components as needed
4. Save as `.mdx` file

### Bulk Operations
- Multiple MDX files can be added simultaneously
- Batch import/export tools can be developed
- Git-based workflow for content versioning

## 🚀 Production Deployment

### Build Process
1. Notion API fetches published content
2. MDX files are processed with glob loader
3. Both sources compile to static pages
4. Seamless integration in final build

### Performance
- Static generation for both sources
- No runtime overhead
- Full SEO optimization
- Fast page loads

## 🔍 Troubleshooting

### Common Issues

**MDX file not appearing:**
- Check frontmatter syntax (YAML format)
- Ensure `published` date is set
- Verify `slug` is unique
- Check file extension is `.mdx`

**Build errors:**
- Validate frontmatter against schema
- Check for syntax errors in MDX content
- Ensure all required fields are present

**Styling issues:**
- Use `className` instead of `class`
- Ensure Tailwind classes are available
- Check component imports

### Debug Commands
```bash
# Test content structure
npm run build

# Check specific collection
# (Add to package.json if needed)
npm run content:validate
```

## 🎯 Next Steps

### Immediate Use
1. Start creating MDX content in `/content/` folders
2. Use rich HTML formatting for better presentation
3. Add interactive components as needed

### Future Enhancements
- Custom MDX components library
- Content management UI for MDX files
- Advanced templating system
- Multi-language support

## 📖 Resources

- [MDX Documentation](https://mdxjs.com/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Notion API](https://developers.notion.com/)

---

**🎉 Your site now supports both Notion API and rich MDX content!**

Start creating amazing content with full HTML and React component support while keeping your existing Notion workflow intact.