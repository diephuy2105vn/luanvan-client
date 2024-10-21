"use client";

import packageApi from "@/api/packApi";
import userApi from "@/api/userApi";
import PackCard from "@/components/card/PackCard";
import { getUserPack, getUser, setUser } from "@/config/redux/userReducer";
import { useAppSelector } from "@/hooks/common";
import useBreakpoint from "@/hooks/useBreakpoins";
import { PackageType } from "@/types/package";
import { UserBase } from "@/types/user";
import { Box, Container, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Page = () => {
	const dispatch = useDispatch();
	const breakpoint = useBreakpoint();
	const [packages, setPackages] = useState<PackageType[]>([]);
	const fetchPackages = async () => {
		const res = await packageApi.getAll();
		setPackages(res.data);
	};

	useEffect(() => {
		fetchPackages();
	}, []);

	return (
		<Container sx={{ paddingTop: "16px" }}>
			{breakpoint.sm && (
				<Typography variant="h5" sx={{ fontWeight: "500" }}>
					Gói dịch vụ
				</Typography>
			)}
			<Typography
				sx={(theme) => ({
					fontWeight: "500",
					fontSize: "1.6rem",
					color: theme.palette.grey[600],
				})}>
				Danh sách các gói dịch vụ
			</Typography>

			<Grid
				container
				wrap="wrap"
				sx={(theme) => ({
					marginTop: "40px",
					padding: {
						xs: theme.spacing(1),
						md: theme.spacing(2),
					},
				})}>
				{packages.map((pack) => (
					<Grid
						key={pack._id as string}
						sx={{ padding: "6px 8px" }}
						item
						md={4}
						sm={12}>
						<PackCard pack={pack} />
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default Page;
