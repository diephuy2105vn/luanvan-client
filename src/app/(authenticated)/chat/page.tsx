"use client";
import botApi from "@/api/botApi";
import { HEADER_HEIGHT_SM } from "@/components/common/Header";
import ChatBotFrame from "@/components/frame/ChatBotFrame";
import ChatBotList from "@/components/list/ChatBotList";
import useBreakpoint from "@/hooks/useBreakpoins";
import { BotBase } from "@/types/bot";
import { Box, Button, Container, Drawer, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const Page = () => {
  const [searchValue, setSearchValue] = useState("");
  const [bots, setBots] = useState<BotBase[]>([]);
  const [totalBots, setTotalBots] = useState(0);
  const [selectedBot, setSelectedBot] = useState<BotBase | null>(null);
  const breakpoint = useBreakpoint();
  const [openDrawer, setOpenDrawer] = useState(false);

  const fetchBots = async () => {
    const res = await botApi.getAll();
    setBots(res.data);
    setTotalBots(res.total);
  };

  useEffect(() => {
    fetchBots();
  }, []);

  return (
    <Container maxWidth={false} disableGutters={true}>
      <Box
        sx={{
          display: "flex",
          height: breakpoint.sm
            ? "100vh"
            : `calc(100vh - ${HEADER_HEIGHT_SM}px)`,
          maxHeight: "-webkit-fill-available",
        }}
      >
        {breakpoint.md && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "280px",
              borderRight: (theme) => `1px solid ${theme.palette.grey[300]}`,
            }}
          >
            <ChatBotList
              bots={bots}
              selected={selectedBot}
              setSelected={setSelectedBot}
            />
          </Box>
        )}
        <Box sx={{ flex: 1 }}>
          {selectedBot ? (
            <ChatBotFrame
              bot={selectedBot}
              openDrawer={!breakpoint.md ? openDrawer : null}
              setOpenDrawer={!breakpoint.md ? setOpenDrawer : null}
              showChatHistory={true}
            />
          ) : (
            <Box
              sx={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <Typography
                sx={(theme) => ({
                  fontSize: "2rem",
                  color: theme.palette.grey[700],
                })}
              >
                * Vui lòng chọn trợ lý AI
              </Typography>
              {!breakpoint.md && (
                <Button
                  variant="contained"
                  onClick={() => {
                    setOpenDrawer(true);
                  }}
                >
                  Chọn trợ lý AI
                </Button>
              )}
            </Box>
          )}
        </Box>
        {!breakpoint.md && (
          <Drawer
            open={openDrawer}
            onClose={() => {
              setOpenDrawer(false);
            }}
          >
            <ChatBotList
              bots={bots}
              selected={selectedBot}
              setSelected={setSelectedBot}
            />
          </Drawer>
        )}
      </Box>
    </Container>
  );
};

export default Page;
