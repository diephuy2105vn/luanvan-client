"use client";

import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
	Avatar,
	Box,
	Chip,
	IconButton,
	Pagination,
	Typography,
} from "@mui/material";
import {
	AccessAlarmOutlined,
	AdminPanelSettings,
	AdminPanelSettingsOutlined,
	Cancel,
	CancelOutlined,
	CheckCircle,
	CheckCircleOutline,
	Delete,
	DeleteOutline,
	Download,
	DownloadOutlined,
	MoreVert,
} from "@mui/icons-material";
import CustomMenu, { MenuItemProps, MenuProps } from "../common/Menu";
import { useEffect, useRef, useState } from "react";
import { UserBase } from "@/types/user";
import { useParams } from "next/navigation";
import botApi from "@/api/botApi";
import {
	BotBase,
	getPermissionLabel,
	getPermissionsShortLabel,
	PermissionEnum,
	UserPermission,
} from "@/types/bot";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: `rgba(${theme.palette.secondary.rgb}, 0.2)`,
		color: theme.palette.common.black,
		fontWeight: 500,
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: 14,
	},
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
	"&:nth-of-type(odd)": {
		backgroundColor: `rgba(${theme.palette.secondary.rgb}, 0.05)`,
	},
	// hide last border
	"&:last-child td, &:last-child th": {
		border: 0,
	},
}));

export const UserCell = ({
	user,
	color,
	align = "left",
}: {
	user: UserBase;
	align?: "left" | "right" | "center";
	color?: "primary" | "secondary" | "info" | "warning" | "error";
}) => {
	const [avatar, setAvatar] = useState();

	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",

				justifyContent:
					align === "right"
						? "flex-end"
						: align === "center"
						? "center"
						: "flex-start",
				gap: "10px",
			}}>
			<Avatar sx={{ width: "28px", height: "28px" }} />
			<Typography
				sx={{
					color: (theme) =>
						color
							? theme.palette[color].main
							: theme.palette.common.black,
					fontSize: "1.4rem",
				}}>
				{user.full_name}
			</Typography>
		</Box>
	);
};

const UserPermissionTable = ({
	bot,
	userPermissions = [],
	menuItems,
	total,
	page,
	setPage,
}: {
	bot?: BotBase | null;
	userPermissions: UserPermission[];
	menuItems?: (item: UserPermission) => MenuItemProps[] | MenuItemProps[];
	total: number;
	page: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
}) => {
	const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

	const handleChangePage = (
		_event: React.ChangeEvent<unknown>,
		value: number
	) => {
		setAnchorEl(null);
		setPage(value);
	};

	return (
		<TableContainer component={Paper}>
			<Table sx={{ minWidth: 700 }}>
				<TableHead>
					<TableRow>
						<StyledTableCell>Thành viên</StyledTableCell>
						<StyledTableCell align="center">
							Xác nhận
						</StyledTableCell>
						<StyledTableCell align="right">Vai trò</StyledTableCell>

						<StyledTableCell></StyledTableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{userPermissions?.map((userPermission, index) => {
						const { user, permissions, confirm } = userPermission;

						return (
							<StyledTableRow key={userPermission?.user?._id}>
								<StyledTableCell component="th" scope="row">
									{user && <UserCell user={user} />}
								</StyledTableCell>
								<StyledTableCell align="center">
									{confirm ? (
										<CheckCircle color="success" />
									) : (
										<Cancel color="error" />
									)}
								</StyledTableCell>
								<StyledTableCell align="right">
									{bot && bot.owner === user?._id ? (
										<Chip
											key={"Owner"}
											sx={{
												marginLeft: "4px",
												".MuiChip-label": {
													padding: "4px 8px",
													fontSize: "1.4rem",
												},
											}}
											label="Sở hữu"
										/>
									) : (
										getPermissionsShortLabel(
											permissions
										).map((value) => (
											<Chip
												key={value}
												sx={{
													marginLeft: "4px",
													".MuiChip-label": {
														padding: "4px 8px",
														fontSize: "1.4rem",
													},
												}}
												label={value}
											/>
										))
									)}
								</StyledTableCell>
								<StyledTableCell align="center">
									{bot && bot.owner === user?._id ? (
										<></>
									) : (
										<>
											<IconButton
												ref={(el) => {
													buttonRefs.current[index] =
														el;
												}}
												onClick={(e) => {
													setAnchorEl(
														e.currentTarget
													);
												}}
												size="small">
												<MoreVert fontSize="small" />
											</IconButton>

											<CustomMenu
												size="small"
												items={
													menuItems
														? menuItems(
																userPermission
														  )
														: []
												}
												open={
													!!anchorEl &&
													anchorEl ===
														buttonRefs.current[
															index
														]
												}
												anchorEl={anchorEl}
												metaData={userPermission}
												onClose={() =>
													setAnchorEl(null)
												}
											/>
										</>
									)}
								</StyledTableCell>
							</StyledTableRow>
						);
					})}
				</TableBody>
			</Table>
			<Pagination
				count={total}
				page={page}
				onChange={handleChangePage}
				sx={{
					display: "flex",
					justifyContent: "center",
					padding: "16px 0",
				}}
			/>
		</TableContainer>
	);
};

export default UserPermissionTable;
