"use client";

import BotCard from "@/components/card/BotCard";
import Header from "@/components/common/Header";
import CustomSearch from "@/components/common/Search";
import FormBot from "@/components/form/FormBot";
import useBreakpoint from "@/hooks/useBreakpoins";
import { BotBase, BotCreate, defaultBotCreate, defaultBots } from "@/types/bot";
import {
	ArrowDownward,
	ArrowDropDown,
	Expand,
	ExpandMore,
} from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	Container,
	Grid,
	styled,
	TextField,
	Typography,
} from "@mui/material";
import Link from "next/link";
import { useState } from "react";

const StyledFormLogin = styled("form")({
	display: "flex",
	flexDirection: "column",
	gap: "16px",
});

const Page = () => {
	const [bots, setBots] = useState<BotBase[]>(defaultBots);
	const [creatingBot, setCreatingBot] = useState<BotCreate | BotBase>(
		defaultBotCreate
	);
	const [searchValue, setSearchValue] = useState("");
	const breakpoint = useBreakpoint();
	const [account, setAccount] = useState({ username: "", password: "" });
	return (
		<Container
			sx={{
				height: "100vh",
			}}
			maxWidth={false}>
			<Grid
				container
				alignItems="center"
				justifyContent="flex-end"
				sx={{ height: "100%" }}>
				<Grid item xs={12} sm={8} md={4.5}>
					<Card sx={{ padding: "20px" }}>
						<StyledFormLogin>
							<Typography
								variant="h4"
								component="h4"
								color="secondary"
								sx={{
									marginBottom: "16px",
									fontWeight: 500,
								}}>
								Đăng ký
							</Typography>
							<TextField
								fullWidth
								value={account.username}
								onChange={(e) =>
									setAccount((pre) => ({
										...pre,
										username: e.target.value,
									}))
								}
								label="Tên tài khoản"
								placeholder="Vui lòng nhập tài khoản"
								required
							/>
							<TextField
								fullWidth
								value={account.password}
								onChange={(e) =>
									setAccount((pre) => ({
										...pre,
										password: e.target.value,
									}))
								}
								label="Mật khẩu"
								placeholder="Vui lòng nhập mật khẩu tối thiểu 8 kí tự"
								required
							/>
							<TextField
								fullWidth
								value={account.password}
								onChange={(e) =>
									setAccount((pre) => ({
										...pre,
										password: e.target.value,
									}))
								}
								label="Xác nhận mật khẩu"
								placeholder="Vui lòng xác nhận mật khẩu"
								required
							/>

							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
								}}>
								<Box
									sx={{
										display: "flex",
										justifyContent: "flex-start",
										alignItems: "center",
									}}>
									<Typography
										sx={{
											color: (theme) =>
												theme.palette.grey[700],
										}}>
										Bạn đã có tài khoản?
									</Typography>
									<Button
										variant="text"
										component={Link}
										size="small"
										href="/login"
										color="secondary"
										sx={{
											fontSize: "1.6rem",
											marginLeft: "4px",
											fontWeight: 500,
										}}>
										Đăng nhập
									</Button>
								</Box>
								<Box
									sx={{
										display: "flex",
										justifyContent: "flex-end",
										marginTop: "8px",
									}}>
									<Button variant="contained">Đăng ký</Button>
								</Box>
							</Box>
						</StyledFormLogin>
					</Card>
				</Grid>
			</Grid>
		</Container>
	);
};

export default Page;
