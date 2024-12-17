"use client";

import botApi from "@/api/botApi";
import FormBot from "@/components/form/FormBot";
import { RootState } from "@/config/redux/store";
import { getUser, getUserPack } from "@/config/redux/userReducer";
import AlertContext from "@/contexts/AlertContext";
import { useAppSelector } from "@/hooks/common";
import useBreakpoint from "@/hooks/useBreakpoins";
import { BotBase, BotCreate, defaultBotCreate } from "@/types/bot";
import { Box, Button } from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Page = () => {
  const logedUser = useAppSelector((state) => getUser(state));
  const { showAlert } = useContext(AlertContext);
  const { botId } = useParams();
  const [bot, setBot] = useState<BotBase | null>(null);

  const [isDisabledField, setIsDisabledField] = useState(true);

  const toggleDisabledField = () => {
    setIsDisabledField(!isDisabledField);
  };

  const fetchBot = async () => {
    const res = await botApi.getById(botId as string);
    setBot(res as BotBase);
  };

  const handleSubmitFormBot = async () => {
    if (!bot) {
      return;
    }

    if (!bot.name.trim() || !bot.description.trim()) {
      showAlert("Vui lòng nhập đầy đủ dữ liệu", "error");
      return;
    }

    try {
      const updatingBot = {
        name: bot.name,
        description: bot.description,
        response_model: "gpt-3.5-turbo",
      };
      const res = await botApi.update(botId as string, updatingBot);
      if (bot.avatar) {
        const formData = new FormData();
        formData.append("avatar", bot.avatar);
        const res = await botApi.uploadAvatar(botId as string, formData);

        setBot(
          (pre) =>
            pre && {
              ...pre,
              avatar_source: res.avatar_source,
            }
        );
      }
      setBot(
        (pre) =>
          pre && {
            ...pre,
            name: res.name,
            description: res.description,
            response_model: res.response_model,
          }
      );
      showAlert("Cập nhật trợ lý AI thành công", "success");
      toggleDisabledField();
    } catch (error) {
      showAlert("Đã có lỗi xảy ra", "error");
    }
  };

  useEffect(() => {
    fetchBot();
  }, [botId]);

  return bot ? (
    <Box
      sx={(theme) => ({
        borderRadius: "10px",
        boxShadow: theme.shadows[3],
        padding: {
          xs: theme.spacing(2),
          md: theme.spacing(4),
        },
      })}
    >
      <FormBot
        bot={bot}
        setBot={
          setBot as React.Dispatch<React.SetStateAction<BotBase | BotCreate>>
        }
        disabled={isDisabledField}
        onSubmit={handleSubmitFormBot}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "20px",
        }}
      >
        {logedUser?._id === bot?.owner && (
          <Button
            variant="contained"
            onClick={() =>
              isDisabledField ? toggleDisabledField() : handleSubmitFormBot()
            }
          >
            {isDisabledField ? "Cập nhật" : "Lưu"}
          </Button>
        )}
      </Box>
    </Box>
  ) : (
    <></>
  );
};

export default Page;
