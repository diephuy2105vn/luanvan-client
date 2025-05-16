"use client";

import BotCard from "@/components/card/BotCard";
import Header from "@/components/common/Header";
import CustomSearch from "@/components/common/Search";
import FormBot from "@/components/form/FormBot";
import useBreakpoint from "@/hooks/useBreakpoins";
import { BotBase, BotCreate, defaultBotCreate } from "@/types/bot";
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
import { useContext, useState } from "react";
import Image from "next/image";
import bannerImage from "@/assets/banner_image.png";
import AlertContext from "@/contexts/AlertContext";
import userApi from "@/api/userApi";
import { useRouter } from "next/navigation";

const StyledFormLogin = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const Page = () => {
  const [account, setAccount] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const router = useRouter();
  const breakpoint = useBreakpoint();
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (account.password !== account.confirmPassword) {
        showAlert("Mật khẩu xác nhận không đúng", "error");
        return;
      }
      const res = await userApi.register(account);
      showAlert("Đăng ký thành công", "success");
      router.push("/login");
    } catch (error) {
      // console.error("Login failed:", error);
      showAlert("Đăng ký thất bại", "error");
    }
  };

  const { showAlert } = useContext(AlertContext);
  return (
    <Container
      sx={{
        height: "100vh",
      }}
      maxWidth={false}
    >
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ height: "100%" }}
      >
        {breakpoint.sm && (
          <Grid item xs={0} sm={4} md={5.5}>
            <Box className="CustomBanner-thumbnail">
              <Image
                style={{ width: "100%", height: "100%" }}
                src={bannerImage}
                alt="Banner"
              />
            </Box>
          </Grid>
        )}
        <Grid item xs={12} sm={8} md={4.5}>
          <Card sx={{ padding: "20px" }}>
            <StyledFormLogin onSubmit={handleSubmitForm}>
              <Typography
                variant="h4"
                component="h4"
                color="secondary"
                sx={{
                  marginBottom: "16px",
                  fontWeight: 500,
                }}
              >
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
                type="password"
                label="Mật khẩu"
                placeholder="Vui lòng nhập mật khẩu tối thiểu 8 kí tự"
                required
              />
              <TextField
                fullWidth
                value={account.confirmPassword}
                onChange={(e) =>
                  setAccount((pre) => ({
                    ...pre,
                    confirmPassword: e.target.value,
                  }))
                }
                type="password"
                label="Xác nhận mật khẩu"
                placeholder="Vui lòng xác nhận mật khẩu"
                required
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      color: (theme) => theme.palette.grey[700],
                    }}
                  >
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
                    }}
                  >
                    Đăng nhập
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    marginTop: "8px",
                  }}
                >
                  <Button variant="contained" type="submit">
                    Đăng ký
                  </Button>
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
