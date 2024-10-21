"use client";

import adminApi from "@/api/adminApi";
import MessageChart from "@/components/chart/MessageChart";
import useBreakpoint from "@/hooks/useBreakpoins";
import { ChatMessage } from "@/types/chat_message";
import { FileBase } from "@/types/file";
import { AttachMoney, MessageOutlined, Payment } from "@mui/icons-material";
import {
	Box,
	Button,
	Container,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Typography,
} from "@mui/material";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

const RowInfo = ({
	title,
	value,
	description,
	icon,
	color,
}: {
	title: string;
	value: string | number;
	description?: string;
	color: "success" | "warning" | "error" | "info" | "primary" | "secondary";
	icon: React.ReactNode;
}) => {
	return (
		<Box
			sx={{
				padding: "12px 4px",
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				"& + &": {
					borderTop: "1px solid #ccc",
				},
			}}>
			<Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
				<Box
					sx={{
						backgroundColor: (theme) => theme.palette[color].main,
						width: "44px",
						height: "44px",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						color: "white",
						borderRadius: "50%",
					}}>
					{icon}
				</Box>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
					}}>
					<Typography
						sx={{
							fontSize: "1.8rem",
							fontWeight: "700",
						}}>
						{title}
					</Typography>
					{description && (
						<Typography
							sx={{
								fontSize: "1.3rem",
							}}>
							{description}
						</Typography>
					)}
				</Box>
			</Box>
			<Typography
				sx={{
					fontSize: "2rem",
					fontWeight: "700",
				}}>
				{value}
			</Typography>
		</Box>
	);
};

const timeFrames = ["week", "month"];

const Page = () => {
	const breakpoint = useBreakpoint();

	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [totalMessages, setTotalMessages] = useState(0);
	const [files, setFiles] = useState<FileBase[]>([]);

	const [orders, setOrders] = useState<ChatMessage[]>([]);
	const [totalOrders, setTotalOrders] = useState(0);

	const [timeFrame, setTimeFrame] = useState<"week" | "month">("week");
	const [selectedTime, setSelectedTime] = useState<Dayjs | null>(dayjs());
	const fetchMessages = async () => {
		try {
			const startDate = selectedTime
				?.startOf("month")
				.format("YYYY-MM-DD");
			const endDate = selectedTime?.endOf("month").format("YYYY-MM-DD");

			const response = await adminApi.getMessages({
				start_date: startDate,
				end_date: endDate,
			});
			setMessages(response.data);
			setTotalMessages(response.total);
		} catch (error) {
			console.error("Failed to fetch messages", error);
		}
	};

	const fetchFiles = async () => {
		try {
			const startDate = selectedTime
				?.startOf("month")
				.format("YYYY-MM-DD");
			const endDate = selectedTime?.endOf("month").format("YYYY-MM-DD");

			const response = await adminApi.getAllFiles({
				start_date: startDate,
				end_date: endDate,
			});
			setFiles(response.data);
		} catch (error) {
			console.error("Failed to fetch files", error);
		}
	};

	const handleChangeTimeFrame = (e: SelectChangeEvent<"week" | "month">) => {
		setTimeFrame(e.target.value as "week" | "month");
	};

	const fetchOrders = async () => {
		try {
			const startDate = selectedTime
				?.startOf("month")
				.format("YYYY-MM-DD");
			const endDate = selectedTime?.endOf("month").format("YYYY-MM-DD");

			const response = await adminApi.getOrders({
				start_date: startDate,
				end_date: endDate,
			});
			setOrders(response.data);
			setTotalOrders(response.total);
		} catch (error) {
			console.error("Failed to fetch orders", error);
		}
	};

	useEffect(() => {
		fetchMessages();
		fetchFiles();
		fetchOrders();
	}, [selectedTime]);

	return (
		<Container
			sx={{
				paddingTop: { md: "16px" },
			}}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<Box>
					<Typography variant="h5" sx={{ fontWeight: "500" }}>
						Thống kê
					</Typography>

					<Typography
						sx={(theme) => ({
							fontWeight: "500",
							fontSize: "1.6rem",
							color: theme.palette.grey[600],
						})}>
						Biểu đồ thống kê
					</Typography>
				</Box>
				<Box
					sx={{
						display: "flex",
						gap: "8px",
					}}>
					<FormControl size="small">
						<InputLabel id="demo-simple-select-label">
							Khung
						</InputLabel>
						<Select
							value={timeFrame}
							label="Khung"
							onChange={handleChangeTimeFrame}>
							<MenuItem value={"week"}>Tuần</MenuItem>
							<MenuItem value={"month"}>Tháng</MenuItem>
						</Select>
					</FormControl>

					<DatePicker
						label={"Tháng/Năm"}
						openTo="month"
						views={["month", "year"]}
						format="MM/YYYY"
						value={selectedTime}
						onChange={(newValue) => {
							setSelectedTime(newValue);
						}}
						slotProps={{
							textField: {
								size: "small",
								sx: { width: "160px" },
							},
						}}
					/>
				</Box>
			</Box>
			<Box
				sx={(theme) => ({
					marginTop: "40px",
					borderRadius: "10px",
					boxShadow: theme.shadows[2],
					padding: {
						xs: theme.spacing(1),
						md: theme.spacing(2),
					},
				})}>
				<Grid container>
					<Grid item xs={12} md={8}>
						<MessageChart
							messages={messages}
							timeFrame={timeFrame}
						/>
					</Grid>
					<Grid item xs={12} md={4}>
						<Box
							sx={(theme) => ({
								padding: {
									xs: theme.spacing(1),
									md: theme.spacing(2),
								},
								display: "flex",
								flexDirection: "column",
								justifyContent: "center",
								height: "100%",
							})}>
							<RowInfo
								title="Số tin nhắn"
								value={totalMessages}
								description="Tin nhắn đã gửi"
								icon={<MessageOutlined fontSize="small" />}
								color="success"
							/>
							<RowInfo
								title="Đơn giá"
								value={`≈ 0.01$`}
								description="Giá mỗi tin"
								icon={<AttachMoney />}
								color="error"
							/>
							<RowInfo
								title="Tổng chi phí"
								value={`≈ ${totalMessages * 0.01} $`}
								icon={<AttachMoney />}
								color="info"
							/>
						</Box>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
};

export default Page;
