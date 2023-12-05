import { OutputData } from "@editorjs/editorjs";
import { CSSProperties } from "@emotion/serialize";
import { ReactNode } from "react";

// Object types

export type EditorjsRendererProps = {
  data: {
    text?: string;
    // header
    level?: 1 | 2 | 3 | 4 | 5 | 6;
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
    // Iframe
    frame?: string;
    // Toggle
    status?: string;
    blocks?: any;
    // Code
    code?: string;
    language?: string;
    multiline?: boolean;
    linenumbers?: boolean;
    textwrap?: boolean;
    filename?: string;
    render?: boolean;
  };
  style: {
    boxMarginY?: number;
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

export type SharePreviewCardProps = {
  title: string;
  description: string;
  image: string;
  url: string;
  width: number;
  height: number;
};

export type PostCardProps = PostProps & {
  id: string;
};

type PostProps = {
  author: string;
  createdAt: number;
  description: string;
  image: string;
  updatedAt: number;
  published: boolean;
  readTime: string;
  tags: string[];
  title: string;
  type: string;
};

export type FullPost = PostProps & {
  data: OutputData;
};

export type FirestoreFullPost = PostProps & {
  data: string;
};

export type StoredPost = PostProps & {
  id: string;
};

export type TablePost = StoredPost & {
  views: number | string;
};

export type NavbarSection = {
  name: string;
  path: string;
};

export type NavbarProps = {
  posts?: StoredPost[];
  textColor?: string;
  backgroundColor: string;
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

export type ModalProps = {
  open: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
};

export type SettingsModalProps = ModalProps & {
  handleThemeChange: (event: any) => void;
};

export type ShareModalProps = ModalProps & {
  data: SharePreviewCardProps;
};

export type SearchModalProps = ModalProps & {
  postsOverview?: StoredPost[];
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
  headings: Headings[];
  currentSection: string;
  postTitle: string;
  sidebarMode?: boolean;
};

// View props types
export type ManageArticleViewProps = {
  post?: FullPost;
};
export type ReadArticleViewProps = { post: FullPost; postId: string };
export type LandingPageProps = { posts: StoredPost[] };
export type TagsPageProps = { posts: StoredPost[]; tags: string[] };
export type ListViewProps = {};
export type FooterProps = {};
