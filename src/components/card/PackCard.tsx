import { getUser, getUserPack } from "@/config/redux/userReducer";
import { useAppSelector } from "@/hooks/common";
import { PackageType } from "@/types/package";
import { UserPackageInfo } from "@/types/user";
import {
  formatCapacity,
  formatDate,
  formatDateFromDB,
  formatNumber,
} from "@/utils";
import {
  CheckRounded,
  FileDownload,
  Folder,
  HdrOnSelect,
  ShoppingBag,
  ShoppingCart,
  SmartToy,
} from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { Box, Card, styled } from "@mui/material";

import React, {
  DO_NOT_USE_OR_YOU_WILL_BE_FIRED_EXPERIMENTAL_FORM_ACTIONS,
  useCallback,
} from "react";

const PackCard = ({
  pack,
  handleClickBuy,
  handleClickEdit,
  handleClickDelete,
}: {
  pack: PackageType;
  handleClickBuy?: (pack: PackageType) => void;
  handleClickEdit?: (pack: PackageType) => void;
  handleClickDelete?: (pack: PackageType) => void;
}) => {
  const userPack = useAppSelector((state) => getUserPack(state));
  const logedUser = useAppSelector((state) => getUser(state));
  const isSelectedPackage = useCallback(
    (userPack: UserPackageInfo, pack: PackageType) => {
      if (!userPack.expiration_date || !userPack.registration_date) {
        return pack.type === "PACKAGE_FREE";
      }

      if (userPack.pack?._id === pack._id) {
        return userPack.pack._id === pack._id;
      }
      return false;
    },
    []
  );

  return (
    <Box
      sx={(theme) => ({
        width: "100%",
        height: "100%",
        borderRadius: "5px",
        boxShadow: theme.shadows[2],
      })}
    >
      <Box
        sx={{
          padding: "8px",
          backgroundColor: (theme) =>
            `rgba(${theme.palette.secondary.rgb}, 0.1)`,
        }}
      >
        <Typography variant="h6" color="secondary" align="center">
          {pack.name}
        </Typography>
      </Box>
      <Box
        sx={{
          marginTop: "16px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <SmartToy color="secondary" />
              <Typography sx={{ fontWeight: 500 }}>
                {pack.numBot} trợ lý AI
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <Folder color="secondary" />
              <Typography sx={{ fontWeight: 500 }}>
                {formatCapacity(pack.capacity_bot)} dung lượng trợ lý AI
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <FileDownload color="secondary" />
              <Typography sx={{ fontWeight: 500 }}>
                {formatCapacity(pack.capacity_file)} dung lượng dữ liệu
              </Typography>
            </Box>

            <Box
              sx={{
                marginTop: "16px",
                display: "flex",
                transform: "translateX(20%)",
                gap: "8px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "2.4rem",
                  fontWeight: "500",
                }}
              >
                {formatNumber(pack.price)}
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.2rem",
                }}
              >
                VNĐ / tháng
              </Typography>
            </Box>
          </Box>
        </Box>
        {logedUser?.role === "admin" && handleClickEdit && handleClickDelete ? (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "8px",
            }}
          >
            <Button
              onClick={() => {
                handleClickEdit && handleClickEdit(pack);
              }}
              sx={{ borderRadius: "100px" }}
            >
              Cập nhật
            </Button>
            <Button
              onClick={() => {
                handleClickDelete && handleClickDelete(pack);
              }}
              sx={{ borderRadius: "100px" }}
              color={"error"}
            >
              Xóa
            </Button>
          </div>
        ) : (
          <Box
            sx={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {userPack && isSelectedPackage(userPack, pack) ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <Button
                  color="success"
                  variant="outlined"
                  sx={{ borderRadius: "100px" }}
                  startIcon={<CheckRounded />}
                >
                  Đang dùng
                </Button>
                {userPack.pack.type !== "PACKAGE_FREE" && (
                  <Typography sx={{ fontSize: "1.4rem" }} color="error">
                    Hạn sử dụng:{" "}
                    {formatDate(userPack?.expiration_date as string)}
                  </Typography>
                )}
              </Box>
            ) : (
              !userPack ||
              (userPack?.pack?.price < pack.price && (
                <Button
                  onClick={() => {
                    handleClickBuy && handleClickBuy(pack);
                  }}
                  variant="contained"
                  sx={{ borderRadius: "100px" }}
                  startIcon={<ShoppingCart />}
                >
                  Đăng ký
                </Button>
              ))
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PackCard;
