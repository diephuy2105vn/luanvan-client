"use client";

import packageApi from "@/api/packApi";
import userApi from "@/api/userApi";
import PackCard from "@/components/card/PackCard";
import { getUser, setUserPack } from "@/config/redux/userReducer";
import { useAppSelector } from "@/hooks/common";
import useBreakpoint from "@/hooks/useBreakpoins";
import { PackageType } from "@/types/package";
import { UserPackageInfo } from "@/types/user";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import type { RootState } from "@/config/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

const Page = () => {
  const dispatch = useDispatch();
  const logedUser = useSelector((state: RootState) => getUser(state));
  const breakpoint = useBreakpoint();
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PackageType | null>(null);
  const fetchPackages = async () => {
    const res = await packageApi.getAll();
    setPackages(res.data);
  };

  const handleOpenDialog = (pack: PackageType) => {
    setDialogOpen(true);
    setSelectedOrder(pack);
  };

  const handleCloseDialog = (pack: PackageType) => {
    setDialogOpen(false);
    setSelectedOrder(null);
  };

  const handleBuyPackage = async () => {
    if (!selectedOrder) {
      return;
    }
    await userApi.buyPackage(selectedOrder._id as string);
    const res = await userApi.getPackageInfo();
    dispatch(setUserPack(res as UserPackageInfo));
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <Container sx={{ paddingTop: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {breakpoint.sm && (
            <Typography variant="h5" sx={{ fontWeight: "500" }}>
              Mua gói
            </Typography>
          )}

          <Typography
            sx={(theme) => ({
              fontWeight: "500",
              fontSize: "1.6rem",
              color: theme.palette.grey[600],
            })}
          >
            Các gói dịch vụ cho bạn
          </Typography>
        </div>
      </div>

      <Grid
        container
        wrap="wrap"
        sx={(theme) => ({
          marginTop: "40px",
          padding: {
            xs: theme.spacing(1),
            md: theme.spacing(2),
          },
        })}
      >
        {packages.map((pack) => (
          <Grid
            key={pack._id as string}
            sx={{ padding: "6px 8px" }}
            item
            md={4}
            sm={12}
          >
            <PackCard handleClickBuy={handleOpenDialog} pack={pack} />
          </Grid>
        ))}
        <Dialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          aria-labelledby="bulk-delete-dialog-title"
          aria-describedby="bulk-delete-dialog-description"
        >
          <DialogTitle id="bulk-delete-dialog-title">
            {"Xác nhận đăng ký gói dịch vụ"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="bulk-delete-dialog-description">
              Bạn chắc chắn đăng ký gói dịch vụ của chúng tôi
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Hủy</Button>
            <Button onClick={handleBuyPackage} color="primary" autoFocus>
              Xác nhận
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Container>
  );
};

export default Page;
