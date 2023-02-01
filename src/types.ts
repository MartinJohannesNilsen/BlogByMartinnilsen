import gsap from "gsap";
import { ReactNode } from "react";

// Object types
export type EditorJSDocument = {
  time?: number;
  blocks: [];
  version?: string;
};

export type EditorjsRendererProps = {
  data: {
    text?: string;
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
    content?: [[string]];
    // Personality
    name?: string;
    description?: string;
    photo?: string;
    // Checklist
    items?: [
      {
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
  };
  style: {};
  classNames: {};
  config: {};
};

export type BlogpostCardProps = {
  title: string;
  timestamp: number;
  summary: string;
  image: string;
  type: string;
  tags: string[];
  id: string;
};

export type Post = {
  published: boolean;
  type: string;
  tags: string[];
  title: string;
  summary: string;
  image: string;
  data: EditorJSDocument;
  author: string;
  timestamp: number;
  views: number;
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
};

export type NavbarSection = {
  name: string;
  path: string;
};

export type NavbarProps = {
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
};

export type ScrollTriggerProps = {
  markers?: boolean;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  x?: string;
  y?: string;
  trigger?: gsap.DOMTarget;
  children?: ReactNode;
};

export type SettingsModalProps = {
  open: boolean;
  handleModalOpen: () => void;
  handleModalClose: () => void;
  handleThemeChange: (event: any) => void;
};

// View props types
export type ManageArticleViewProps = {
  fetch?: boolean;
};
export type ReadArticleViewProps = {};
export type LandingViewProps = {};
export type ListViewProps = {};
export type FooterProps = {};
