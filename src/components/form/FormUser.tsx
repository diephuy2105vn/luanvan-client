import useBreakpoint from "@/hooks/useBreakpoins";
import { UserBase } from "@/types/user";
import { Box, Grid, styled, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import UploadAvatar from "../upload/UploadAvatar";
import { Person } from "@mui/icons-material";
import userApi from "@/api/userApi";

const StyledForm = styled("form")(({ theme }) => ({
	width: "100%",
	height: "100%",
}));

const FormUser = ({
	user,
	setUser,
	disabled = false,
}: {
	user: UserBase | null;
	setUser: React.Dispatch<React.SetStateAction<UserBase | null>>;
	disabled?: boolean;
}) => {
	const breakpoint = useBreakpoint();
	const [avatarSrc, setAvatarSrc] = useState<string | ArrayBuffer | null>(
		null
	);
	const fetchAvatar = async () => {
		if (user?._id && user.avatar_source) {
			const res = await userApi.getAvatar(user._id);
			const reader = new FileReader();

			reader.onloadend = () => {
				const base64data = reader.result;
				setAvatarSrc(base64data);
			};
			reader.readAsDataURL(res as Blob);
		}
	};

	useEffect(() => {
		fetchAvatar();
	}, [user?._id]);

	return (
		<StyledForm>
			<Grid container spacing={{ xs: 2, md: 4 }}>
				<Grid
					item
					xs={12}
					md={4}
					spacing={{ xs: 2, md: 4 }}
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
					}}>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flexDirection: "column",
							gap: "16px",
							margin: "auto",
						}}>
						<UploadAvatar
							value={user?.avatar}
							src={avatarSrc ? (avatarSrc as string) : ""}
							onChange={(file) =>
								setUser((pre) =>
									pre ? { ...pre, avatar: file } : null
								)
							}
							disabled={disabled}
							size={
								!breakpoint.sm
									? "small"
									: !breakpoint.md
									? "medium"
									: "large"
							}
							alt={user?.full_name || ""}
						/>
						{disabled && (
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: "8px",
								}}>
								<Person
									fontSize={
										breakpoint.sm ? "large" : "medium"
									}
									color="secondary"
								/>
								<Typography
									sx={{
										fontSize: breakpoint.sm
											? "2.4rem"
											: "2.0rem",
										fontWeight: "700",
										color: (theme) =>
											theme.palette.secondary.main,
									}}>
									USER
								</Typography>
							</Box>
						)}
					</Box>
				</Grid>
				<Grid item xs={12} md={8}>
					<Box
						sx={{
							display: "flex",
							justifyContent: "center",
							flexDirection: "column",
							gap: {
								xs: "16px",
								md: "24px",
							},
						}}>
						<Typography
							sx={{
								fontWeight: "500",
								fontSize: "2rem",
							}}>
							Thông tin tài khoản
						</Typography>
						<Box
							sx={{
								display: "flex",
							}}>
							<Box sx={{ flex: "1" }}>
								<Typography
									sx={(theme) => ({
										fontWeight: "500",
										fontSize: "1.4rem",
										color: theme.palette.grey[600],
									})}>
									Tên tài khoản
								</Typography>
								<Typography
									color="priamry"
									sx={(theme) => ({
										fontWeight: "500",
										fontSize: "1.6rem",
										color: theme.palette.secondary.main,
									})}>
									{user?.username}
								</Typography>
							</Box>
							<Box sx={{ flex: "1" }}>
								<Typography
									sx={(theme) => ({
										fontWeight: "500",
										fontSize: "1.4rem",
										color: theme.palette.grey[600],
									})}>
									Email
								</Typography>
								<Typography
									color="priamry"
									sx={(theme) => ({
										fontWeight: "500",
										fontSize: "1.6rem",
										color: theme.palette.secondary.main,
									})}>
									{user?.email}
								</Typography>
							</Box>
						</Box>
						<TextField
							label="Tên người dùng"
							fullWidth
							placeholder="Vui lòng nhập họ và tên"
							value={user?.full_name}
							onChange={(e) => {
								console.log(e);
								setUser((pre) =>
									pre
										? {
												...pre,
												full_name: e.target.value,
										  }
										: null
								);
							}}
							disabled={disabled}
						/>
						<Box
							sx={{ display: "flex", width: "100%", gap: "8px" }}>
							<TextField
								label="Số điện thoại "
								fullWidth
								placeholder="Vui lòng nhập số điện thoại"
								value={user?.phone_number}
								onChange={(e) => {
									console.log(e);
									setUser((pre) =>
										pre
											? {
													...pre,
													phone_number:
														e.target.value,
											  }
											: null
									);
								}}
								disabled={disabled}
							/>
							<TextField
								label="Địa chỉ Email"
								fullWidth
								placeholder="Vui lòng nhập địa chỉ email"
								value={user?.email}
								onChange={(e) => {
									console.log(e);
									setUser((pre) =>
										pre
											? {
													...pre,
													email: e.target.value,
											  }
											: null
									);
								}}
								disabled={disabled}
							/>
						</Box>
					</Box>
				</Grid>
			</Grid>
		</StyledForm>
	);
};

export default FormUser;
