import { BotBase, BotCreate, isBotBase } from "@/types/bot";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormGroup,
  FormHelperText,
  Grid,
  Input,
  InputLabel,
  OutlinedInput,
  styled,
  SvgIcon,
  TextField,
  ToggleButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import UploadAvatar from "../upload/UploadAvatar";
import CheckButton from "../common/CheckButton";
import { Lock, Public } from "@mui/icons-material";
import useBreakpoint from "@/hooks/useBreakpoins";
import { preconnect } from "react-dom";
import botApi from "@/api/botApi";

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  height: "100%",
}));

const FormBot = ({
  bot,
  setBot,
  disabled = false,
  onSubmit,
}: {
  bot: BotBase | BotCreate;
  setBot: React.Dispatch<React.SetStateAction<BotBase | BotCreate>>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  disabled?: boolean;
}) => {
  const breakpoint = useBreakpoint();
  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);

  const fetchAvatar = async () => {
    const timestamp = new Date().getTime();
    const res = await botApi.getAvatar(bot._id as string, timestamp);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      setAvatar(base64data);
    };
    reader.readAsDataURL(res as Blob);
    return;
  };

  useEffect(() => {
    if (bot?.avatar_source) {
      fetchAvatar();
    }
  }, [bot.avatar_source]);

  return (
    <StyledForm
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(e);
      }}
    >
      <Grid container spacing={{ xs: 2, md: 4 }}>
        <Grid
          item
          xs={12}
          md={4}
          spacing={{ xs: 2, md: 4 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "16px",
              margin: "auto",
            }}
          >
            <UploadAvatar
              value={bot?.avatar}
              src={avatar ? (avatar as string) : ""}
              onChange={(file) => setBot((pre) => ({ ...pre, avatar: file }))}
              disabled={disabled}
              size={
                !breakpoint.sm ? "small" : !breakpoint.md ? "medium" : "large"
              }
              alt={bot?.name || ""}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              gap: {
                xs: "8px",
                md: "16px",
              },
            }}
          >
            <Typography
              sx={{
                fontWeight: "500",
                fontSize: "2rem",
                marginBottom: "4px",
              }}
            >
              Thông tin trợ lý AI
            </Typography>
            <TextField
              label="Tên trợ lý AI *"
              fullWidth
              placeholder="Vui lòng nhập tên trợ lý AI"
              value={bot?.name}
              onChange={(e) => {
                console.log(e);
                setBot((pre) => ({
                  ...pre,
                  name: e.target.value,
                }));
              }}
              disabled={disabled}
              required
            />
            <TextField
              label="Mô tả về trợ lý AI"
              fullWidth
              multiline={true}
              rows={3}
              placeholder="* Ví dụ: Tôi là trợ lý AI tôi sẽ giúp bạn giải quyết vấn đề về ... "
              value={bot?.description}
              onChange={(e) => {
                console.log(e);
                setBot((pre) => ({
                  ...pre,
                  description: e.target.value,
                }));
              }}
              disabled={disabled}
              required
            />
            {/* <Box
							sx={{ display: "flex", width: "100%", gap: "8px" }}>
							{[
								{
									key: "1",
									title: "GPT 3.5 Turbo Models",
									label: "Công cụ phản hồi",
									value: "gpt-3.5-turbo",
									helper: "Được phát triển bởi OpenAI",
									icon: (
										<SvgIcon>
											<svg
												stroke="currentColor"
												viewBox="0 0 50 50">
												<path d="M45.403,25.562c-0.506-1.89-1.518-3.553-2.906-4.862c1.134-2.665,0.963-5.724-0.487-8.237	c-1.391-2.408-3.636-4.131-6.322-4.851c-1.891-0.506-3.839-0.462-5.669,0.088C28.276,5.382,25.562,4,22.647,4	c-4.906,0-9.021,3.416-10.116,7.991c-0.01,0.001-0.019-0.003-0.029-0.002c-2.902,0.36-5.404,2.019-6.865,4.549	c-1.391,2.408-1.76,5.214-1.04,7.9c0.507,1.891,1.519,3.556,2.909,4.865c-1.134,2.666-0.97,5.714,0.484,8.234	c1.391,2.408,3.636,4.131,6.322,4.851c0.896,0.24,1.807,0.359,2.711,0.359c1.003,0,1.995-0.161,2.957-0.45	C21.722,44.619,24.425,46,27.353,46c4.911,0,9.028-3.422,10.12-8.003c2.88-0.35,5.431-2.006,6.891-4.535	C45.754,31.054,46.123,28.248,45.403,25.562z M35.17,9.543c2.171,0.581,3.984,1.974,5.107,3.919c1.049,1.817,1.243,4,0.569,5.967	c-0.099-0.062-0.193-0.131-0.294-0.19l-9.169-5.294c-0.312-0.179-0.698-0.177-1.01,0.006l-10.198,6.041l-0.052-4.607l8.663-5.001	C30.733,9.26,33,8.963,35.17,9.543z M29.737,22.195l0.062,5.504l-4.736,2.805l-4.799-2.699l-0.062-5.504l4.736-2.805L29.737,22.195z M14.235,14.412C14.235,9.773,18.009,6,22.647,6c2.109,0,4.092,0.916,5.458,2.488C28,8.544,27.891,8.591,27.787,8.651l-9.17,5.294	c-0.312,0.181-0.504,0.517-0.5,0.877l0.133,11.851l-4.015-2.258V14.412z M6.528,23.921c-0.581-2.17-0.282-4.438,0.841-6.383	c1.06-1.836,2.823-3.074,4.884-3.474c-0.004,0.116-0.018,0.23-0.018,0.348V25c0,0.361,0.195,0.694,0.51,0.872l10.329,5.81	L19.11,34.03l-8.662-5.002C8.502,27.905,7.11,26.092,6.528,23.921z M14.83,40.457c-2.171-0.581-3.984-1.974-5.107-3.919	c-1.053-1.824-1.249-4.001-0.573-5.97c0.101,0.063,0.196,0.133,0.299,0.193l9.169,5.294c0.154,0.089,0.327,0.134,0.5,0.134	c0.177,0,0.353-0.047,0.51-0.14l10.198-6.041l0.052,4.607l-8.663,5.001C19.269,40.741,17.001,41.04,14.83,40.457z M35.765,35.588	c0,4.639-3.773,8.412-8.412,8.412c-2.119,0-4.094-0.919-5.459-2.494c0.105-0.056,0.216-0.098,0.32-0.158l9.17-5.294	c0.312-0.181,0.504-0.517,0.5-0.877L31.75,23.327l4.015,2.258V35.588z M42.631,32.462c-1.056,1.83-2.84,3.086-4.884,3.483	c0.004-0.12,0.018-0.237,0.018-0.357V25c0-0.361-0.195-0.694-0.51-0.872l-10.329-5.81l3.964-2.348l8.662,5.002	c1.946,1.123,3.338,2.937,3.92,5.107C44.053,28.249,43.754,30.517,42.631,32.462z"></path>
											</svg>
										</SvgIcon>
									),
								},
								{
									key: "2",
									title: "Gemini 1.5 Flash",
									label: "Công cụ phản hồi",
									value: "gemini-1.5-flash",
									helper: "Được phát triển bởi Google",
									icon: (
										<SvgIcon>
											<svg
												stroke="currentColor"
												viewBox="0 0 50 50">
												<path d="M 26 2 C 13.308594 2 3 12.308594 3 25 C 3 37.691406 13.308594 48 26 48 C 35.917969 48 41.972656 43.4375 45.125 37.78125 C 48.277344 32.125 48.675781 25.480469 47.71875 20.9375 L 47.53125 20.15625 L 46.75 20.15625 L 26 20.125 L 25 20.125 L 25 30.53125 L 36.4375 30.53125 C 34.710938 34.53125 31.195313 37.28125 26 37.28125 C 19.210938 37.28125 13.71875 31.789063 13.71875 25 C 13.71875 18.210938 19.210938 12.71875 26 12.71875 C 29.050781 12.71875 31.820313 13.847656 33.96875 15.6875 L 34.6875 16.28125 L 41.53125 9.4375 L 42.25 8.6875 L 41.5 8 C 37.414063 4.277344 31.960938 2 26 2 Z M 26 4 C 31.074219 4 35.652344 5.855469 39.28125 8.84375 L 34.46875 13.65625 C 32.089844 11.878906 29.199219 10.71875 26 10.71875 C 18.128906 10.71875 11.71875 17.128906 11.71875 25 C 11.71875 32.871094 18.128906 39.28125 26 39.28125 C 32.550781 39.28125 37.261719 35.265625 38.9375 29.8125 L 39.34375 28.53125 L 27 28.53125 L 27 22.125 L 45.84375 22.15625 C 46.507813 26.191406 46.066406 31.984375 43.375 36.8125 C 40.515625 41.9375 35.320313 46 26 46 C 14.386719 46 5 36.609375 5 25 C 5 13.390625 14.386719 4 26 4 Z"></path>
											</svg>
										</SvgIcon>
									),
								},
							].map((item) => (
								<CheckButton
									key={item.key}
									valueCheck={
										item.value === bot.response_model
									}
									checked={bot.response_model === item.value}
									onClick={(value) => {
										if (disabled) {
											return;
										}
										setBot((pre) => ({
											...pre,
											response_model: item.value,
										}));
									}}
									size="small"
									icon={item.icon}
									typeCheck="radio"
									title={item.title}
									label={item.label}
									helper={item.helper}
									fullWidth
									disabled={disabled}
								/>
							))}
						</Box> */}
          </Box>
        </Grid>
      </Grid>
    </StyledForm>
  );
};

export default FormBot;
