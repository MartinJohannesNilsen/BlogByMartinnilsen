import { OutputData } from "@editorjs/editorjs";
import { CSSProperties } from "@emotion/serialize";
import { ReactNode } from "react";

// Object types

export type EditorjsRendererProps = {
  data: {
    text?: string;
    // header
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    // Code
    language?: string;
    code?: string;
    // Video
    file?: {
      url?: string;
    };
    // Image
    url?: string;
    caption?: string;
    withBorder?: boolean;
    stretched?: boolean;
    withBackground?: boolean;
    unsplash?: {
      author?: string;
      profileLink?: string;
    };
    // LinkTool
    link?: string;
    meta?: {
      title?: string;
      description?: string;
      image?: string;
    };
    // Quote
    alignment?: string;
    // Table
    withHeadings?: boolean;
    content?: string;
    // content?: [[string]];
    // Personality
    name?: string;
    description?: string;
    photo?: string;
    // Checklist
    items?: [
      | string
      | {
          text?: string;
          checked?: boolean;
        }
    ];
    // Warning
    title?: string;
    message?: string;
    // Video
    autoplay?: boolean;
    controls?: boolean;
    muted?: boolean;
    // Math
    math?: string;
    // Lists
    style?: "ordered" | "unordered";
  };
  style: {
    h1?: CSSProperties;
    h2?: CSSProperties;
    h3?: CSSProperties;
    h4?: CSSProperties;
    h5?: CSSProperties;
    h6?: CSSProperties;
  };
  classNames: {
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
    h6?: string;
  };
  config: { disableDefaultStyle?: any };
};

export type BlogpostCardProps = {
  title: string;
  timestamp: number;
  summary: string;
  image: string;
  type: string;
  tags: string[];
  id: string;
  published: boolean;
};

export type Post = {
  published: boolean;
  type: string;
  tags: string[];
  title: string;
  summary: string;
  image: string;
  data: OutputData;
  author: string;
  timestamp: number;
  views: number;
  readTime: string;
};

export type FirestorePost = {
  published: boolean;
  type: string;
  tags: string[];
  title: string;
  summary: string;
  image: string;
  data: string;
  author: string;
  timestamp: number;
  views: number;
  readTime: string;
};

export type SimplifiedPost = {
  id: string;
  title: string;
  summary: string;
  image: string;
  published: boolean;
  timestamp: number;
  type: string;
  tags: string[];
  author: string;
  readTime: string;
};

export type NavbarSection = {
  name: string;
  path: string;
};

export type NavbarProps = {
  backgroundColor: string;
  textColor: string;
  posts: SimplifiedPost[];
};

// Component types

export type RevealProps = {
  markers?: boolean;
  repeat?: boolean;
  start?: string;
  x?: string;
  y?: string;
  children?: ReactNode;
  from_opacity?: number;
  to_opacity?: number;
  duration?: number;
  delay?: number;
};

export type SettingsModalProps = {
  open: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  handleThemeChange: (event: any) => void;
};

export type SearchModalProps = {
  open: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  postsOverview?: SimplifiedPost[];
};

export type Headings = {
  type: string;
  id: string | null;
  text: string;
};

export type TOCModalProps = {
  open: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  outputString: string;
  postTitle: string;
};

// View props types
export type ManageArticleViewProps = {
  post?: Post;
};
export type ReadArticleViewProps = { post: Post };
export type LandingPageProps = { posts: SimplifiedPost[] };
export type TagsPageProps = { posts: SimplifiedPost[]; tags: string[] };
export type ListViewProps = {};
export type FooterProps = {};