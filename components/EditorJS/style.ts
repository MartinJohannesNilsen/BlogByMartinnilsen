import { Theme } from "@mui/material";

// All valid JSX inline styles are allowed
export const style = (theme: Theme) => {
	return {
		paragraph: {
			...theme.typography.body1,
		},
		header: {},
		image: {
			// img: {},
			// figure: {},
			// figcaption: {}
		},
		video: {
			video: { maxHeight: "400px" },
			//   figure: {...},
			//   figcaption: {...}
		},
		embed: {
			figure: {
				height: "auto",
				width: "auto",
				marginY: theme.spacing(1),
			},
			figcaption: {
				marginTop: "8px",
				fontSize: theme.typography.body2.fontSize,
				opacity: 0.8,
				// backgroundColor: "green",
				// fontFamily: theme.typography.fontFamily,
				// fontWeight: "400",
			},
		},
		list: {
			//   container: {...},
			//   listItem: {...},
		},
		checklist: {
			//   container: {...},
			//   item: {...},
			//   checkbox: {...},
			//   label: {...},
		},
		table: {
			//   table: {...},
			//   tr: {...},
			//   th: {...},
			//   td: {...},
		},
		quote: {
			//   container: {...},
			//   content: {...},
			//   author: {...},
			//   message: {...}
		},
		codeBox: {
			//   container: {...},
			//   code: {...},
		},
		warning: {
			//   container: {...},
			//   icon: {...},
			//   title: {...},
			//   message: {...},
		},
		delimiter: {
			//   container: {...},
			//   svg: {...},
			//   path: {...}
		},
		personality: {
			container: {
				// margin: "25px 0px",
			},
			//   textHolder: {...},
			name: {
				// fontSize: "22px",
				// fontFamily: theme.typography.fontFamily,
				// fontWeight: "800",
			},
			description: {
				// fontSize: "18px",
				// fontFamily: theme.typography.fontFamily,
				// fontWeight: "400",
			},
			photo: {
				// height: "100%",
				// width: "120px",
				// paddingBottom: "-10px",
				// marginBottom: "-10px",
			},
			link: {
				// fontSize: "18px",
				// fontFamily: theme.typography.fontFamily,
				// fontWeight: "400",
			},
		},
		linkTool: {
			container: {
				// margin: "25px 0px",
			},
			//   textHolder: {...},
			name: {
				// fontSize: "22px",
				// fontFamily: theme.typography.fontFamily,
				// fontWeight: "800",
			},
			description: {
				// fontSize: "18px",
				// fontFamily: theme.typography.fontFamily,
				// fontWeight: "400",
			},
			//   image: {...},
			//   siteName: {...}
		},
	};
};
