import { OutputData } from "@editorjs/editorjs";
import { SvgIconTypeMap, SxProps, Theme } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { CSSProperties, MutableRefObject, ReactNode } from "react";
import { IconType } from "react-icons/lib";
import { ThemeEnum } from "./styles/themes/themeMap";

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
		highlightLines?: number[];
		// Callout
		icon?: string;
		type?: string;
		title?: string;
		message?: string;
		// Image
		height?: number;
		width?: number;
		blurhash?: string;
		fileref?: string;
		fileSize?: number;
	};
	style?: {
		typography?: SxProps;
		box?: SxProps;
		h1?: CSSProperties;
		h2?: CSSProperties;
		h3?: CSSProperties;
		h4?: CSSProperties;
		h5?: CSSProperties;
		h6?: CSSProperties;
	};
	classNames?: {
		h1?: string;
		h2?: string;
		h3?: string;
		h4?: string;
		h5?: string;
		h6?: string;
	};
	config?: { disableDefaultStyle?: any };
};

export type BlurHashImageProps = {
	blurhash: { encoded: string; height?: number; width?: number; punch?: number };
	src: string;
	alt: string;
	style: CSSProperties;
};

export type IconProps = {
	fill?: string;
	height?: string | number;
	width?: string | number;
	style?: CSSProperties;
	alt?: string;
};

export type SearchActionProps = {
	title: string;
	iconElement: JSX.Element;
	keywords: string[];
	onClick?: () => void;
	href?: string;
	requirement?: () => boolean;
	id?: string;
};

export type EditorBlockProps = {
	data?: OutputData;
	onChange(val: OutputData): void;
	holder: string;
};

export type ButtonBarProps = {
	buttons: ButtonBarButtonProps[];
	sx?: SxProps & {};
	ref?: MutableRefObject<any>;
	className?: string;
};

export type ButtonBarButtonProps = {
	fetched?: boolean;
	icon?:
		| (OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
				muiName: string;
		  })
		| IconType;
	text?: string;
	onClick?: (() => void) | ((event: React.MouseEvent<HTMLElement>) => void);
	href?: string;
	disabled?: boolean;
};

export type BlockToolQuoteDataProps = {
	text: string;
	caption: string;
};
export type BlockToolQuoteProps = {
	data: BlockToolQuoteDataProps;
	onDataChange: (arg0: any) => void;
	readOnly: boolean;
};

export type BlockToolImageDataProps = {
	type: string; // url, upload, unsplash, paste?
	url: string;
	caption: string;
	blurhash: string;
	height: number;
	width: number;
	fileRef?: string;
	fileSize?: number;
	// unsplash?: { author: string; profileLink: string };
};
export type BlockToolImageProps = {
	data: BlockToolImageDataProps;
	onDataChange: (arg0: any) => void;
	readOnly: boolean;
};

export type BlockToolCodeBlockDataProps = {
	code: string;
	language: string;
	multiline: boolean;
	linenumbers: boolean;
	textwrap: boolean;
	filename: string;
	caption: string;
	render: boolean;
	highlightLines: number[];
};
export type BlockToolCodeBlockProps = {
	data: BlockToolCodeBlockDataProps;
	onDataChange: (arg0: any) => void;
	readOnly: boolean;
};

export type BlockToolCalloutDataProps = {
	type: string;
	message: string;
	title?: string;
	icon?: string;
};
export type BlockToolCalloutProps = {
	data: BlockToolCalloutDataProps;
	onDataChange: (arg0: any) => void;
	readOnly: boolean;
};

export type SessionUser = {
	name?: string | null | undefined;
	email?: string | null | undefined;
	image?: string | null | undefined;
	role?: string | null | undefined;
};

export type AccountCardProps = {
	sessionUser?: SessionUser;
	isAuthorized: boolean;
};

export type SharePreviewCardProps = {
	title: string;
	description: string;
	ogImage: ImageProps;
	url: string;
	width: number;
	height: number;
};

export type TileButtonCardProps = {
	icon: any;
	text: string;
	href?: string;
	onClick?: () => void;
	disabled?: boolean;
	showBadge?: boolean;
};

export type PostCardProps = PostProps & {
	id: string;
	views: any;
};

export type ImageProps = {
	src: string;
	blurhash?: string;
	height?: number;
	width?: number;
	fileRef?: string;
	fileSize?: number;
};

type PostProps = {
	author: string;
	createdAt: number;
	description: string;
	ogImage: ImageProps;
	updatedAt?: number;
	published: boolean;
	readTime: string;
	tags: string[];
	keywords: string[];
	title: string;
	type: string;
};

export type FullPost = PostProps & {
	data: OutputData;
};

export type FirestoreFullPost = PostProps & {
	data: any;
};

export type StoredPost = PostProps & {
	id: string;
};

export type TablePost = StoredPost & {
	views: number | string;
};

export type PostTableProps = ModalProps & {
	postsOverview: StoredPost[];
};

