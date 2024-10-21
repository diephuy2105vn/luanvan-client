import botApi from "@/api/botApi";
import CustomMenu, { MenuItemProps } from "@/components/common/Menu";
import { getUser } from "@/config/redux/userReducer";
import { useAppSelector } from "@/hooks/common";
import { BotBase } from "@/types/bot";
import { getColorFromInitial, getInitials } from "@/utils";
import { Favorite, MoreVert } from "@mui/icons-material";
import { Avatar, Box, Card, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
	display: "flex",
	alignItems: "center",
	padding: theme.spacing(0.5),
	position: "relative",
	overflow: "inherit",
	marginTop: theme.spacing(3),
	borderRadius: theme.spacing(1),

	boxShadow: theme.shadows[1],

	"& .Card-thumbnail": {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		top: 0,
		width: "60px",
		height: "60px",
		transform: "translate(16px, -50%)",

		backgroundColor: "white",
		borderRadius: "50%",
		"& .MuiAvatar-root": {
			width: "52px",
			height: "52px",
			transition: `all ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
		},
		[theme.breakpoints.down("md")]: {
			left: "50%",
			transform: "translate(-50%, -50%)",
		},
	},
	"&:hover .Card-thumbnail": {
		"& .MuiAvatar-root": {
			width: "100%",
			height: "100%",
			transition: `all ${theme.transitions.duration.standard}ms ${theme.transitions.easing.easeInOut}`,
		},
	},
}));

const BotCard = ({
	bot,
	showMenu = false,
	menuItems = [],
}: {
	bot: BotBase;
	showMenu?: boolean;
	menuItems?: MenuItemProps[];
}) => {
	const [botValue, setBotValue] = useState(bot);
	const [avatarSrc, setAvatarSrc] = useState<string | ArrayBuffer | null>(
		null
	);
	const logedUser = useAppSelector((state) => getUser(state));
	//State Menu
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const openMenu = Boolean(anchorEl);

	const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation();
		event.preventDefault();
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleClickFavoriteBot = async () => {
		if (!botValue || !botValue._id) {
			return;
		}
		const res = await botApi.toggleFavorite(botValue._id);
		setBotValue(res as BotBase);
	};

	const backgroundColor = !botValue?.avatar_source
		? getColorFromInitial(botValue.name?.charAt(0))
		: undefined;

	const fetchAvatar = async () => {
		if (botValue?._id && botValue.avatar_source) {
			const res = await botApi.getAvatar(botValue?._id);
			const reader = new FileReader();

			reader.onloadend = () => {
				const base64data = reader.result;
				setAvatarSrc(base64data);
			};
			reader.readAsDataURL(res as Blob);
		}
	};

	useEffect(() => {
		setBotValue(bot);
		fetchAvatar();
	}, [bot._id]);

	return (
		<StyledCard>
			<Box className="Card-thumbnail">
				<Avatar
					src={avatarSrc ? (avatarSrc as string) : ""}
					sx={{
						backgroundColor: backgroundColor,
						width: "100%",
						height: "100%",
						color: "white",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}>
					{!avatarSrc && (
						<Typography fontSize={20} fontWeight={500}>
							{getInitials(bot?.name, 2)}
						</Typography>
					)}
				</Avatar>
			</Box>
			<Box
				sx={(theme) => ({
					display: "flex",
					justifyContent: "space-between",
					width: "100%",
					alignItems: "center",
					padding: {
						xs: `${theme.spacing(3.5)} 0 ${theme.spacing(
							1.5
						)} ${theme.spacing(1.5)}`,
						md: `${theme.spacing(2.5)} 0 ${theme.spacing(2)}
						 ${theme.spacing(2)}`,
					},
					flexDirection: "row",
				})}>
				<Typography
					sx={{
						fontWeight: "500",
						fontSize: { xs: "1.6rem", md: "1.8rem" },
					}}>
					{botValue.name}
				</Typography>

				<Box
					sx={(theme) => ({
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: { xs: "row" },
						padding: { xs: "4px 6px", md: "6px 12px" },
						borderRadius: {
							xs: "10px 0 0 10px",
							md: "16px 0 0 16px",
						},
						backgroundColor: theme.palette.secondary.main,
						color: "white",
						transform: "translateX(4px)",
					})}>
					{showMenu ? (
						<>
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									textAlign: "center",
								}}>
								<IconButton onClick={handleOpenMenu}>
									<MoreVert
										sx={{
											fontSize: {
												xs: "2rem",
												md: "2.4rem",
											},
											color: "white",
										}}
									/>
								</IconButton>
							</Box>
							<CustomMenu
								items={menuItems}
								open={openMenu}
								anchorEl={anchorEl}
								metaData={botValue}
								onClose={handleCloseMenu}
							/>
						</>
					) : (
						<>
							<IconButton
								onClick={(e) => {
									e.preventDefault();
									handleClickFavoriteBot();
								}}>
								<Favorite
									sx={{
										fontSize: {
											xs: "2rem",
											md: "2.4rem",
										},
										color: (theme) =>
											logedUser &&
											botValue.favorited_users.includes(
												logedUser._id
											)
												? theme.palette.primary.light
												: theme.palette.common.white,
									}}
								/>
							</IconButton>
							<Typography
								sx={{
									marginLeft: { xs: "4px", md: "8px" },
									color: "white",
									fontSize: { xs: "1.4rem", md: "1.6rem" },
								}}>
								{botValue.favorited_users.length}
							</Typography>
						</>
					)}
				</Box>
			</Box>
		</StyledCard>
	);
};

export default BotCard;
