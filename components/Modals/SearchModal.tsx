import {
	Api,
	Clear,
	DarkMode,
	GridViewSharp,
	Home,
	KeyboardReturn,
	LightMode,
	Login,
	Logout,
	Notifications,
	Person,
	PostAdd,
	Settings,
	SettingsBrightness,
	TableRowsSharp,
	Tag,
	ViewCarousel,
	ViewWeekSharp,
} from "@mui/icons-material";
import {
	Avatar,
	Box,
	Modal,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	SvgIconTypeMap,
	TextField,
	useMediaQuery,
	InputAdornment,
	IconButton,
	ButtonBase,
	Typography,
	Button,
} from "@mui/material";
import { matchSorter } from "match-sorter";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { SearchModalProps, StoredPost } from "../../types";
import { DEFAULT_OGIMAGE } from "../SEO/SEO";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import useAuthorized from "../AuthorizationHook/useAuthorized";
import { signIn } from "next-auth/react";
import { userSignOut } from "../../utils/signOut";
import { ThemeEnum } from "../../styles/themes/themeMap";

type ActionProps = {
	title: string;
	onClick?: () => void;
	href?: string;
	requirement?: () => boolean;
	icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
		muiName: string;
	};
	id?: string;
};

export const SearchModal = (props: SearchModalProps) => {
	const { theme, setTheme, setDefaultTheme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
	const handleNavigate = (path: string) => {
		window.location.href = path;
	};
	const [textFieldValue, setTextFieldValue] = useState("");
	const [maxNumberOfItems, setMaxNumberOfItems] = useState(0);
	const [activeItem, setActiveItem] = useState(isMobile ? -1 : 0);
	const [matchedPosts, setMatchedPosts] = useState<StoredPost[]>([]);
	const [matchedActions, setMatchedActions] = useState<ActionProps[]>([]);
	const { isAuthorized, status } =
		process.env.NEXT_PUBLIC_LOCALHOST === "true"
			? {
					isAuthorized: true,
					status: "authenticated",
			  }
			: useAuthorized(false);
	const [isActions, setIsActions] = useState<boolean>(false);

	const actions: ActionProps[] = [
		{ title: "Go to landing page", href: "/", icon: Home },
		{ title: "Go to tag page", href: "/tags", icon: Tag },
		{
			title: "Go to account page",
			href: "/account",
			icon: Person,
			requirement: () => {
				return status === "authenticated";
			},
		},
		{
			title: "Create post",
			href: "/create",
			icon: PostAdd,
			requirement: () => {
				return isAuthorized;
			},
		},
		{
			title: "Go to API documentation",
			href: "/apidoc",
			icon: Api,
			requirement: () => {
				return isAuthorized;
			},
		},
		{
			title: "Open settings",
			onClick: () => {},
			icon: Settings,
			requirement: () => {
				return props.handleSettingsModalOpen != null;
			},
		},
		{
			title: "Open notifications",
			onClick: () => {},
			icon: Notifications,
			requirement: () => {
				return props.handleNotificationsModalOpen != null;
			},
		},
		{
			title: "Remove locally stored data",
			onClick: () => {
				localStorage.clear();
			},
			icon: Clear,
		},
		{
			title: "Sign in",
			onClick: () => {
				signIn();
			},
			icon: Login,
			requirement: () => {
				return status === "authenticated";
			},
		},
		{
			title: "Sign out",
			onClick: () => {
				userSignOut(window.location.pathname === "/account" ? "/" : null, true);
			},
			icon: Logout,
			requirement: () => {
				return status !== "authenticated";
			},
		},
		{
			title: "Theme: Set to light",
			onClick: () => {
				setTheme(ThemeEnum.Light, true);
			},
			icon: LightMode,
		},
		{
			title: "Theme: Set to dark",
			onClick: () => {
				setTheme(ThemeEnum.Dark, true);
			},
			icon: DarkMode,
		},
		{
			title: "Theme: Set to system default",
			onClick: () => {
				setDefaultTheme();
			},
			icon: SettingsBrightness,
		},
		{
			title: "Layout: Switch to carousel view",
			onClick: () => {
				props.setCardLayout("carousel");
			},
			icon: ViewWeekSharp,
			requirement: () => {
				return props.setCardLayout != null;
			},
		},
		{
			title: "Layout: Switch to swipe view",
			onClick: () => {
				props.setCardLayout("swipe");
			},
			icon: ViewCarousel,
			requirement: () => {
				return props.setCardLayout != null;
			},
		},
		{
			title: "Layout: Switch to grid view",
			onClick: () => {
				props.setCardLayout("grid");
			},
			icon: GridViewSharp,
			requirement: () => {
				return props.setCardLayout != null;
			},
		},
		{
			title: "Layout: Switch to list view",
			onClick: () => {
				props.setCardLayout("list");
			},
			icon: TableRowsSharp,
			requirement: () => {
				return props.setCardLayout != null;
			},
		},
	];

	// Actions on enter
	const handleEnterClickPosts = (post: StoredPost) => {
		handleNavigate(`/posts/${post.id}`);
	};
	const handleEnterClickActions = (action: ActionProps) => {
		if (action.onClick) {
			action.onClick();
		}
		if (action.href) handleNavigate(action.href);
	};

	// Filter/search
	useEffect(() => {
		if (isActions) {
			const bestMatch = matchSorter(
				actions.filter(action => action.requirement == null || action.requirement() === true),
				textFieldValue,
				{
					keys: ["title"],
				}
			);
			// const min = Math.min(bestMatch.length, actions.length);
			const min = Math.min(bestMatch.length, Number(process.env.NEXT_PUBLIC_SEARCH_MAX_RESULTS));
			setMatchedActions(bestMatch.slice(0, min));
			setMaxNumberOfItems(min);
			if (!isMobile) setActiveItem(-1);
		} else {
			if (textFieldValue === "") {
				setMatchedPosts([]);
				setMaxNumberOfItems(0);
			} else {
				const bestMatch = matchSorter(props.postsOverview!, textFieldValue, {
					keys: ["title", "description"],
				});
				const min = Math.min(bestMatch.length, Number(process.env.NEXT_PUBLIC_SEARCH_MAX_RESULTS));
				setMatchedPosts(bestMatch.slice(0, min));
				setMaxNumberOfItems(min);
				if (!isMobile) setActiveItem(-1);
			}
		}
		return () => {};
	}, [textFieldValue]);

	// Hotkeys
	useHotkeys(["Control+k", "Meta+k"], event => {
		event.preventDefault();
		props.handleModalClose();
	});
	useHotkeys(
		"ArrowUp",
		() => {
			setActiveItem(Math.max(0, activeItem - 1));
		},
		[activeItem]
	);
	useHotkeys(
		"ArrowDown",
		() => {
			setActiveItem(Math.min(maxNumberOfItems - 1, activeItem + 1));
		},
		[activeItem]
	);
	useHotkeys(
		"Enter",
		() => {
			props.handleModalClose();
			setTextFieldValue("");
			if (isActions) {
				handleEnterClickActions(matchedActions![activeItem]);
			} else {
				handleEnterClickPosts(matchedPosts![activeItem]);
			}
		},
		[activeItem]
	);
	useHotkeys(
		"Tab",
		() => {
			setTextFieldValue("");
			setIsActions(!isActions);
		},
		[]
	);

	const modalStyle = {
		bgcolor: "background.paper",
		border: "1px solid " + (theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.grey[600]),
		borderRadius: 2,
		display: "flex",
		textAlign: "left",
		flexDirection: "column",
		rowGap: (isActions && matchedActions.length !== 0) || (!isActions && matchedPosts.length !== 0) ? "5px" : null,
		justifyContent: "flex-start",
		boxShadow: 24,
		p: 1,
		outline: 0,
	};

	return (
		<Box>
			<Modal
				open={props.open}
				onClose={props.handleModalClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
				disableAutoFocus
			>
				<Box
					sx={{
						position: "fixed",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: xs ? 370 : lgUp ? 700 : 550,
						height: "450px",
						outline: 0,
					}}
				>
					<Box sx={modalStyle}>
						{/* Search bar */}
						<Box>
							<TextField
								variant="filled"
								fullWidth
								autoFocus
								placeholder={isActions ? "Search for actions" : "What are you looking for?"}
								size="small"
								autoComplete="off"
								value={textFieldValue}
								InputProps={{
									disableUnderline: true,
									endAdornment: (
										<InputAdornment position="end">
											<ButtonBase
												disabled
												sx={{
													color: theme.palette.grey[800],
													backgroundColor: theme.palette.secondary.main,
													p: "2px 8px",
													opacity: 0.9,
													borderRadius: 1,
													border:
														"1px solid " +
														(theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[200]),
												}}
												// aria-label="toggle password visibility"
												// onClick={() => {
												// 	setIsActions(!isActions);
												// 	setTextFieldValue("");
												// }}
											>
												<Typography variant="body1" sx={{ fontWeight: 600 }}>
													⇥ {isActions ? "Posts" : "Actions"}
												</Typography>
											</ButtonBase>
										</InputAdornment>
									),
								}}
								inputProps={{
									style: {
										fontFamily: theme.typography.fontFamily,
										fontSize: xs ? 22 : 28,
										fontWeight: 400,
										padding: "4px 12px",
									},
								}}
								sx={{ paddingBottom: 0 }}
								InputLabelProps={{ style: { fontSize: xs ? 22 : 28 } }}
								onKeyDown={e => {
									if ((e.metaKey && e.key === "k") || (e.ctrlKey && e.key === "k")) {
										e.preventDefault();
										props.handleModalClose();
									} else if (e.key === "ArrowUp") {
										e.preventDefault();
										setActiveItem(Math.max(0, activeItem - 1));
									} else if (e.key === "ArrowDown") {
										e.preventDefault();
										setActiveItem(Math.min(maxNumberOfItems - 1, activeItem + 1));
									} else if (e.key === "Enter") {
										props.handleModalClose();
										setTextFieldValue("");
										if (isActions) {
											handleEnterClickActions(matchedActions![activeItem]);
										} else {
											handleEnterClickPosts(matchedPosts![activeItem]);
										}
									} else if (e.key === "Tab") {
										setIsActions(!isActions);
										setTextFieldValue("");
									}
								}}
								onChange={e => {
									setTextFieldValue(e.target.value);
								}}
							/>
						</Box>
						{/* Posts option */}
						{isActions ? (
							<List sx={{ paddingY: 0, maxHeight: 297, overflowY: "scroll" }}>
								{matchedActions!.map((action: ActionProps, index: number) => (
									<ListItem
										key={index}
										sx={{
											padding: "2px 0px 2px 0px",
										}}
									>
										<ListItemButton
											selected={activeItem === index}
											onMouseOver={() => {
												setActiveItem(index);
											}}
											sx={{
												paddingLeft: "8px",
												"&.Mui-selected": {
													backgroundColor:
														activeItem === index
															? theme.palette.mode === "dark"
																? "#2B2B2B"
																: theme.palette.grey[300]
															: "transparent",
												},
												"&.Mui-selected:hover": {
													backgroundColor:
														activeItem === index
															? theme.palette.mode === "dark"
																? "#2B2B2B"
																: theme.palette.grey[300]
															: "transparent",
												},
												"&.Mui-focusVisible": {
													backgroundColor:
														activeItem === index
															? theme.palette.mode === "dark"
																? "#2B2B2B"
																: theme.palette.grey[300]
															: "transparent",
												},
												":hover": {
													backgroundColor:
														activeItem === index
															? theme.palette.mode === "dark"
																? "#2B2B2B"
																: theme.palette.grey[300]
															: "transparent",
												},
											}}
											component="a"
											href={action.href}
											onClick={() => {
												props.handleModalClose();
												setTextFieldValue("");
												if (isMobile) setActiveItem(-1);
												if (action.onClick) action.onClick();
											}}
										>
											<ListItemAvatar>
												<Avatar
													sx={{
														marginRight: "12px",
														borderRadius: "5px",
														// minWidth: xs ? "70px" : "124px",
														// minHeight: xs ? "50px" : "70px",
														background: "transparent",
													}}
												>
													<action.icon sx={{ color: theme.palette.text.primary }} />
												</Avatar>
											</ListItemAvatar>
											<ListItemText
												primary={action.title}
												primaryTypographyProps={{
													color: theme.palette.text.primary,
													fontFamily: theme.typography.fontFamily,
													fontWeight: "600",
													whiteSpace: "nowrap",
													textOverflow: "ellipsis",
													overflow: "hidden",
												}}
												// secondary={post.description}
												// secondaryTypographyProps={{
												// 	color: theme.palette.text.primary,
												// 	fontFamily: theme.typography.fontFamily,
												// 	whiteSpace: "nowrap",
												// 	textOverflow: "ellipsis",
												// 	overflow: "hidden",
												// }}
												sx={{
													width: "100%",
													marginRight: isMobile ? 0 : 5,
												}}
											/>
											{!isMobile ? (
												<>
													<Box flexGrow={100} />
													<ListItemText>
														<KeyboardReturn
															sx={{
																color: theme.palette.text.primary,
																position: "absolute",
																top: "55%",
																right: "5px",
																transform: "translate(-50%, -50%)",
																display: activeItem === index ? "inline-block" : "none",
															}}
														/>
													</ListItemText>
												</>
											) : null}
										</ListItemButton>
									</ListItem>
								))}
							</List>
						) : (
							props.postsOverview && (
								<List sx={{ paddingY: 0 }}>
									{matchedPosts!.map((post: StoredPost, index: number) => (
										<ListItem
											key={index}
											sx={{
												padding: "2px 0px 2px 0px",
											}}
										>
											<ListItemButton
												selected={activeItem === index}
												onMouseOver={() => {
													setActiveItem(index);
												}}
												sx={{
													paddingLeft: "8px",
													"&.Mui-selected": {
														backgroundColor:
															activeItem === index
																? theme.palette.mode === "dark"
																	? "#2B2B2B"
																	: theme.palette.grey[300]
																: "transparent",
													},
													"&.Mui-selected:hover": {
														backgroundColor:
															activeItem === index
																? theme.palette.mode === "dark"
																	? "#2B2B2B"
																	: theme.palette.grey[300]
																: "transparent",
													},
													"&.Mui-focusVisible": {
														backgroundColor:
															activeItem === index
																? theme.palette.mode === "dark"
																	? "#2B2B2B"
																	: theme.palette.grey[300]
																: "transparent",
													},
													":hover": {
														backgroundColor:
															activeItem === index
																? theme.palette.mode === "dark"
																	? "#2B2B2B"
																	: theme.palette.grey[300]
																: "transparent",
													},
												}}
												component="a"
												href={`/posts/${post.id}`}
												onClick={() => {
													props.handleModalClose();
													setTextFieldValue("");
													if (isMobile) setActiveItem(-1);
												}}
											>
												<ListItemAvatar>
													<Avatar
														sx={{
															marginRight: "12px",
															borderRadius: "5px",
															minWidth: xs ? "70px" : "124px",
															minHeight: xs ? "50px" : "70px",
															background: "transparent",
														}}
													>
														<img
															src={post.image || DEFAULT_OGIMAGE}
															alt={'OpenGraph image for article titled "' + post.title + '"'}
															style={{
																minWidth: "125px",
																minHeight: "82px",
																objectFit: "cover",
															}}
														/>
													</Avatar>
												</ListItemAvatar>
												<ListItemText
													primary={post.title}
													primaryTypographyProps={{
														color: theme.palette.text.primary,
														fontFamily: theme.typography.fontFamily,
														fontWeight: "600",
														whiteSpace: "nowrap",
														textOverflow: "ellipsis",
														overflow: "hidden",
													}}
													secondary={post.description}
													secondaryTypographyProps={{
														color: theme.palette.text.primary,
														fontFamily: theme.typography.fontFamily,
														whiteSpace: "nowrap",
														textOverflow: "ellipsis",
														overflow: "hidden",
													}}
													sx={{
														width: "100%",
														marginRight: isMobile ? 0 : 5,
													}}
												/>
												{!isMobile ? (
													<>
														<Box flexGrow={100} />
														<ListItemText>
															<KeyboardReturn
																sx={{
																	color: theme.palette.text.primary,
																	position: "absolute",
																	top: "55%",
																	right: "5px",
																	transform: "translate(-50%, -50%)",
																	display: activeItem === index ? "inline-block" : "none",
																}}
															/>
														</ListItemText>
													</>
												) : null}
											</ListItemButton>
										</ListItem>
									))}
								</List>
							)
						)}
					</Box>
				</Box>
			</Modal>
		</Box>
	);
};
export default SearchModal;