export type PostViewsProps = {
	viewCount?: number;
	sx?: {};
};

export type NavbarProps = {
	posts?: StoredPost[];
	setCardLayout?: (layout: "carousel" | "swipe" | "grid" | "list") => void;
	ref?: MutableRefObject<undefined>;
	className?: string;
	isAuthorized: boolean;
	centeredPadding?: boolean;
};

export type PostNavbarProps = {
	post: FullPost & { id: string };
	postsOverview?: StoredPost[];
	toc: { content: string; currentSection: string };
	setCardLayout?: (layout: "carousel" | "swipe" | "grid" | "list") => void;
	tocModal: { open: boolean; setOpen: (value: boolean) => void };
	shareModal: { open: boolean; setOpen: (value: boolean) => void };
	ref?: MutableRefObject<undefined>;
	className?: string;
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

export type ThemeContextType = {
	theme: Theme;
	setTheme: (Theme: ThemeEnum, persist?: boolean) => void;
	setDefaultTheme: () => void;
	accentColor: string;
	setAccentColor: (accent: string) => void;
	fontFamily: string;
	setFontFamily: (font: string) => void;
};

export type directionType = "left" | "right" | "up" | "down";
export type TinderSwipeType = {
	posts: StoredPost[];
	views: any;
};

export type SelectContentProps = {
	value: any;
	setValue: (value: any) => void;
	children?: JSX.Element[];
};

export type UnreadFunctionProps = {
	allNotificationsFilteredOnDate: NotificationProps[];
	allNotificationsFilteredOnDateIds: number[];
	unreadNotifications: NotificationProps[];
	unreadNotificationsIds: number[];
	hasUnreadNotifications: boolean;
};

// Menus

export type OptionMenuProps = {
	icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
		muiName: string;
	};
	text?: string;
	menuItems: OptionMenuItem[];
};
export type OptionMenuItem = {
	text: string;
	onClick: () => void;
	disabled?: boolean;
};

export type MenuProps = {
	open: boolean;
	handleMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
	handleMenuClose: () => void;
	anchorEl?: null | HTMLElement;
	setAnchorEl?: React.Dispatch<React.SetStateAction<null | HTMLElement>>;
};

export type ProfileMenuProps = MenuProps & {
	accountButtonSx?: SxProps;
	showNotificationsBadge?: boolean;
	notifications?: ModalProps;
	settings?: ModalProps;
	about?: ModalProps;
};

// Modals

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
	extraActions?: SearchActionProps[];
	postsOverview?: StoredPost[];
	handleSettingsModalOpen?: () => void;
	handleNotificationsModalOpen?: () => void;
	notificationsBadgeVisible?: boolean;
	setCardLayout?: (layout: string) => void;
	onOpen?: () => void;
};

export type Headings = {
	type: string;
	id: string | null;
	text: string;
};

export type TOCModalProps = ModalProps & {
	headings: Headings[];
	currentSection: string;
	postTitle: string;
	sidebarMode?: boolean;
};

export type NotificationProps = {
	id: number;
	createdAt: string;
	title: string;
	content: string;
	action: {
		href: string;
		caption: string;
	};
	important: boolean;
};

export type NotificationsModalProps = ModalProps & {
	setVisibleBadgeNotifications: (value: boolean) => void;
};

// Buttons
export type ButtonProps = {
	variant: "outline" | "base";
	icon?:
		| (OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
				muiName: string;
		  })
		| IconType;
	text?: string;
	onClick?: (() => void) | ((event: React.MouseEvent<HTMLElement>) => void);
	href?: string | undefined;
	disabled?: boolean;
	sxButton?: SxProps & {};
	sxIcon?: SxProps & {};
	sxText?: SxProps & {};
	styleIcon?: CSSProperties;
	tooltip?: string;
	ariaControls?: string;
	ariaHasPopup?: any;
	ariaExpanded?: any;
	type?: "button" | "submit" | "reset";
	LinkComponent?: any;
	replace?: any;
};

export type NavigatorShareProps = {
	url?: string; // The URL of the webpage you want to share
	title?: string; // The title of the shared content, although may be ignored by the target
	text: string; // The description or text to accompany the shared content
	icon?: string; // URL of the image for the preview
	fallback?: () => void; // Fallback method
};

// export type SearchButtonProps = ButtonProps;

export type CustomThemeProviderProps = {
	children: React.ReactNode;
};

// Page types
export type LandingPageProps = {};
export type ReadPostPageProps = {
	post: FullPost;
	postId: string;
	postsOverview?: StoredPost[];
	isAuthorized: boolean;
};
export type ManagePostPageProps = {
	post?: FullPost;
	id?: string;
};
export type TagsPageProps = { posts: StoredPost[]; tags: string[]; isAuthorized: boolean };
export type FooterProps = {};
export type ServerPageProps = {
	sessionUser?: SessionUser;
	isAuthorized: boolean;
	postsOverview?: StoredPost[];
};
