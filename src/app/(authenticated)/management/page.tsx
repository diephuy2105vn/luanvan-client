"use client";

import botApi from "@/api/botApi";
import BotCard from "@/components/card/BotCard";
import { MenuItemProps } from "@/components/common/Menu";
import CustomModal from "@/components/common/Modal";
import CustomSearch from "@/components/common/Search";
import AlertContext from "@/contexts/AlertContext";
import useBreakpoint from "@/hooks/useBreakpoins";
import useSetValueTimeout from "@/hooks/useSetValueTimeOut";
import { BotBase } from "@/types/bot";
import { DeleteOutline, ExpandMore, InfoOutlined } from "@mui/icons-material";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";

const SIZE_PAGE = 6;

const Page = () => {
  const router = useRouter();
  const { showAlert } = useContext(AlertContext);

  const [bots, setBots] = useState<BotBase[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const breakpoint = useBreakpoint();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [deletingBot, setDeletingBot] = useState<BotBase | null>(null);
  const changedSearchValue = useSetValueTimeout(searchValue, 1000);

  const fetchBots = async () => {
    const res = await botApi.getAll({
      size_page: SIZE_PAGE,
      page: currentPage,
      name: changedSearchValue,
    });
    if (currentPage === 1) {
      setBots(res.data);
      setTotalPage(Math.ceil(res.total / SIZE_PAGE));
      return;
    }
    setBots((pre) => [...pre, ...res.data]);
  };

  const handleToggleModalDeleteBot = (bot?: BotBase) => {
    bot ? setDeletingBot(bot) : setDeletingBot(null);
  };

  const handleDeleteBot = async () => {
    try {
      if (!deletingBot || !deletingBot._id) {
        throw new Error();
      }
      await botApi.delete(deletingBot._id);
      setBots((pre) => pre.filter((b) => b._id !== deletingBot._id));
      showAlert("Xóa trợ lý AI thành công", "success");
      handleToggleModalDeleteBot();
    } catch (err) {
      showAlert("Đã có lỗi xảy ra", "error");
      handleToggleModalDeleteBot();
    }
  };

  const menuBot: MenuItemProps[] = useMemo(
    () => [
      {
        key: "1",
        label: "Chi tiết",
        action: (metaData: BotBase) => {
          router.push(`/management/${metaData._id}`);
        },
        icon: InfoOutlined,
        divider: true,
      },
      {
        key: "2",
        label: "Xóa",
        action: (metaData: BotBase) => {
          handleToggleModalDeleteBot(metaData);
        },
        color: "error",
        icon: DeleteOutline,
      },
    ],
    []
  );

  useEffect(() => {
    fetchBots();
  }, [currentPage, changedSearchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [changedSearchValue]);

  return (
    <Container
      sx={{
        paddingTop: { md: "16px" },
      }}
    >
      <Box>
        {breakpoint.sm && (
          <Typography variant="h5" sx={{ fontWeight: "500" }}>
            Quản lý trợ lý AI
          </Typography>
        )}
        <Typography
          sx={(theme) => ({
            fontWeight: "500",
            fontSize: "1.6rem",
            color: theme.palette.grey[600],
          })}
        >
          Danh sách AI của bạn
        </Typography>
      </Box>
      <Box sx={{ marginTop: "40px" }}>
        <CustomSearch
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          size="medium"
        />
      </Box>
      <Box sx={{ marginTop: "40px" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            sx={{ fontWeight: "450", marginBottom: "20px" }}
          >
            Trợ lý AI của tôi
          </Typography>
          <Button
            component={Link}
            href="/management/create_bot"
            size={breakpoint.sm ? "large" : "medium"}
            color="primary"
            variant="contained"
          >
            Tạo Trợ Lý AI
          </Button>
        </Box>
        <Grid container spacing={{ xs: 2, md: 4 }}>
          {bots?.map((bot) => (
            <Grid item xs={6} md={4} key={bot._id}>
              <Link href={`/management/${bot._id}`}>
                <BotCard bot={bot} showMenu={true} menuItems={menuBot} />
              </Link>
            </Grid>
          ))}
        </Grid>
        {currentPage < totalPage && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            <Button
              onClick={() => {
                setCurrentPage((pre) => ++pre);
              }}
              size="large"
              color="primary"
              sx={{ borderRadius: "100px" }}
              variant="contained"
              startIcon={<ExpandMore />}
            >
              XEM THÊM
            </Button>
          </Box>
        )}
      </Box>
      <CustomModal
        open={!!deletingBot}
        onClose={() => handleToggleModalDeleteBot()}
      >
        <Typography
          sx={(theme) => ({
            fontWeight: "500",
            fontSize: "2rem",
            color: theme.palette.error.main,
            marginBottom: "16px",
          })}
        >
          Xóa trợ lý AI
        </Typography>
        <Typography
          sx={(theme) => ({
            fontSize: "1.6rem",
            marginBottom: "16px",
          })}
        >
          Hành động này không thể khôi phục, bạn chắc chắn xóa trợ lý AI này?
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "8px",
          }}
        >
          <Button
            color="error"
            onClick={() => {
              handleToggleModalDeleteBot();
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleDeleteBot();
            }}
          >
            Xác nhận
          </Button>
        </Box>
      </CustomModal>
    </Container>
  );
};

export default Page;
