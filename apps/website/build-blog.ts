import fs from "fs/promises";
import path from "path";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";

interface PostMeta {
  title?: string;
  date?: string;
  description?: string;
  tags?: string[];
  [key: string]: any;
}

interface BlogPost {
  slug: string;
  meta: PostMeta;
  content: string;
}

interface ProcessedPost extends PostMeta {
  slug: string;
  url: string;
}

class BlogBuilder {
  private md: MarkdownIt;
  private postsDir: string;
  private outputDir: string;
  private templateDir: string;

  constructor(
    postsDir = "src/blog/posts",
    outputDir = "dist/blog",
    templateDir = "src/blog/templates"
  ) {
    this.postsDir = postsDir;
    this.outputDir = outputDir;
    this.templateDir = templateDir;

    this.md = new MarkdownIt({
      html: true,
      breaks: false,
      linkify: true,
      highlight: (str: string, lang: string): string => {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(str, { language: lang }).value;
          } catch (err) {
            console.warn(
              `Failed to highlight code block with language "${lang}":`,
              err
            );
          }
        }
        return this.md.utils.escapeHtml(str);
      },
    });
  }

  async build(): Promise<void> {
    try {
      console.log("🚀 Building blog...");

      // Ensure output directory exists
      await fs.mkdir(this.outputDir, { recursive: true });

      // Copy CSS file if it exists
      await this.copyCSSFile();

      // Process all markdown files
      const posts = await this.processMarkdownFiles();

      // Generate individual post pages
      await this.generatePostPages(posts);

      // Generate blog index page
      await this.generateBlogIndex(posts);

      // Generate blog index JSON for API consumption
      await this.generateBlogIndexJSON(posts);

      console.log(
        `✅ Blog built successfully! Generated ${posts.length} posts.`
      );
    } catch (error) {
      console.error("❌ Failed to build blog:", error);
      throw error;
    }
  }

  private async processMarkdownFiles(): Promise<BlogPost[]> {
    const files = await fs.readdir(this.postsDir);
    const posts: BlogPost[] = [];

    for (const file of files) {
      if (file.endsWith(".md")) {
        try {
          const filePath = path.join(this.postsDir, file);
          const content = await fs.readFile(filePath, "utf-8");
          const slug = file.replace(".md", "");

          const { meta, markdown } = this.parseFrontmatter(content);

          posts.push({
            slug,
            meta: {
              title: meta.title || this.slugToTitle(slug),
              ...meta,
            },
            content: markdown,
          });
        } catch (error) {
          console.warn(`⚠️  Failed to process ${file}:`, error);
        }
      }
    }

    // Sort posts by date (newest first)
    return posts.sort((a, b) => {
      const dateA = new Date(a.meta.date || "1970-01-01");
      const dateB = new Date(b.meta.date || "1970-01-01");
      return dateB.getTime() - dateA.getTime();
    });
  }

  private parseFrontmatter(content: string): {
    meta: PostMeta;
    markdown: string;
  } {
    const frontmatterRegex = /^---\s*\n(.*?)\n---\s*\n(.*)$/s;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return { meta: {}, markdown: content };
    }

    const [, frontmatterStr, markdown] = match;
    const meta: PostMeta = {};

    frontmatterStr.split("\n").forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) return;

      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();

      if (key === "tags") {
        // Handle tags as array
        meta[key] = value.split(",").map((tag) => tag.trim());
      } else {
        meta[key] = value;
      }
    });

    return { meta, markdown };
  }

  private async generatePostPages(posts: BlogPost[]): Promise<void> {
    const template = await this.loadTemplate("post.html");

    for (const post of posts) {
      const html = this.md.render(post.content);
      const finalHtml = this.renderTemplate(template, {
        title: post.meta.title!,
        content: html,
        date: this.formatDate(post.meta.date),
        description: post.meta.description || "",
        tags: post.meta.tags?.join(", ") || "",
      });

      const outputPath = path.join(this.outputDir, `${post.slug}.html`);
      await fs.writeFile(outputPath, finalHtml);
    }
  }

  private async generateBlogIndex(posts: BlogPost[]): Promise<void> {
    try {
      const template = await this.loadTemplate("index.html");
      const postsHtml = posts
        .map((post) => this.renderPostPreview(post))
        .join("\n");

      const finalHtml = this.renderTemplate(template, {
        title: "Blog",
        posts: postsHtml,
        content: postsHtml,
      });

      const outputPath = path.join(this.outputDir, "index.html");
      await fs.writeFile(outputPath, finalHtml);
    } catch (error) {
      console.warn(
        "⚠️  No index.html template found, skipping blog index page generation"
      );
    }
  }

  private async generateBlogIndexJSON(posts: BlogPost[]): Promise<void> {
    const processedPosts: ProcessedPost[] = posts.map((post) => ({
      slug: post.slug,
      url: `/blog/${post.slug}.html`,
      title: post.meta.title!,
      date: post.meta.date,
      description: post.meta.description,
      tags: post.meta.tags,
    }));

    const outputPath = path.join(this.outputDir, "index.json");
    await fs.writeFile(outputPath, JSON.stringify(processedPosts, null, 2));
  }

  private async loadTemplate(templateName: string): Promise<string> {
    const templatePath = path.join(this.templateDir, templateName);
    return await fs.readFile(templatePath, "utf-8");
  }

  private renderTemplate(
    template: string,
    variables: Record<string, string>
  ): string {
    let result = template;

    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = new RegExp(`{{${key}}}`, "g");
      result = result.replace(placeholder, value || "");
    });

    return result;
  }

  private renderPostPreview(post: BlogPost): string {
    const date = this.formatDate(post.meta.date);
    const tags = post.meta.tags?.length
      ? `<div class="tags">${post.meta.tags
          .map((tag) => `<span class="tag">${tag}</span>`)
          .join("")}</div>`
      : "";

    return `
      <article class="post-preview">
        <h2><a href="blog/${post.slug}.html">${post.meta.title}</a></h2>
        ${date ? `<time datetime="${post.meta.date}">${date}</time>` : ""}
        ${
          post.meta.description
            ? `<p class="description">${post.meta.description}</p>`
            : ""
        }
        ${tags}
      </article>
    `;
  }

  private formatDate(dateStr?: string): string {
    if (!dateStr) return "";

    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  private slugToTitle(slug: string): string {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  private async copyCSSFile(): Promise<void> {
    try {
      const cssSource = path.join(this.templateDir, "styles.css");
      const cssDestination = path.join(this.outputDir, "styles.css");
      await fs.copyFile(cssSource, cssDestination);
    } catch {
      console.warn(
        "⚠️  No styles.css found in templates directory, skipping CSS copy"
      );
    }
  }
}

// Export the builder class and a default build function
export { BlogBuilder };

export async function buildBlog(): Promise<void> {
  const builder = new BlogBuilder();
  await builder.build();
}

// If running directly with ts-node or tsx
if (import.meta.url === `file://${process.argv[1]}`) {
  buildBlog().catch(console.error);
}
