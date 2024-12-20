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
  timeFrame?: "week" | "month";
}) => {
  const [seriesData, setSeriesData] = useState<SeriesData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => (i + 1).toString());
  };

  const groupMessagesByDayOfMonth = (
    messages: ChatMessage[],
    daysInMonth: string[]
  ): Record<string, number> => {
    const groupedMessages = messages.reduce(
      (acc: Record<string, number>, message: ChatMessage) => {
        const createdAt = new Date(message.created_at as string);
        const day = createdAt.getDate().toString();

        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day] += 1;

        return acc;
      },
      {}
    );

    const completeData = daysInMonth.reduce((acc, day) => {
      acc[day] = groupedMessages[day] || 0;
      return acc;
    }, {} as Record<string, number>);

    return completeData;
  };

  useEffect(() => {
    const today = new Date();
    const daysInMonth = getDaysInMonth(today);
    const groupedData = groupMessagesByDayOfMonth(messages, daysInMonth);
    const sortedData = daysInMonth.map((day) => groupedData[day]);

    setCategories(daysInMonth);
    setSeriesData([{ name: "Messages", data: sortedData }]);
  }, [messages]);

  const chartOptions: ApexOptions = {
    chart: {
      id: "messages-chart",
      type: "bar",
    },
    xaxis: {
      categories: categories, // Các ngày trong tháng
      title: {
        text: "Ngày trong tháng",
      },
    },
    yaxis: {
      title: {
        text: "Số tin nhắn",
      },
    },
  };

  return (
    <Box>
      <Chart options={chartOptions} series={seriesData} height="350" />
    </Box>
  );
};

export default MessageChart;
