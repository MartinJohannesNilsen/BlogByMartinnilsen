// Constants

export const Reactions = {
	THUMBS_UP: "👍",
	THUMBS_DOWN: "👎",
	LAUGH: "😄",
	HOORAY: "🎉",
	CONFUSED: "😕",
	HEART: "❤️",
	ROCKET: "🚀",
	EYES: "👀",
} as const;

export const availableThemes = [
	"light",
	"light_high_contrast",
	"light_protanopia",
	"light_tritanopia",
	"dark",
	"dark_high_contrast",
	"dark_protanopia",
	"dark_tritanopia",
	"dark_dimmed",
	"preferred_color_scheme",
	"transparent_dark",
	"noborder_light",
	"noborder_dark",
	"noborder_gray",
	"cobalt",
	"purple_dark",
	"custom",
] as const;

// Interfaces

export interface IUser {
	avatarUrl: string;
	login: string;
	url: string;
}

export interface IMetadataMessage {
	discussion: IDiscussionData;
	viewer: IUser;
}

export type IReactionGroups = {
	[key in keyof typeof Reactions]: {
		count: number;
		viewerHasReacted: boolean;
	};
};

export interface IDiscussionData {
	id: string;
	url: string;
	locked: boolean;
	repository: {
		nameWithOwner: string;
	};
	reactionCount: number;
	totalCommentCount: number;
	totalReplyCount: number;
	reactions: IReactionGroups;
}

export interface ISetConfigMessage {
	setConfig: {
		theme?: (typeof availableThemes)[number] | `/${string}` | `https://${string}`;
		repo?: string;
		repoId?: string;
		category?: string;
		categoryId?: string;
		term?: string;
		description?: string;
		backLink?: string;
		number?: number;
		strict?: boolean;
		reactionsEnabled?: boolean;
		emitMetadata?: boolean;
		inputPosition?: "top" | "bottom";
		lang?: "en";
	};
}
