"use client";

import FormUser from "@/components/form/FormUser";
import { getUser } from "@/config/redux/userReducer";
import useBreakpoint from "@/hooks/useBreakpoins";
import { OnlyChildrenProps } from "@/types/common";
import { defaultUser, UserBase } from "@/types/user";
import { Box, Button, Container, Typography } from "@mui/material";
import type { RootState } from "@/config/redux/store";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AlertContext from "@/contexts/AlertContext";
import userApi from "@/api/userApi";

const Layout = ({ children }: OnlyChildrenProps) => {
	const breakpoint = useBreakpoint();
	const { showAlert } = useContext(AlertContext);
	const logedUser = useSelector((state: RootState) => getUser(state));

	const [user, setUser] = useState<UserBase | null>(defaultUser);
	const [isDisabledField, setIsDisabledField] = useState(true);

	const handleUpdateUser = async () => {
		if (!user) {
			return;
		}

		if (!user?.full_name?.trim()) {
			showAlert("Vui lòng nhập đầy đủ dữ liệu", "error");
			return;
		}

		try {
			const updatingUser = {
				full_name: user.full_name,
				phone_number: user.phone_number,
			};
			const res = await userApi.update(updatingUser);
			if (user.avatar) {
				const formData = new FormData();
				formData.append("avatar", user.avatar);
				const res = await userApi.uploadAvatar(formData);

				setUser(
					(pre) =>
						pre && {
							...pre,
							avatar_source: res.avatar_source,
						}
				);
			}
			setUser(
				(pre) =>
					pre && {
						...pre,
						full_name: res.full_name,
						phone_number: res.phone_number,
					}
			);
			showAlert("Cập nhật trợ lý AI thành công", "success");
			toggleDisabledField();
		} catch (error) {
			showAlert("Đã có lỗi xảy ra", "error");
		}
	};

	const toggleDisabledField = () => {
		setIsDisabledField(!isDisabledField);
	};

	useEffect(() => {
		setUser(logedUser);
	}, [logedUser]);

	return (
		<Container sx={{ paddingTop: "16px" }}>
			{breakpoint.sm && (
				<Typography variant="h5" sx={{ fontWeight: "500" }}>
					Tài khoản
				</Typography>
			)}
			<Typography
				sx={(theme) => ({
					fontWeight: "500",
					fontSize: "1.6rem",
					color: theme.palette.grey[600],
				})}>
				Thông tin tài khoản của bạn
			</Typography>
			<Box
				sx={(theme) => ({
					marginTop: "40px",
					borderRadius: "10px",
					boxShadow: theme.shadows[3],
					padding: {
						xs: theme.spacing(2),
						md: theme.spacing(4),
					},
				})}>
				<FormUser
					user={user}
					setUser={setUser}
					disabled={isDisabledField}
				/>
				<Box
					sx={{
						display: "flex",
						justifyContent: "flex-end",
						marginTop: "20px",
					}}>
					<Button
						variant="contained"
						onClick={() =>
							!isDisabledField
								? handleUpdateUser()
								: toggleDisabledField()
						}>
						{isDisabledField ? "Cập nhật" : "Lưu"}
					</Button>
				</Box>
			</Box>
		</Container>
	);
};

export default Layout;
