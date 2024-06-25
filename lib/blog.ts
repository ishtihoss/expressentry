import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

interface BlogPost {
  id: string;
  title: string;
  date: string;
  content?: string;
  contentHtml?: string;
}

const postsDirectory = path.join(process.cwd(), 'blog');

function getPostFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    console.warn(`Blog directory not found: ${postsDirectory}`);
    return [];
  }

  const files = fs.readdirSync(postsDirectory);
  console.log('Files in blog directory:', files);

  return files.filter(file => file.endsWith('.md'));
}

export function getSortedPostsData(): BlogPost[] {
  const postFiles = getPostFiles();

  if (postFiles.length === 0) {
    console.warn('No markdown files found in the blog directory');
    return [];
  }

  const allPostsData: BlogPost[] = postFiles.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      title: matterResult.data.title,
      date: matterResult.data.date,
    };
  });

  return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(id: string): Promise<BlogPost> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Blog post not found: ${id}`);
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    title: matterResult.data.title,
    date: matterResult.data.date,
    content: matterResult.content,
    contentHtml,
  };
}

export function getAllPostIds(): { params: { id: string } }[] {
  const postFiles = getPostFiles();
  return postFiles.map(fileName => ({
    params: {
      id: fileName.replace(/\.md$/, '')
    }
  }));
}