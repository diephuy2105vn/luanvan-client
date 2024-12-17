import { BotBase } from "@/types/bot";
import {
  AddComment,
  History,
  HistoryToggleOff,
  Inventory,
  Menu,
  RotateLeftOutlined,
  Send,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, {
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ChatMessage from "@/components/ChatMessage";
import { ChatHistory } from "@/types/chat_history";
import useBreakpoint from "@/hooks/useBreakpoins";
import botApi from "@/api/botApi";
import { formatTime, getColorFromInitial, getInitials } from "@/utils";
import chatHistoryApi from "@/api/chatHistoryApi";
import SocketContext from "@/contexts/SocketContext";
import AlertContext from "@/contexts/AlertContext";
import { ChatMessage as ChatMessageType } from "@/types/chat_message";
import CustomModal from "../common/Modal";
const ChatBotFrame = ({
  bot,
  openDrawer = null,
  setOpenDrawer = null,
  showChatHistory = false,
  token,
}: {
  bot: BotBase;
  openDrawer?: boolean | null;
  setOpenDrawer?: React.Dispatch<React.SetStateAction<boolean>> | null;
  showChatHistory?: boolean;
  token?: string | null;
}) => {
  const { showAlert } = useContext(AlertContext);
  const { socket } = useContext(SocketContext);

  const [selectedChatHistory, setSelectedChatHistory] =
    useState<ChatHistory | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | ArrayBuffer | null>(null);

  const [totalChatHistories, setTotalChatHistories] = useState(0);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [openModalHistoryChat, setOpenModalHistoryChat] = useState(false);
  const handleToggleModalHistoryChat = () => {
    setOpenModalHistoryChat((pre) => !pre);
  };

  const previousChatHistory = useRef<ChatHistory | null>(null);

  // State chat message
  const [newQuestion, setNewQuestion] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchAvatar = async () => {
    if (!bot._id || !bot.avatar_source) {
      setAvatarSrc(null);
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (bot?._id && bot.avatar_source) {
      const res = await botApi.getAvatar(bot?._id, undefined, config);
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64data = reader.result;
        setAvatarSrc(base64data);
      };
      reader.readAsDataURL(res as Blob);
    }
  };

  const fetchChatHistory = async () => {
    const config = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined;
    if (!bot?._id || !socket) {
      // showAlert("Kết nối không ổn định vui lòng thử lại sau", "error");
      return;
    }
    const res = (await chatHistoryApi.joinChat(
      bot._id,
      undefined,
      config
    )) as ChatHistory;
    setSelectedChatHistory(res);
  };

  const fetchChatHistories = async () => {
    if (!bot._id || !showChatHistory) {
      return;
    }
    const res = await chatHistoryApi.getChatsByBotId(bot._id);
    setTotalChatHistories(res.total);
    setChatHistories(res.data);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  const handleSendMessage = async () => {
    if (!newQuestion.trim()) {
      return;
    }
    if (!bot?._id || !socket || !selectedChatHistory?._id) {
      showAlert("Kết nối không ổn định vui lòng thử lại sau", "error");
      return;
    }
    try {
      console.log(selectedChatHistory);
      socket.emit("join_chat", {
        bot_id: bot._id,
        chat_history_id: selectedChatHistory._id,
      });
      socket.emit("send_message", { message: newQuestion });
      const newMessage: ChatMessageType = {
        chat_history_id: selectedChatHistory._id,
        question: newQuestion,
        answer: "",
        loading: true,
      };
      setSelectedChatHistory((pre) =>
        pre
          ? {
              ...pre,
              list_messages: [...pre.list_messages, newMessage],
            }
          : null
      );
      setNewQuestion("");

      scrollToBottom();
    } catch (err) {
      showAlert("Đã có lỗi xảy ra", "error");
    }
  };
  useEffect(() => {
    fetchAvatar();
    fetchChatHistory();
    if (showChatHistory) {
      fetchChatHistories();
    }
  }, [bot]);

  const handleClickChatHistory = async (chatHistory: ChatHistory) => {
    const res = await chatHistoryApi.getMessages(chatHistory._id as string);
    chatHistory.list_messages = res.data;
    setSelectedChatHistory(chatHistory);
    handleToggleModalHistoryChat();
  };

  useEffect(() => {
    const handleJoinChat = async () => {
      if (!socket) {
        showAlert("Kết nối không ổn định vui lòng thử lại sau", "error");
        return;
      }
      if (!selectedChatHistory?._id) {
        return;
      }
      try {
        socket.emit("join_chat", {
          bot_id: bot._id,
          chat_history_id: selectedChatHistory._id,
        });
        socket.on("message", ({ message }) => {
          setSelectedChatHistory((pre) => {
            if (!pre) {
              return null;
            }
            const list_messages = [...pre.list_messages];
            list_messages[list_messages.length - 1] = {
              ...list_messages[list_messages.length - 1],
              source: message.source,
              answer: message.answer,
              suggest_question: message.suggest_question,
              loading: false,
            };

            return {
              ...pre,
              list_messages: list_messages,
            };
          });

          scrollToBottom();
        });
      } catch (err) {
        showAlert("Đã có lỗi xảy ra", "error");
      }
    };

    const handleLeaveChat = async () => {
      if (!previousChatHistory?.current?._id || !socket) {
        return;
      }
      socket?.emit("leave_chat");
    };
    handleJoinChat();

    return () => {
      handleLeaveChat();
      previousChatHistory.current = selectedChatHistory;
    };
  }, [selectedChatHistory?._id]);

  const backgroundColor = !bot?.avatar_source
    ? getColorFromInitial(bot.name?.charAt(0))
    : undefined;
  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <Box
        sx={{
          height: "80px",
          borderBottom: "1px solid #ccc",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <Avatar
            sx={{
              width: "40px",
              height: "40px",
              backgroundColor: backgroundColor,
            }}
            src={avatarSrc ? (avatarSrc as string) : ""}
          >
            {!avatarSrc && (
              <Typography fontSize={14} fontWeight={500}>
                {getInitials(bot?.name, 2)}
              </Typography>
            )}
          </Avatar>
          <Typography sx={{ fontSize: "1.6rem", fontWeight: "500" }}>
            {bot.name}
          </Typography>
        </Box>
        <Box>
          {showChatHistory && (
            <Tooltip title="Lịch sử trò chuyện" arrow={true}>
              <IconButton size="large" onClick={handleToggleModalHistoryChat}>
                <HistoryToggleOff fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Tạo mới trò chuyện" arrow={true}>
            <IconButton
              disabled={
                !selectedChatHistory ||
                selectedChatHistory?.list_messages?.length <= 0
              }
              size="large"
              onClick={() => {
                fetchChatHistory();
              }}
            >
              <AddComment fontSize="inherit" />
            </IconButton>
          </Tooltip>

          {/* Mobile */}
          {openDrawer !== null && (
            <Tooltip title="Mở danh sách trò chuyện" arrow={true}>
              <IconButton
                size="large"
                onClick={() => setOpenDrawer !== null && setOpenDrawer(true)}
              >
                <Menu fontSize="inherit" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>
      {/* Chat frame */}
      <Box
        sx={{
          overflowY: "auto",
          height: "calc(100% - 148px)",
          padding: "8px 0",
        }}
      >
        {selectedChatHistory?._id && (
          <ChatMessage
            key="MESSAGE-DESCRIPTION"
            message={{
              chat_history_id: selectedChatHistory._id,
              question: "",
              answer: bot.description,
            }}
          />
        )}
        {selectedChatHistory?.list_messages.map((message) => (
          <ChatMessage key={message._id} message={message} />
        ))}
        <div ref={chatEndRef} />
      </Box>
      <Box
        sx={{
          height: "68px",
          padding: "8px 20px",
          borderTop: "1px solid #ccc",
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ButtonGroup
            sx={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              border: "1px solid #ccc",
            }}
          >
            <Input
              sx={{ height: "100%", padding: "0 16px", flex: 1 }}
              placeholder="Nhập nội dung tin nhắn"
              disableUnderline={true}
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
            />
            <Button
              size="large"
              variant="contained"
              type="submit"
              disabled={!newQuestion.trim()}
            >
              <Send />
            </Button>
          </ButtonGroup>
        </form>
      </Box>
      <CustomModal
        open={openModalHistoryChat}
        onClose={() => handleToggleModalHistoryChat()}
      >
        <Box sx={{ width: "100%", height: "100%" }}>
          <Typography
            sx={(theme) => ({
              fontWeight: "500",
              fontSize: "2rem",
              color: theme.palette.grey[700],
            })}
          >
            Lịch sử trò chuyện
          </Typography>
          <Divider sx={{ margin: "8px 0" }} />

          {chatHistories.length > 0 ? (
            <List
              sx={{
                display: "flex",
                flexDirection: "column",
                maxHeight: "400px",
                overflowY: "auto",
                padding: "4px",
              }}
            >
              {chatHistories.map((chat) => (
                <ListItem
                  key={chat._id}
                  sx={{
                    padding: 0,
                    "& + &": {
                      borderTop: "1px solid #ccc",
                    },
                  }}
                >
                  <ListItemButton
                    onClick={() => handleClickChatHistory(chat)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography fontWeight="500">Trò chuyện mới</Typography>
                    <Typography fontSize={12}>
                      {formatTime(chat.created_at)}
                    </Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                padding: "16px 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Inventory
                sx={{
                  fontSize: "4rem",
                  color: (theme) => theme.palette.grey[500],
                }}
              />
              <Typography
                fontWeight="500"
                sx={{
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                Chưa có lịch sử trò chuyện
              </Typography>
            </Box>
          )}
        </Box>
      </CustomModal>
    </Box>
  );
};

export default ChatBotFrame;
