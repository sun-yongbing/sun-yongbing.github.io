import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

export type LearningNote = {
  slug: string;
  title: string;
  theme: "AI" | "投资金融" | "技能";
  status: "探索中" | "实践中" | "已沉淀";
  summary: string;
  tags: string[];
  related: string[];
  next: string;
  updatedAt: string;
  body: string[];
};

export type Hike = {
  slug: string;
  title: string;
  place: string;
  date: string;
  lat: number;
  lng: number;
  tags: string[];
  summary: string;
  image: string;
  body: string[];
};

export type Photo = {
  slug: string;
  title: string;
  category: string;
  date: string;
  place: string;
  description: string;
  image: string;
  body: string[];
};

export type AboutProfile = {
  eyebrow: string;
  title: string;
  intro: string;
  name: string;
  role: string;
  email: string;
  focuses: string[];
  recording: string;
  statementTitle: string;
  future: string;
  body: string[];
};

type FrontMatter = Record<string, string | string[]>;

const contentRoot = path.join(process.cwd(), "content");

function asList(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

function asText(value: string | string[] | undefined, field: string, file: string) {
  if (typeof value === "string" && value.trim()) return value.trim();
  throw new Error(`Missing ${field} in ${file}`);
}

function parseValue(value: string): string | string[] {
  const trimmed = value.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      return JSON.parse(trimmed.replace(/'/g, '"')) as string[];
    } catch {
      return trimmed.slice(1, -1).split(",").map((item) => item.trim()).filter(Boolean);
    }
  }
  return trimmed.replace(/^(["'])(.*)\1$/, "$2");
}

function parseMarkdown(file: string) {
  const raw = readFileSync(file, "utf8").replace(/^\uFEFF/, "");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`Invalid front matter in ${file}`);

  const frontMatter: FrontMatter = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*)$/);
    if (field) frontMatter[field[1]] = parseValue(field[2]);
  }

  const body = match[2]
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.replace(/\r?\n/g, " ").trim())
    .filter(Boolean);

  return { frontMatter, body };
}

function collectionFiles(directory: string) {
  return readdirSync(path.join(contentRoot, directory))
    .filter((file) => /\.mdx?$/.test(file))
    .sort();
}

export const notes: LearningNote[] = collectionFiles("notes").map((file) => {
  const { frontMatter, body } = parseMarkdown(path.join(contentRoot, "notes", file));
  return {
    slug: file.replace(/\.mdx?$/, ""),
    title: asText(frontMatter.title, "title", file),
    theme: asText(frontMatter.theme, "theme", file) as LearningNote["theme"],
    status: asText(frontMatter.status, "status", file) as LearningNote["status"],
    summary: asText(frontMatter.summary, "summary", file),
    tags: asList(frontMatter.tags),
    related: asList(frontMatter.related),
    next: asText(frontMatter.next, "next", file),
    updatedAt: asText(frontMatter.updatedAt, "updatedAt", file),
    body,
  };
});

export const hikes: Hike[] = collectionFiles("hikes").map((file) => {
  const { frontMatter, body } = parseMarkdown(path.join(contentRoot, "hikes", file));
  return {
    slug: file.replace(/\.mdx?$/, ""),
    title: asText(frontMatter.title, "title", file),
    place: asText(frontMatter.place, "place", file),
    date: asText(frontMatter.date, "date", file),
    lat: Number(asText(frontMatter.lat, "lat", file)),
    lng: Number(asText(frontMatter.lng, "lng", file)),
    tags: asList(frontMatter.tags),
    summary: asText(frontMatter.summary, "summary", file),
    image: asText(frontMatter.image, "image", file),
    body,
  };
});

export const photos: Photo[] = collectionFiles("photos").map((file) => {
  const { frontMatter, body } = parseMarkdown(path.join(contentRoot, "photos", file));
  return {
    slug: file.replace(/\.mdx?$/, ""),
    title: asText(frontMatter.title, "title", file),
    category: asText(frontMatter.category, "category", file),
    date: asText(frontMatter.date, "date", file),
    place: asText(frontMatter.place, "place", file),
    description: asText(frontMatter.description, "description", file),
    image: asText(frontMatter.image, "image", file),
    body,
  };
});

const aboutContent = parseMarkdown(path.join(contentRoot, "about.md"));
export const about: AboutProfile = {
  eyebrow: asText(aboutContent.frontMatter.eyebrow, "eyebrow", "about.md"),
  title: asText(aboutContent.frontMatter.title, "title", "about.md"),
  intro: asText(aboutContent.frontMatter.intro, "intro", "about.md"),
  name: asText(aboutContent.frontMatter.name, "name", "about.md"),
  role: asText(aboutContent.frontMatter.role, "role", "about.md"),
  email: asText(aboutContent.frontMatter.email, "email", "about.md"),
  focuses: asList(aboutContent.frontMatter.focuses),
  recording: asText(aboutContent.frontMatter.recording, "recording", "about.md"),
  statementTitle: asText(aboutContent.frontMatter.statementTitle, "statementTitle", "about.md"),
  future: asText(aboutContent.frontMatter.future, "future", "about.md"),
  body: aboutContent.body,
};

export const getNote = (slug: string) => notes.find((item) => item.slug === slug);
export const getHike = (slug: string) => hikes.find((item) => item.slug === slug);
export const getPhoto = (slug: string) => photos.find((item) => item.slug === slug);
