"use client";
import botApi from "@/api/botApi";
import FormBot from "@/components/form/FormBot";
import AlertContext from "@/contexts/AlertContext";
import useBreakpoint from "@/hooks/useBreakpoins";
import { BotBase, BotCreate, defaultBotCreate } from "@/types/bot";
import { Box, Button, Container, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
const Page = () => {
  const [creatingBot, setCreatingBot] = useState<BotCreate | BotBase>(
    defaultBotCreate
  );
  const { showAlert } = useContext(AlertContext);
  const [searchValue, setSearchValue] = useState("");
  const breakpoint = useBreakpoint();
  const router = useRouter();

  const handleCreateBot = async () => {
    if (!creatingBot.name.trim() || !creatingBot.description.trim()) {
      showAlert("Vui lòng nhập đầy đủ dữ liệu", "error");
      return;
    }

    const formData = new FormData();
    formData.append("name", creatingBot.name);
    formData.append("description", creatingBot.description);
    formData.append("response_model", String(creatingBot.response_model));

    if (creatingBot.avatar) {
      formData.append("avatar", creatingBot.avatar);
    }

    try {
      const res = await botApi.create(formData);
      showAlert("Tạo trợ lý AI thành công", "success");
      router.push("/management");
    } catch (error) {
      showAlert("Đã có lỗi xảy ra", "error");
    }
  };

  return (
    <Container
      sx={{
        paddingTop: { md: "16px" },
      }}
    >
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
        Tạo trợ lý AI của bạn
      </Typography>
      <Box
        sx={(theme) => ({
          marginTop: "40px",
          borderRadius: "10px",
          boxShadow: theme.shadows[3],
          padding: {
            xs: theme.spacing(2),
            md: theme.spacing(4),
          },
        })}
      >
        <FormBot
          bot={creatingBot}
          setBot={setCreatingBot}
          onSubmit={() => handleCreateBot()}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
          }}
        >
          <Button variant="contained" onClick={() => handleCreateBot()}>
            Tạo trợ lý AI
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Page;
