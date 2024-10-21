"use client";
import botApi from "@/api/botApi";
import bannerImage from "@/assets/banner_image.png";
import BotCard from "@/components/card/BotCard";
import useBreakpoint from "@/hooks/useBreakpoins";
import { BotBase } from "@/types/bot";
import { Box, Button, Grid, styled, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const StyledBanner = styled("div")({
	position: "relative",
	display: "flex",
	alignItems: "center",
	justifyContent: "space-between",
	height: "100vh",
	width: "100%",

	".CustomBanner-root": {
		width: "100%",
		height: "100%",
		position: "relative",
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		".CustomBanner-thumbnail": {
			display: "flex",
			justifyContent: "flex-end",
			alignItems: "center",
			flex: 1,
			img: {
				width: "50%",
				minWidth: "200px",
				height: "auto",
				maxHeight: "600px",
				objectFit: "contain",
			},
		},
	},
	".CustomBanner-slider": {
		position: "absolute",
		left: 0,
		width: "60%",
		minWidth: "300px",
		top: "0",
		height: "100%",
		zIndex: 100,
		display: "flex",
		justifyContent: "space-evenly",
		flexDirection: "column",
	},
	"@media (max-width: 600px)": {
		height: "360px",
	},
});

const StyledSlider = styled(Slider)(({ theme }) => ({
	".slick-dots": {
		bottom: "-32px",
		textAlign: "left",
		padding: "0 16px",
		li: {
			button: {
				padding: 0,
				"&::before": {
					color: theme.palette.secondary.main,
					fontSize: "14px",
				},
			},
			"+ li": {
				marginLeft: "10px",
			},
		},
	},
}));

const StyledSliderItem = styled("div")({
	h1: {
		fontSize: "3rem",
		whiteSpace: "nowrap",
		marginBottom: "16px",
	},
	p: {
		display: "-webkit-box",
		WebkitLineClamp: 3,
		WebkitBoxOrient: "vertical",
		overflow: "hidden",
		textOverflow: "ellipsis",
		marginBottom: "16px",
	},
});

const settings = {
	dots: true,
	infinite: true,
	arrows: false,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 5000,
};

const Banner = () => {
	const breakpoints = useBreakpoint();

	const [bots, setBots] = useState<BotBase[]>([]);

	const fetchBots = async () => {
		const res = await botApi.getAll({ size_page: 4 });
		setBots(res.data);
	};

	useEffect(() => {
		fetchBots();
	}, []);

	const botGroup = React.useMemo(
		() => (
			<Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						gap: "16px",
						justifyContent: "space-between",
						marginBottom: "16px",
					}}>
					<Typography
						variant="h5"
						color="primary"
						sx={{ fontWeight: "bold" }}>
						Trải nghiệm trợ lý AI
					</Typography>
					<Button
						size="large"
						variant="contained"
						sx={{ borderRadius: "50px" }}>
						Xem thêm
					</Button>
				</Box>
				<Grid container spacing={2}>
					{bots?.map((bot) => (
						<Grid item xs={6} key={bot._id}>
							<BotCard bot={bot} />
						</Grid>
					))}
				</Grid>
			</Box>
		),
		[bots]
	);

	return (
		<>
			<StyledBanner>
				<Box className="CustomBanner-root">
					<Box className="CustomBanner-slider">
						<StyledSlider {...settings}>
							<StyledSliderItem>
								<Box sx={{ display: "flex", gap: "10px" }}>
									<Typography
										color="primary"
										variant="h2"
										sx={{ fontWeight: "bold" }}>
										Code
									</Typography>
									<Typography
										color="secondary"
										variant="h2"
										sx={{ fontWeight: "bold" }}>
										Chat
									</Typography>
								</Box>
								<Typography>
									Code Chat cung cấp giải pháp chat trực tuyến
									tích hợp cho website, giúp hỗ trợ khách hàng
									nhanh chóng và hiệu quả. Hãy tích hợp dễ
									dàng để nâng cao trải nghiệm người dùng và
									tối ưu hóa tương tác. Phù hợp với mọi loại
									hình doanh nghiệp.
								</Typography>
								<Button
									size="large"
									component={Link}
									variant="contained"
									sx={{ borderRadius: "50px" }}
									href="/chat">
									Tạo Trợ lý AI
								</Button>
							</StyledSliderItem>
							<StyledSliderItem>
								<Box sx={{ display: "flex", gap: "10px" }}>
									<Typography
										color="primary"
										variant="h2"
										sx={{ fontWeight: "bold" }}>
										Code
									</Typography>
									<Typography
										color="secondary"
										variant="h2"
										sx={{ fontWeight: "bold" }}>
										Chat
									</Typography>
								</Box>
								<Typography>
									Code Chat mang đến cách trò chuyện thông
									minh và mượt mà. Ứng dụng của chúng tôi cung
									cấp hỗ trợ nhanh chóng và dễ dàng giải đáp
									mọi thắc mắc. Với giao diện thân thiện và
									công cụ mạnh mẽ, Code Chat nâng cao trải
									nghiệm tương tác của bạn. Cảm ơn bạn đã chọn
									chúng tôi!
								</Typography>
								<Button
									component={Link}
									size="large"
									sx={{ borderRadius: "50px" }}
									variant="contained"
									href="/shop">
									Trò chuyện
								</Button>
							</StyledSliderItem>
						</StyledSlider>
						{breakpoints.sm && botGroup}
					</Box>
					<Box className="CustomBanner-thumbnail">
						<Image src={bannerImage} alt="Banner" />
					</Box>
				</Box>
			</StyledBanner>
			{!breakpoints.sm && botGroup}
		</>
	);
};

export default Banner;
