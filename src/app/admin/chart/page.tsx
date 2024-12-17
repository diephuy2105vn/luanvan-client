"use client";

import adminApi from "@/api/adminApi";
import MessageChart from "@/components/chart/MessageChart";
import OrderChart from "@/components/chart/OrderChart";
import useBreakpoint from "@/hooks/useBreakpoins";
import { ChatMessage } from "@/types/chat_message";
import { FileBase } from "@/types/file";
import {
  AttachMoney,
  FileUpload,
  InsertDriveFile,
  MessageOutlined,
  Payment,
  ShoppingBag,
  ShoppingCart,
} from "@mui/icons-material";
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
import fileApi from "@/api/fileApi";
import { formatCapacity } from "@/utils";

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
      }}
    >
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
          }}
        >
          {icon}
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "1.8rem",
              fontWeight: "700",
            }}
          >
            {title}
          </Typography>
          {description && (
            <Typography
              sx={{
                fontSize: "1.3rem",
              }}
            >
              {description}
            </Typography>
          )}
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: "2rem",
          fontWeight: "700",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

const Page = () => {
  const breakpoint = useBreakpoint();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [totalMessages, setTotalMessages] = useState(0);
  const [orders, setOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [files, setFiles] = useState([]);
  const [fileCapacity, setFileCapacity] = useState(0);
  const [selectedTime, setSelectedTime] = useState<Dayjs>(dayjs());
  const [totalRevenue, setTotalRevenue] = useState(0);
  const fetchMessages = async () => {
    try {
      const startDate = selectedTime?.startOf("month").format("YYYY-MM-DD");
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
  const fetchOrders = async () => {
    try {
      const startDate = selectedTime?.startOf("month").format("YYYY-MM-DD");
      const endDate = selectedTime?.endOf("month").format("YYYY-MM-DD");
      const response = await adminApi.getOrders({
        start_date: startDate,
        end_date: endDate,
      });
      setOrders(response.data);
      setTotalOrders(response.total);
      const totalRevenue = response.data.reduce(
        (acc, order) => acc + order.price,
        0
      );
      setTotalRevenue(totalRevenue);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    }
  };

  const fetchFiles = async () => {
    const res = await adminApi.getAllFiles({
      page: 1,
      size_page: 20,
    });
    setFiles(res.data);
    setFileCapacity(res.capacity);
  };

  useEffect(() => {
    fetchMessages();
    fetchOrders();
    fetchFiles();
  }, [selectedTime]);
  return (
    <Container sx={{ paddingTop: { md: "16px" } }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "500" }}>
            Thống kê
          </Typography>
          <Typography
            sx={(theme) => ({
              fontWeight: "500",
              fontSize: "1.6rem",
              color: theme.palette.grey[600],
            })}
          >
            Biểu đồ thống kê
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "8px" }}>
          <DatePicker
            label={"Tháng/Năm"}
            openTo="month"
            views={["month", "year"]}
            format="MM/YYYY"
            value={selectedTime}
            onChange={(newValue) => {
              setSelectedTime(newValue);
            }}
            slotProps={{ textField: { size: "small", sx: { width: "160px" } } }}
          />
        </Box>
      </Box>
      <Box
        sx={(theme) => ({
          marginTop: "40px",
          borderRadius: "10px",
          boxShadow: theme.shadows[2],
          padding: { xs: theme.spacing(1), md: theme.spacing(2) },
        })}
      >
        <Typography variant="h5" sx={{ fontWeight: "500", margin: "16px 0" }}>
          Dung lượng
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={6}>
            <RowInfo
              title="Số tệp tin trong hệ thống"
              value={files.length}
              description="Số tệp tin trong hệ thống"
              icon={<InsertDriveFile />}
              color="warning"
            />
          </Grid>
          <Grid item xs={6} md={6}>
            <RowInfo
              title="Tổng dung lượng đã sử dụng"
              value={formatCapacity(fileCapacity)}
              description="Dung lượng đã sử dụng trong hệ thống"
              icon={<FileUpload />}
              color="warning"
            />
          </Grid>
        </Grid>
        <Typography variant="h5" sx={{ fontWeight: "500", margin: "16px 0" }}>
          Đánh giá sử dụng
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <MessageChart messages={messages} />
          </Grid>
          {/* <Grid item xs={12} md={12}>
            <OrderChart orders={orders} />
          </Grid> */}
          <Grid item xs={12} md={12}>
            <Box
              sx={(theme) => ({
                padding: { xs: theme.spacing(1), md: theme.spacing(2) },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
              })}
            >
              <RowInfo
                title="Số tin nhắn"
                value={totalMessages}
                description="Tin nhắn đã gửi"
                icon={<MessageOutlined fontSize="small" />}
                color="success"
              />
            </Box>
          </Grid>
          {/* <Grid item xs={12} md={6}>
            <Box
              sx={(theme) => ({
                padding: { xs: theme.spacing(1), md: theme.spacing(2) },
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
              })}
            >
              <RowInfo
                title="Tổng Luợt đăng kí"
                value={totalOrders}
                description="Lượt đăng ký"
                icon={<ShoppingCart fontSize="small" />}
                color="success"
              />
              <RowInfo
                title="Tổng thu"
                value={totalRevenue}
                description="Tổng thu"
                icon={<Payment fontSize="small" />}
                color="info"
              />
            </Box>
          </Grid> */}
        </Grid>
      </Box>
    </Container>
  );
};

export default Page;
