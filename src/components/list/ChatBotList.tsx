"use client";
import ChatBotCard from "@/components/card/ChatBotCard";
import { HEADER_HEIGHT_SM } from "@/components/common/Header";
import CustomSearch from "@/components/common/Search";
import useBreakpoint from "@/hooks/useBreakpoins";
import { BotBase } from "@/types/bot";
import { Box } from "@mui/material";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ChatBotList = ({
  bots,
  selected,
  setSelected,
}: {
  bots: BotBase[];
  selected: BotBase | null;
  setSelected: React.Dispatch<React.SetStateAction<BotBase | null>>;
}) => {
  const { botId } = useParams();

  const breakpoint = useBreakpoint();
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    if (botId) {
      const selectedBot = bots.find((bot) => bot?._id === botId);
      setSelected(selectedBot ? selectedBot : null);
    }
  }, [botId]);
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box
        sx={{
          height: breakpoint.sm ? "80px" : "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderBottom: "1px solid #ccc",
          padding: breakpoint.sm ? "16px 8px" : "8px 4px",
        }}
      >
        <CustomSearch
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
        />
      </Box>
      <Box
        sx={{
          overflowY: "auto",
          height: `calc(100% - 80px - ${
            !breakpoint.sm ? HEADER_HEIGHT_SM : "0"
          }px)`,
        }}
      >
        {bots?.map((bot, index) => (
          <Box
            key={bot._id}
            onClick={() => setSelected(bot)}
            component={Box}
            sx={{
              borderBottom: index < bots.length - 1 ? "1px solid #ccc" : "",
              cursor: "pointer",
            }}
          >
            <ChatBotCard bot={bot} active={selected?._id === bot._id} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ChatBotList;
