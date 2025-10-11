import fs from "fs/promises";
import path from "path";
import MarkdownIt from "markdown-it";

interface CVMeta {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  youtube?: string;
  [key: string]: any;
}

interface CVData {
  meta: CVMeta;
  content: string;
}

class CVBuilder {
  private md: MarkdownIt;
  private cvFile: string;
  private outputDir: string;

  constructor(cvFile = "src/cv/cv.md", outputDir = "dist/cv") {
    this.cvFile = cvFile;
    this.outputDir = outputDir;

    this.md = new MarkdownIt({
      html: true,
      breaks: false,
      linkify: true,
    });
  }

  async build(): Promise<void> {
    try {
      console.log("🚀 Building CV...");

      // Ensure output directory exists
      await fs.mkdir(this.outputDir, { recursive: true });

      // Process the CV markdown file
      const cvData = await this.processCVFile();

      // Generate CV JSON for consumption by the app
      await this.generateCVJSON(cvData);

      console.log("✅ CV built successfully!");
    } catch (error) {
      console.error("❌ Failed to build CV:", error);
      throw error;
    }
  }

  private async processCVFile(): Promise<CVData> {
    const content = await fs.readFile(this.cvFile, "utf-8");
    const { meta, markdown } = this.parseFrontmatter(content);

    return {
      meta,
      content: markdown,
    };
  }

  private parseFrontmatter(content: string): {
    meta: CVMeta;
    markdown: string;
  } {
    const frontmatterRegex = /^---\s*\n(.*?)\n---\s*\n(.*)$/s;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return { meta: {}, markdown: content };
    }

    const [, frontmatterStr, markdown] = match;
    const meta: CVMeta = {};

    frontmatterStr.split("\n").forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex === -1) return;

      const key = line.slice(0, colonIndex).trim();
      const value = line.slice(colonIndex + 1).trim();

      meta[key] = value;
    });

    return { meta, markdown };
  }

  private async generateCVJSON(cvData: CVData): Promise<void> {
    const htmlContent = this.md.render(cvData.content);

    const output = {
      meta: cvData.meta,
      content: htmlContent,
      rawMarkdown: cvData.content,
    };

    const outputPath = path.join(this.outputDir, "cv.json");
    await fs.writeFile(outputPath, JSON.stringify(output, null, 2));
  }
}

// Export the builder class and a default build function
export { CVBuilder };

export async function buildCV(): Promise<void> {
  const builder = new CVBuilder();
  await builder.build();
}

// If running directly with ts-node or tsx
if (import.meta.url === `file://${process.argv[1]}`) {
  buildCV().catch(console.error);
}
