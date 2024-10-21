import { Menu } from "@mui/icons-material";
import { Box, IconButton, styled, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

export const HEADER_HEIGHT_SM = 40;

const StyledIconButton = styled(IconButton)(({ theme }) => ({
	color: theme.palette.secondary.main,
	[theme.breakpoints.up("sm")]: {
		display: "none",
	},
}));
const pageTitles: { [key: string]: string } = {
	"": "Trang chủ",
	home: "Trang chủ",
	chat: "Trò chuyện",
	management: "Quản lý trợ lý AI",
	contact: "Liên Hệ",
};

const Header = ({
	openSidebar = null,
	handleOpenSidebar = null,
}: {
	openSidebar?: boolean | null;
	handleOpenSidebar?: (() => void) | null;
}) => {
	const pathname = usePathname();
	const arrPathname = pathname.split("/");
	const pageTitle = pageTitles[arrPathname[1]];

	return (
		<Box
			sx={{
				height: `${HEADER_HEIGHT_SM}px`,
				width: "100%",
				display: "flex",
				alignItems: "center",
			}}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: "8px",
				}}>
				{openSidebar !== null && (
					<StyledIconButton
						onClick={() =>
							handleOpenSidebar && handleOpenSidebar()
						}>
						<Menu sx={{ fontSize: "24px" }} />
					</StyledIconButton>
				)}
				<Typography
					variant={"h5"}
					fontWeight="500"
					color="secondary"
					gutterBottom>
					{pageTitle}
				</Typography>
			</Box>
		</Box>
	);
};

export default Header;
