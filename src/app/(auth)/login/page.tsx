"use client";

import userApi from "@/api/userApi";
import bannerImage from "@/assets/banner_image.png";
import { setUser } from "@/config/redux/userReducer";
import AlertContext from "@/contexts/AlertContext";
import { useAppDispatch } from "@/hooks/common";
import useBreakpoint from "@/hooks/useBreakpoins";
import { UserBase } from "@/types/user";
import { setCookie } from "@/utils/cookie";
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
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";

const StyledFormLogin = styled("form")({
  display: "flex",
  flexDirection: "column",
  gap: "16px",
});

const Page = () => {
  const [account, setAccount] = useState({ username: "", password: "" });
  const breakpoint = useBreakpoint();
  const dispatch = useAppDispatch();
  const { showAlert } = useContext(AlertContext);
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await userApi.login(account);
      setCookie("SESSION", res?.access_token);
      const user = await userApi.refresh();
      dispatch(setUser(user as UserBase));
    } catch (error) {
      console.error("Login failed:", error);
      showAlert("Đăng nhập thất bại", "error");
    }
  };

  return (
    <Container
      sx={{
        height: "100vh",
        maxHeight: "-webkit-fill-available",
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
            <StyledFormLogin onSubmit={(e) => handleSubmitForm(e)}>
              <Typography
                variant="h4"
                component="h4"
                color="secondary"
                sx={{
                  marginBottom: "16px",
                  fontWeight: 500,
                }}
              >
                Đăng nhập
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
                label="Mật khẩu"
                type="password"
                placeholder="Vui lòng nhập mật khẩu"
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
                    Bạn chưa có tài khoản?
                  </Typography>
                  <Button
                    variant="text"
                    component={Link}
                    size="small"
                    href="/register"
                    color="secondary"
                    sx={{
                      fontSize: "1.6rem",
                      marginLeft: "4px",
                      fontWeight: 500,
                    }}
                  >
                    Đăng ký
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
                    Đăng nhập
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
