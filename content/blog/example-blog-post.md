---
title: "Complete Blog Post Example with All Components"
date: "2025-06-01"
author: "Amar Kr. Gupta"
tags: ["tutorial", "markdown", "components"]
image: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg"
excerpt: "A comprehensive example showing all possible markdown components and features available in blog posts."
---

# Complete Blog Post Example

This is a comprehensive example showing all possible components and features available in blog posts.

## Text Formatting

You can use **bold**, *italic*, or ***both***. You can also use ~~strikethrough~~ text.

## Lists

### Unordered List
- Item 1
- Item 2
  - Nested item 1
  - Nested item 2
- Item 3

### Ordered List
1. First item
2. Second item
   1. Nested item
   2. Another nested item
3. Third item

## Code Blocks

Inline code: `const example = "hello world";`

```typescript
// types.ts
interface User {
  id: string;
  name: string;
  email: string;
}

// api.ts
function getUser(id: string): Promise<User> {
  return fetch(`/api/users/${id}`)
    .then(res => res.json());
}
```

## Blockquotes

> This is a blockquote
> It can span multiple lines
>> And can be nested

## Tables

| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Cell 1   | Cell 2   | Cell 3   |
| Cell 4   | Cell 5   | Cell 6   |

## Images

![Example Image](https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg)

## Links

[External Link](https://example.com)
[Internal Link](/blog/another-post)

## Diagrams (using Mermaid)

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

## Math Equations (using KaTeX)

Inline math: $E = mc^2$

Block math:
$$
\frac{n!}{k!(n-k)!} = \binom{n}{k}
$$

## Custom Components

:::info
This is an info box
:::

:::warning
This is a warning box
:::

:::success
This is a success box
:::

## Keyboard Shortcuts

Press <kbd>Ctrl</kbd> + <kbd>C</kbd> to copy

## Footnotes

Here's a sentence with a footnote[^1].

[^1]: This is the footnote content.

## Abbreviations

The HTML specification is maintained by the W3C.

*[HTML]: Hyper Text Markup Language
*[W3C]: World Wide Web Consortium

## Task Lists

- [x] Write the blog post
- [ ] Add more examples
- [x] Review content
- [ ] Publish

## Definition Lists

Term 1
: Definition 1

Term 2
: Definition 2a
: Definition 2b

## Horizontal Rule

---

## Conclusion

This example demonstrates all the components and features available in our blog posts. Use this as a reference when creating new content.