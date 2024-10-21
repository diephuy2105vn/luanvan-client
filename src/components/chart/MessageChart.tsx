import { ChatMessage } from "@/types/chat_message";
import { Box } from "@mui/material";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

type SeriesData = {
	name: string;
	data: number[];
};

const MessageChart = ({
	messages,
	timeFrame,
}: {
	messages: ChatMessage[];
	timeFrame: "week" | "month";
}) => {
	const [seriesData, setSeriesData] = useState<SeriesData[]>([]);
	const [categories, setCategories] = useState<string[]>([]);

	const groupMessagesByTimeFrame = (
		messages: ChatMessage[],
		frame: "week" | "month"
	): Record<string, number> => {
		return messages.reduce(
			(acc: Record<string, number>, message: ChatMessage) => {
				const createdAt = new Date(message.created_at as string);
				let key: string = "";

				if (frame === "week") {
					const firstDayOfWeek = new Date(
						createdAt.setDate(
							createdAt.getDate() - createdAt.getDay()
						)
					);
					key = firstDayOfWeek.toISOString().split("T")[0];
				} else if (frame === "month") {
					key = `${createdAt.getFullYear()}-${(
						createdAt.getMonth() + 1
					)
						.toString()
						.padStart(2, "0")}`;
				}

				if (!acc[key]) {
					acc[key] = 0;
				}
				acc[key] += 1;

				return acc;
			},
			{}
		);
	};

	useEffect(() => {
		const groupedData = groupMessagesByTimeFrame(messages, timeFrame);
		const labels = Object.keys(groupedData); // Labels for x-axis
		const data = Object.values(groupedData);

		setCategories(labels);
		setSeriesData([{ name: "Messages", data }]);
	}, [messages, timeFrame]);

	const chartOptions: ApexOptions = {
		chart: {
			id: "messages-chart",
			type: "line",
		},
		xaxis: {
			categories: categories, // Các tuần/tháng
			title: {
				text: timeFrame === "week" ? "Weeks" : "Months",
			},
		},
		yaxis: {
			title: {
				text: "Number of Messages",
			},
		},
		stroke: {
			curve: "smooth", // Biểu đồ đường mượt
		},
		title: {
			text: `Messages Created by ${
				timeFrame === "week" ? "Week" : "Month"
			}`,
			align: "left",
		},
	};

	return (
		<Box>
			<Chart options={chartOptions} series={seriesData} height="350" />
		</Box>
	);
};

export default MessageChart;
