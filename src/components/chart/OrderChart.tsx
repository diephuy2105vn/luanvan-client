import { Box } from "@mui/material";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

type Order = {
  id: string;
  order_date: string;
};

type SeriesData = {
  name: string;
  data: number[];
};

const OrderChart = ({ orders }: { orders: Order[] }) => {
  const [seriesData, setSeriesData] = useState<SeriesData[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: days }, (_, i) => (i + 1).toString());
  };

  const groupOrdersByDayOfMonth = (
    orders: Order[],
    daysInMonth: string[]
  ): Record<string, number> => {
    const groupedOrders = orders.reduce(
      (acc: Record<string, number>, order: Order) => {
        const createdAt = new Date(order.order_date as string);
        const day = createdAt.getDate().toString();

        if (!acc[day]) {
          acc[day] = 0;
        }
        acc[day] += 1;

        return acc;
      },
      {}
    );

    // Ensure all days of the month are accounted for, even if they have 0 orders
    const completeData = daysInMonth.reduce((acc, day) => {
      acc[day] = groupedOrders[day] || 0;
      return acc;
    }, {} as Record<string, number>);

    return completeData;
  };

  useEffect(() => {
    const today = new Date();
    const daysInMonth = getDaysInMonth(today);
    const groupedData = groupOrdersByDayOfMonth(orders, daysInMonth);
    const sortedData = daysInMonth.map((day) => groupedData[day]);

    setCategories(daysInMonth);
    setSeriesData([{ name: "Orders", data: sortedData }]);
  }, [orders]);

  const chartOptions: ApexOptions = {
    chart: {
      id: "orders-chart",
      type: "bar",
    },
    xaxis: {
      categories: categories, // Các ngày trong tháng
      title: {
        text: "Ngày",
      },
    },
    yaxis: {
      title: {
        text: "Số lương đăng ký",
      },
    },
  };

  return (
    <Box>
      <Chart options={chartOptions} series={seriesData} height="350" />
    </Box>
  );
};

export default OrderChart;
