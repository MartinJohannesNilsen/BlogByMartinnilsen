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
import { motion } from "framer-motion";
import { matchSorter } from "match-sorter";
import { signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import { useHotkeys } from "react-hotkeys-hook";
import { useTheme } from "../../styles/themes/ThemeProvider";
import { ThemeEnum } from "../../styles/themes/themeMap";
import { SearchModalProps, StoredPost } from "../../types";
import { userSignOut } from "../../utils/signOut";
import useAuthorized from "../AuthorizationHook/useAuthorized";
import { DEFAULT_OGIMAGE } from "../SEO/SEO";

type ActionProps = {
	title: string;
	iconElement: JSX.Element;
	keywords: string[];
	onClick?: () => void;
	href?: string;
	requirement?: () => boolean;
	id?: string;
};

export const SearchModal = (props: SearchModalProps) => {
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
		{
			title: "Go to landing page",
			// href: "/",
			keywords: ["home", "return", "back", "posts"],
			iconElement: <Home sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return !window.location.pathname.includes("/");
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
			title: "Go to account page",
			href: "/account",
			keywords: ["account", "profile", "login", "settings"],
			iconElement: <Person sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return status === "authenticated" && !window.location.pathname.includes("/account");
			},
		},
		{
			title: "Create post",
			href: "/create",
			keywords: ["create", "add", "write", "new", "post"],
			iconElement: <PostAdd sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return isAuthorized && !window.location.pathname.includes("/create");
			},
		},
		{
			title: "Go to API documentation",
			href: "/apidoc",
			keywords: ["api", "docs", "documentation"],
			iconElement: <Api sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return isAuthorized;
			},
		},
		{
			title: "Open settings",
			onClick: () => {
				props.handleSettingsModalOpen();
			},
			keywords: ["settings", "configure", "tune"],
			iconElement: <Settings sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return props.handleSettingsModalOpen != null;
			},
		},
		{
			title: "Open notifications",
			onClick: () => {
				props.handleNotificationsModalOpen();
			},
			keywords: ["notifications", "messages"],
			iconElement: props.notificationsBadgeVisible ? (
				<Badge color="secondary" variant="dot" invisible={false} overlap="circular" badgeContent=" ">
					<Notifications sx={{ color: theme.palette.text.primary }} />
				</Badge>
			) : (
				<Notifications sx={{ color: theme.palette.text.primary }} />
			),
			requirement: () => {
				return props.handleNotificationsModalOpen != null;
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
				return status === "authenticated";
			},
		},
		{
			title: "Sign out",
			onClick: () => {
				userSignOut(window.location.pathname === "/account" ? "/" : null, true);
			},
			keywords: ["logout", "log", "out"],
			iconElement: <Logout sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return status !== "authenticated";
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
				props.setCardLayout("carousel");
			},
			keywords: ["layout", "carousel", "view", "cards"],
			iconElement: <ViewWeekSharp sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return props.setCardLayout != null;
			},
		},
		{
			title: "Layout: Switch to swipe view",
			onClick: () => {
				props.setCardLayout("swipe");
			},
			keywords: ["layout", "swipe", "view", "cards"],
			iconElement: <ViewCarousel sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return props.setCardLayout != null;
			},
		},
		{
			title: "Layout: Switch to grid view",
			onClick: () => {
				props.setCardLayout("grid");
			},
			keywords: ["layout", "grid", "view", "cards"],
			iconElement: <GridViewSharp sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return props.setCardLayout != null;
			},
		},
		{
			title: "Layout: Switch to list view",
			onClick: () => {
				props.setCardLayout("list");
			},
			keywords: ["layout", "list", "view", "cards"],
			iconElement: <TableRowsSharp sx={{ color: theme.palette.text.primary }} />,
			requirement: () => {
				return props.setCardLayout != null;
			},
		},
	];

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
		}
		if (action.href) handleNavigate(action.href);
		setIsActions(false);
	};

	// Filter/search
	useEffect(() => {
		if (isActions) {
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
		} else {
			if (textFieldValue === "") {
				setMatchedPosts([]);
				setMaxNumberOfItems(0);
			} else {
				const bestMatch = matchSorter(props.postsOverview!, textFieldValue, {
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

	props.onOpen &&
		useEffect(() => {
			if (props.open) props.onOpen();
			if (textFieldRef.current) {
				textFieldRef.current.focus();
			}
			return () => {};
		}, [props.open, isActions]);

	// Hotkeys
	useHotkeys(["Control+k", "Meta+k"], (event) => {
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
			if (textFieldRef.current) {
				textFieldRef.current.focus();
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
					<motion.div className={`${isPulsating ? "pulsate" : ""}`}>
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
														if (textFieldRef.current) {
															textFieldRef.current.focus();
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
									sx={{ paddingBottom: 0, borderColor: "transparent" }}
									InputLabelProps={{ style: { fontSize: xs ? 20 : 26 } }}
									onKeyDown={(e) => {
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
												handleEnterClickActions();
											} else {
												handleEnterClickPosts();
											}
										} else if (e.key === "Tab") {
											e.preventDefault();
											if (textFieldRef.current) {
												textFieldRef.current.focus();
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
					</motion.div>
				</Box>
			</Modal>
		</Box>
	);
};
export default SearchModal;
