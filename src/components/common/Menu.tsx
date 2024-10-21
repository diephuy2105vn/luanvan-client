import React, { ElementType, SyntheticEvent, useEffect } from "react";
import {
	MenuProps as MuiMenuProps,
	Menu as MuiMenu,
	MenuItem,
	Divider,
	Typography,
	SvgIconTypeMap,
	Box,
} from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import Link from "next/link";
import { OverridableComponent } from "@mui/material/OverridableComponent";

type PaletteColor = keyof Theme["palette"];

export type MenuItemProps = {
	key: string;
	label: string;
	action?: (metaData?: any) => void;
	href?: string;
	icon?: ElementType;
	divider?: boolean;
	color?: PaletteColor;
	disabled?: boolean;
};

export type MenuProps = {
	items: MenuItemProps[];
	open: boolean;
	anchorEl: HTMLElement | null;
	onClose: (event?: object) => void;
	metaData?: any;
	size?: "large" | "medium" | "small";
	sx?: SxProps<Theme>;
} & Omit<MuiMenuProps, "open" | "anchorEl" | "onClose">;

const CustomMenu = ({
	items,
	open,
	anchorEl,
	onClose,
	metaData,
	size,
	...props
}: MenuProps) => {
	return (
		<MuiMenu
			anchorEl={anchorEl}
			open={open}
			onClose={(event: SyntheticEvent) => {
				event.stopPropagation();
				event.preventDefault();
				onClose(event);
			}}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
			{...props}>
			{items?.map((item) => (
				<Box key={item.key} sx={{ width: "100%", height: "100%" }}>
					<MenuItem
						key={item.key}
						component={item.href ? Link : "li"}
						href={item.href ? item.href : ""}
						onClick={(
							e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
						) => {
							item.action && item.action(metaData);
							onClose();
						}}
						disabled={item.disabled}
						color={item.color}
						sx={{
							display: "flex",
							alignItems: "center",
							gap: "8px",
							padding:
								size === "small"
									? "4px 8px"
									: size === "large"
									? "8px 12px"
									: "6px 10px",
							fontSize: size === "small" ? "1.4rem" : "1.6rem",
						}}>
						{item.icon && (
							<item.icon color={item.color} fontSize={size} />
						)}
						<Typography color={item.color}>{item.label}</Typography>
					</MenuItem>
					{item.divider && (
						<Divider
							sx={{
								marginTop: "0 !importance",
							}}
						/>
					)}
				</Box>
			))}
		</MuiMenu>
	);
};

export default CustomMenu;
