"use client";
import {
	Api,
	Bookmark,
	Brush,
	Clear,
	DarkMode,
	GridViewSharp,
	Home,
	Info,
	KeyboardReturn,
	LightMode,
	Login,
	Logout,
	Notifications,
	Person,
	PostAdd,
	RssFeed,
	Settings,
	SettingsBrightness,
	TableRowsSharp,
	Tag,
	ViewCarousel,
	ViewWeekSharp,
} from "@mui/icons-material";
import {
	Avatar,
	Badge,
	Box,
	ButtonBase,
	InputAdornment,
	List,
	ListItem,
	ListItemAvatar,
	ListItemButton,
	ListItemText,
	Modal,
	TextField,
	Typography,
	useMediaQuery,
} from "@mui/material";
import { matchSorter } from "match-sorter";
import { signIn } from "next-auth/react";
import NextLink from "next/link";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "../../../styles/themes/ThemeProvider";
import { ThemeEnum } from "../../../styles/themes/themeMap";
import { SearchActionProps, SearchModalProps, StoredPost } from "../../../types";
import { userSignOut } from "../../../utils/signOut";
import BlurHashHTMLImage from "../Image/BlurHashHTMLImage";

export const SearchModal = ({
	open,
	handleModalOpen,
	handleModalClose,
	extraActions,
	postsOverview,
	handleSettingsModalOpen,
	handleNotificationsModalOpen,
	notificationsBadgeVisible,
	setCardLayout,
	onOpen,
	isAuthorized,
	sessionUser,
}: SearchModalProps) => {
	const { theme, setTheme, setDefaultTheme } = useTheme();
	const xs = useMediaQuery(theme.breakpoints.only("xs"));
	const lgUp = useMediaQuery(theme.breakpoints.up("lg"));
	const handleNavigate = (path: string) => {
		window.location.href = path;
	};
	const textFieldRef = useRef(null);
	const [textFieldValue, setTextFieldValue] = useState("");
	const [maxNumberOfItems, setMaxNumberOfItems] = useState(0);
	const [activeItem, setActiveItem] = useState(isMobile ? -1 : 0);
	const [matchedPosts, setMatchedPosts] = useState<StoredPost[]>([]);
	const [matchedActions, setMatchedActions] = useState<SearchActionProps[]>([]);
	const [isActions, setIsActions] = useState<boolean>(false);
	let actions: SearchActionProps[] = [
		{
			title: "Go to landing page",
			// href: "/",
			keywords: ["home", "return", "back", "posts"],
			iconElement: <Home sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return window.location.pathname !== "/";
			},
		},
		{
			title: "Go to tags page",
			href: "/tags",
			keywords: ["hashtags", "tags", "keywords", "categories"],
			iconElement: <Tag sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return !window.location.pathname.includes("/tags");
			},
		},
		{
			title: "Go to saved posts",
			href: "/tags?name=saved",
			keywords: ["saved", "bookmark", "favorite"],
			iconElement: <Bookmark sx={{ color: theme.palette.text.primary }} />,
		},
		{
			title: "Go to account page",
			href: "/account",
			keywords: ["account", "profile", "login", "settings"],
			iconElement: <Person sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return sessionUser ? !window.location.pathname.includes("/account") : false;
			},
		},
		{
			title: "Go to about page",
			href: "/about",
			keywords: ["about", "privacy", "terms", "donate", "services"],
			iconElement: <Info sx={{ color: theme.palette.text.primary }} />,
		},
		{
			title: "Go to design page",
			href: "/design",
			keywords: ["framework", "components", "ux", "ui"],
			iconElement: <Brush sx={{ color: theme.palette.text.primary }} />,
		},
		{
			title: "Subscribe to RSS feed (default)",
			href: "/feed/rss.xml",
			keywords: ["feed", "rss", "newsletter"],
			iconElement: <RssFeed sx={{ color: theme.palette.text.primary }} />,
		},
		{
			title: "Subscribe to JSON feed (rss.json)",
			href: "/feed/rss.json",
			keywords: ["feed", "rss", "newsletter"],
			iconElement: <RssFeed sx={{ color: theme.palette.text.primary }} />,
		},
		{
			title: "Subscribe to Atom feed (atom.xml)",
			href: "/feed/atom.xml",
			keywords: ["feed", "rss", "atom", "newsletter"],
			iconElement: <RssFeed sx={{ color: theme.palette.text.primary }} />,
		},
		{
			title: "Create post",
			href: "/create",
			keywords: ["create", "add", "write", "new", "post"],
			iconElement: <PostAdd sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return isAuthorized ? !window.location.pathname.includes("/create") : false;
			},
		},
		{
			title: "Go to API documentation",
			href: "/apidoc",
			keywords: ["api", "docs", "documentation"],
			iconElement: <Api sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return isAuthorized ? true : false;
			},
		},
		{
			title: "Open settings",
			onClick: () => {
				handleSettingsModalOpen && handleSettingsModalOpen();
			},
			keywords: ["settings", "configure", "tune", "accent", "color", "mode", "light", "dark", "font"],
			iconElement: <Settings sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return handleSettingsModalOpen != null;
			},
		},
		{
			title: "Open notifications",
			onClick: () => {
				handleNotificationsModalOpen && handleNotificationsModalOpen();
			},
			keywords: ["notifications", "messages"],
			iconElement: notificationsBadgeVisible ? (
				<Badge color="secondary" variant="dot" invisible={false} overlap="circular" badgeContent=" ">
					<Notifications sx={{ color: theme.palette.text.primary }} />
				</Badge>
			) : (
				<Notifications sx={{ color: theme.palette.text.primary }} />
			),
			requirement: () => {
				return handleNotificationsModalOpen != null;
			},
		},
		{
			title: "Remove locally stored data",
			onClick: () => {
				localStorage.clear();
				window.location.reload();
			},
			keywords: ["clear", "local", "storage", "data"],
			iconElement: <Clear sx={{ color: theme.palette.text.primary }} />,
		},
		{
			title: "Sign in",
			onClick: () => {
				signIn();
			},
			keywords: ["login", "log", "in"],
			iconElement: <Login sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return sessionUser ? false : true;
			},
		},
		{
			title: "Sign out",
			onClick: () => {
				userSignOut(window.location.pathname === "/account" ? "/" : undefined, true);
			},
			keywords: ["logout", "log", "out"],
			iconElement: <Logout sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return sessionUser ? true : false;
			},
		},
		{
			title: "Theme: Set to light",
			onClick: () => {
				setTheme(ThemeEnum.Light, true);
			},
			keywords: ["light", "mode", "theme"],
			iconElement: <LightMode sx={{ color: theme.palette.text.primary }} />,
		},
		{
			title: "Theme: Set to dark",
			onClick: () => {
				setTheme(ThemeEnum.Dark, true);
			},
			keywords: ["dark", "mode", "theme"],
			iconElement: <DarkMode sx={{ color: theme.palette.text.primary }} />,
		},
		{
			title: "Theme: Set to system default",
			onClick: () => {
				setDefaultTheme();
			},
			keywords: ["system", "mode", "theme", "default"],
			iconElement: <SettingsBrightness sx={{ color: theme.palette.text.primary }} />,
		},
		{
			title: "Layout: Switch to carousel view",
			onClick: () => {
				setCardLayout && setCardLayout("carousel");
			},
			keywords: ["layout", "carousel", "view", "cards"],
			iconElement: <ViewWeekSharp sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return setCardLayout != null;
			},
		},
		{
			title: "Layout: Switch to swipe view",
			onClick: () => {
				setCardLayout && setCardLayout("swipe");
			},
			keywords: ["layout", "swipe", "view", "cards"],
			iconElement: <ViewCarousel sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return setCardLayout != null;
			},
		},
		{
			title: "Layout: Switch to grid view",
			onClick: () => {
				setCardLayout && setCardLayout("grid");
			},
			keywords: ["layout", "grid", "view", "cards"],
			iconElement: <GridViewSharp sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return setCardLayout != null;
			},
		},
		{
			title: "Layout: Switch to list view",
			onClick: () => {
				setCardLayout && setCardLayout("list");
			},
			keywords: ["layout", "list", "view", "cards"],
			iconElement: <TableRowsSharp sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return setCardLayout != null;
			},
		},
	];
	if (extraActions) {
		actions = [...actions, ...extraActions];
	}

	// Animation
	const [isPulsating, setIsPulsating] = useState(false);
	const handlePulsate = () => {
		setIsPulsating(true);
		setTimeout(() => {
			setIsPulsating(false);
		}, 1500);
	};

	// Actions on enter
	const handleEnterClickPosts = () => {
		const post = matchedPosts![activeItem];
		handleNavigate(`/posts/${post.id}`);
	};
	const handleEnterClickActions = () => {
		const action = matchedActions![activeItem];
		if (action.onClick) {
			action.onClick();
			setMatchedActions([]);
			setActiveItem(isMobile ? -1 : 0);
		}
		if (action.href) handleNavigate(action.href);
		setIsActions(false);
	};

	// Filter/search
	useEffect(() => {
		if (isActions) {
			if (textFieldValue === "") {
				setMatchedActions([]);
				setMaxNumberOfItems(0);
			} else {
				const bestMatch = matchSorter(
					actions.filter((action) => action.requirement == null || action.requirement() === true),
					textFieldValue,
					{
						keys: [(item) => item.title, (item) => item.keywords],
					}
				);
				// const min = Math.min(bestMatch.length, actions.length);
				const min = Math.min(bestMatch.length, Number(process.env.NEXT_PUBLIC_SEARCH_MAX_RESULTS));
				setMatchedActions(bestMatch.slice(0, min));
				setMaxNumberOfItems(min);
				if (!isMobile) setActiveItem(-1);
			}
		} else {
			if (textFieldValue === "") {
				setMatchedPosts([]);
				setMaxNumberOfItems(0);
			} else {
				const bestMatch = matchSorter(postsOverview!, textFieldValue, {
					keys: ["title", "description", "type", "keywords", "tags"],
				});
				const min = Math.min(bestMatch.length, Number(process.env.NEXT_PUBLIC_SEARCH_MAX_RESULTS));
				setMatchedPosts(bestMatch.slice(0, min));
				setMaxNumberOfItems(min);
				if (!isMobile) setActiveItem(-1);
			}
		}
		return () => {};
	}, [textFieldValue]);

	onOpen &&
		useEffect(() => {
			if (open && onOpen) onOpen();
			const currentTextField: any = textFieldRef.current;
			if (currentTextField) {
				currentTextField.focus();
			}
			return () => {};
		}, [open, isActions]);

	// Hotkeys
	useHotkeys(["Control+k", "Meta+k"], (event) => {
		event.preventDefault();
		handleModalClose();
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
			handleModalClose();
			setTextFieldValue("");
			if (isActions) {
				handleEnterClickActions();
			} else {
				handleEnterClickPosts();
			}
		},
		[activeItem]
	);
	useHotkeys(
		"Tab",
		() => {
			const currentTextField: any = textFieldRef.current;
			if (currentTextField) {
				currentTextField.focus();
			}
			if (!isPulsating) {
				handlePulsate();
				setIsActions(!isActions);
				setTextFieldValue("");
			}
		},
		[]
	);

	const modalStyle = {
		bgcolor: "background.paper",
		borderRadius: 2,
		outline: "1px solid " + (theme.palette.mode === "dark" ? theme.palette.grey[800] : theme.palette.primary.main),
		display: "flex",
		textAlign: "left",
		flexDirection: "column",
		rowGap: (isActions && matchedActions.length !== 0) || (!isActions && matchedPosts.length !== 0) ? "5px" : null,
		justifyContent: "flex-start",
		boxShadow: 24,
		p: 1,
	};

	return (
		<Box>
			<Modal
				open={open}
				onClose={handleModalClose}
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
						".pulsate": {
							animation: "pulse 1.4s linear",
							borderRadius: "4px",
						},
						"@keyframes pulse": {
							"0%": {
								transform: "scale(1)",
								MozBoxShadow: "0 0 0 0 " + (theme.palette.secondary.main + "40"),
								boxShadow: "0 0 0 0 " + (theme.palette.secondary.main + "40"),
							},
							"5%": { transform: "scale(0.95)" },
							"10%": { transform: "scale(1)" },
							"60%": {
								MozBoxShadow: "0 0 0 40px " + (theme.palette.secondary.main + "00"),
								boxShadow: "0 0 0 40px " + (theme.palette.secondary.main + "00"),
							},
							"100%": {
								MozBoxShadow: "0 0 0 0 " + (theme.palette.secondary.main + "00"),
								boxShadow: "0 0 0 0 " + (theme.palette.secondary.main + "00"),
							},
						},
					}}
				>
					<Box className={`${isPulsating ? "pulsate" : ""}`}>
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
									inputRef={textFieldRef}
									InputProps={{
										disableUnderline: true,
										endAdornment: (
											<InputAdornment position="end">
												<ButtonBase
													LinkComponent={NextLink}
													disabled={!isMobile}
													sx={{
														color: theme.palette.grey[800],
														backgroundColor:
															theme.palette.secondary.main + (theme.palette.mode === "dark" ? "95" : "65"),
														p: "2px 8px",
														borderRadius: 1,
														boxShadow: "0 4px 10px 4px " + theme.palette.secondary.main + "37",
														backdropFilter: "blur(20px)",
														WebkitBackdropFilter: "blur( 20px )",
														border: "1px solid rgba( 255, 255, 255, 0.18 )",
													}}
													onClick={() => {
														const currentTextField: any = textFieldRef.current;
														if (currentTextField) {
															currentTextField.focus();
														}
														if (!isPulsating) {
															handlePulsate();
															setIsActions(!isActions);
															setTextFieldValue("");
														}
													}}
												>
													<Typography
														variant="body1"
														sx={{
															fontWeight: 600,
															fontSize: xs ? 12 : theme.typography.body1,
															fontFamily: theme.typography.fontFamily,
														}}
													>
														{!isMobile && "⇥"} {isActions ? "Posts" : "Actions"}
													</Typography>
												</ButtonBase>
											</InputAdornment>
										),
									}}
									inputProps={{
										style: {
											fontFamily: theme.typography.fontFamily,
											fontSize: xs ? 20 : 26,
											fontWeight: 400,
											padding: "4px 12px",
										},
									}}
									sx={{
										paddingBottom: 0,
										borderColor: "transparent",
									}}
									InputLabelProps={{ style: { fontSize: xs ? 20 : 26 } }}
									onKeyDown={(e) => {
										if ((e.metaKey && e.key === "k") || (e.ctrlKey && e.key === "k")) {
											e.preventDefault();
											handleModalClose();
										} else if (e.key === "ArrowUp") {
											e.preventDefault();
											setActiveItem(Math.max(0, activeItem - 1));
										} else if (e.key === "ArrowDown") {
											e.preventDefault();
											setActiveItem(Math.min(maxNumberOfItems - 1, activeItem + 1));
										} else if (e.key === "Enter") {
											handleModalClose();
											setTextFieldValue("");
											if (isActions) {
												handleEnterClickActions();
											} else {
												handleEnterClickPosts();
											}
										} else if (e.key === "Tab") {
											e.preventDefault();
											const currentTextField: any = textFieldRef.current;
											if (currentTextField) {
												currentTextField.focus();
											}
											if (!isPulsating) {
												handlePulsate();
												setIsActions(!isActions);
												setTextFieldValue("");
											}
										}
									}}
									onChange={(e) => {
										setTextFieldValue(e.target.value);
									}}
								/>
							</Box>
							{/* Posts option */}
							{isActions ? (
								// <List sx={{ paddingY: 0, maxHeight: 297, overflowY: "scroll" }}>
								<List sx={{ paddingY: 0 }}>
									{matchedActions!.map((action: SearchActionProps, index: number) => (
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
													handleModalClose();
													setTextFieldValue("");
													handleEnterClickActions();
												}}
											>
												<ListItemAvatar>
													<Avatar
														sx={{
															marginRight: "12px",
															borderRadius: "5px",
															backgroundColor: "transparent",
														}}
													>
														{action.iconElement}
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
													sx={{
														width: "100%",
														marginRight: isMobile ? 0 : 5,
													}}
												/>
												{!isMobile && (
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
												)}
											</ListItemButton>
										</ListItem>
									))}
								</List>
							) : (
								postsOverview && (
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
														handleModalClose();
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
															<BlurHashHTMLImage
																src={post.ogImage.src}
																blurhash={{ encoded: post.ogImage.blurhash! }}
																alt={'OpenGraph image for article titled "' + post.title + '"'}
																style={{
																	width: "125px",
																	height: "82px",
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
													{!isMobile && (
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
													)}
												</ListItemButton>
											</ListItem>
										))}
									</List>
								)
							)}
						</Box>
					</Box>
				</Box>
			</Modal>
		</Box>
	);
};
export default SearchModal;
