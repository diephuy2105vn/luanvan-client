import { Filter1Outlined } from "@mui/icons-material";
import {
	Box,
	Button,
	Checkbox,
	IconButton,
	ListItem,
	Menu,
	styled,
	Typography,
} from "@mui/material";
import React, { ReactElement } from "react";

type ChildrenProps = {
	key: string;
	value: string | boolean;
	label: string;
};

type ItemProps = {
	key: string;
	value: string | boolean;
	label: string;
	name?: string;
	children?: ChildrenProps[];
	icon?: React.ElementType;
};

export type FilterType = {
	[key: string]: string | boolean;
};

const StyledMenu = styled(Menu)({});

const Filter = ({
	label,
	filter,
	setFilter,
	items,
	icon,
	size = "medium",
}: {
	filter: FilterType;
	setFilter: React.Dispatch<React.SetStateAction<FilterType>>;
	items: ItemProps[];
	icon?: React.ElementType;
	label?: string;
	name?: string;
	size?: "small" | "medium" | "large";
}) => {
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const Icon = icon;
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<>
			<Button
				startIcon={Icon && <Icon />}
				variant="contained"
				size={size}
				sx={{
					minWidth: "40px",
					whiteSpace: "nowrap",
					".MuiButton-startIcon": !label
						? {
								margin: 0,
						  }
						: {},
				}}
				onClick={handleOpen}>
				{label}
			</Button>
			<Menu
				id="lock-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				sx={{
					".MuiList-root": {
						padding: "4px 0",
					},
				}}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						minWidth: "120px",
					}}>
					{label && (
						<Typography
							sx={(theme) => ({
								color: theme.palette.grey[500],
								fontSize:
									size === "large"
										? "1.6rem"
										: size === "small"
										? "1.2rem"
										: "1.4rem",
								padding: "4px 12px",
								borderBottom: "1px solid #ccc",
							})}>
							{label}
						</Typography>
					)}
					<Box
						sx={{
							display: "flex",
							flexDirection: "column",
							justifyItems: "center",
							width: "100%",
							"& .MuiBox-root:not(:first-of-type)": {
								borderTop: "1px solid #ccc",
							},
						}}>
						{items?.map((item: ItemProps) => {
							return (
								<Box
									key={item.key}
									sx={{
										padding: "8px 12px",
										display: "flex",
										alignItems: "center",
										gap:
											size === "large"
												? "10px"
												: size === "small"
												? "6px"
												: "8px",
									}}
									onClick={(_e) => {
										setFilter((pre) => ({
											...pre,
											[item.name as string]: item.value,
										}));
									}}>
									<Checkbox
										sx={{
											padding: 0,
											".MuiSvgIcon-root": {
												fontSize:
													size === "large"
														? "2.0rem"
														: size === "small"
														? "1.6rem"
														: "1.8rem",
											},
										}}
										name={item.name}
										value={item.value}
										checked={
											item?.name
												? filter[item.name] ===
												  item.value
												: false
										}
									/>
									<Typography
										whiteSpace="nowrap"
										sx={{
											fontSize:
												size === "large"
													? "1.6rem"
													: size === "small"
													? "1.2rem"
													: "1.4rem",
										}}>
										{item.label}
									</Typography>
									{item.icon && (
										<item.icon
											sx={{
												fontSize:
													size === "large"
														? "2.0rem"
														: size === "small"
														? "1.6rem"
														: "1.8rem",
											}}
										/>
									)}
								</Box>
							);
						})}
					</Box>
				</Box>
			</Menu>
		</>
	);
};

export default Filter;
