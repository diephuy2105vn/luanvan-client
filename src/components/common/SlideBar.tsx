"use client";
import {
  AdminPanelSettings,
  ChevronLeft,
  ChevronRight,
  Mail,
  MedicalServices,
  MoreVert,
  MoveToInbox,
  NotificationImportant,
  Notifications,
  ShoppingCart,
  SmartToy,
  ToysOutlined,
  Widgets,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  Drawer as MuiDrawer,
  Typography,
} from "@mui/material";
import { CSSObject, styled, Theme } from "@mui/material/styles";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import Logo from "@/assets/Logo.png";
import Image from "next/image";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import AssistantIcon from "@mui/icons-material/Assistant";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import NotificationContext from "@/contexts/NotificationContext";
import { NotificationBase } from "@/types/notification";
import botApi from "@/api/botApi";
import notificationApi from "@/api/notificationApi";
import { useAppDispatch, useAppSelector } from "@/hooks/common";
import { getUser, setUser } from "@/config/redux/userReducer";
import { deleteCookie } from "@/utils/cookie";
import { useSelector } from "react-redux";
const drawerWidth = 240;
const drawerHeaderHeight = 80;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `0px`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div", {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open: boolean }>(({ theme, open }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  transition: theme.transitions.create("height", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),

  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  ...(open && {
    height: `${drawerHeaderHeight}px`,
    "& .header_logo": {
      display: "block",
      height: `calc(${drawerHeaderHeight}px - 20px)`,
      width: `auto`,
      opacity: 1,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
  }),
  ...(!open && {
    "& .header_logo": {
      height: "0px",
      width: "0px",
      opacity: 0,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",

  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": {
      ...openedMixin(theme),
      borderRight: `1px solid ${theme.palette.primary.main}`,
    },
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": {
      ...closedMixin(theme),
      borderRight: `1px solid ${theme.palette.primary.main}`,
    },
  }),
}));

type SidebarProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  handleOpen: () => void;
  handleClose: () => void;
};

const Sidebar = ({ open, setOpen, handleOpen, handleClose }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { notifications, setNotifications } = useContext(NotificationContext);
  const [readedNotifications, setReadedNotifications] = useState<
    NotificationBase[]
  >([]);
  const router = useRouter();
  const logedUser = useAppSelector((state) => getUser(state));
  const handleReadNotification = async (notification: NotificationBase) => {
    if (!notification || !notification._id) {
      return;
    }
    const res = await notificationApi.markAsRead(notification._id);
    setNotifications((pre) => pre.filter((n) => n._id !== notification._id));
  };

  const handleConfirmInviteBot = async (botId: string) => {
    const res = await botApi.confirmInviteUser(botId, {});
  };

  const handleDeclineInviteBot = async (botId: string) => {
    const res = await botApi.declineInviteUser(botId, {});
  };

  const [anchorElMenuNotifications, setAnchorElMenuNotifications] =
    useState<null | HTMLElement>(null);
  const handleLogout = () => {
    dispatch(setUser(null));
    deleteCookie("SESSION");
    router.push("/login");
  };

  useEffect(() => {
    const readedNotifications = notifications.filter((n) => !n.read);
    setReadedNotifications(readedNotifications);
  }, [notifications]);

  return (
    <>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader open={open}>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0",
            }}
          >
            {open && <Image className="header_logo" src={Logo} alt="Logo" />}

            <IconButton onClick={open ? handleClose : handleOpen}>
              {open ? (
                <ChevronLeft style={{ fontSize: "24px" }} />
              ) : (
                <ChevronRight style={{ fontSize: "24px" }} />
              )}
            </IconButton>
          </Box>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            {
              text: "Trang chủ",
              href: "/",
              icon: <HomeIcon />,
            },
            {
              text: "Trò chuyện",
              href: "/chat",
              icon: <ChatIcon />,
            },
            {
              text: "Trợ lý AI",
              href: "/management",
              icon: <SmartToy />,
            },
            {
              text: "Dữ liệu",
              href: "/data",
              icon: <DataUsageIcon />,
            },
            {
              text: "Gói dịch vụ",
              href: "/pack",
              icon: <ShoppingCart />,
            },
            logedUser?.role === "admin" && {
              text: "Admin",
              href: "/admin/chart",
              icon: <AdminPanelSettings />,
            },
          ]
            .filter((item) => item)
            .map((item) => {
              return (
                <ListItem
                  key={item.text}
                  disablePadding
                  sx={(theme) => ({
                    display: "block",
                    color:
                      pathname == "" ||
                      pathname == item.href ||
                      (item.href !== "/" && pathname.includes(item.href))
                        ? theme.palette.primary.main
                        : theme.palette.secondary.main,
                  })}
                  component={Link}
                  href={item.href}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? "initial" : "center",
                      px: 2.5,
                    }}
                  >
                    <ListItemIcon
                      sx={(theme) => ({
                        minWidth: 0,
                        mr: open ? 3 : "auto",
                        justifyContent: "center",
                        color:
                          pathname == "" ||
                          pathname == item.href ||
                          (item.href !== "/" && pathname.includes(item.href))
                            ? theme.palette.primary.main
                            : theme.palette.secondary.main,
                      })}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      sx={{
                        opacity: open ? 1 : 0,
                        fontWeight: "bold",
                      }}
                    >
                      <Typography sx={{ fontWeight: "500" }}>
                        {item.text}
                      </Typography>
                    </ListItemText>
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>
        <Divider />
        <List>
          <ListItem
            component={Link}
            href="/user"
            key="user"
            disablePadding
            sx={{ display: "block" }}
          >
            <ListItemButton
              sx={(theme) => ({
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
                color:
                  pathname == "" ||
                  pathname == "/user" ||
                  pathname.includes("/user")
                    ? theme.palette.primary.main
                    : theme.palette.secondary.main,
              })}
            >
              <ListItemIcon
                sx={(theme) => ({
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                  color:
                    pathname == "" ||
                    pathname == "/user" ||
                    pathname.includes("/user")
                      ? theme.palette.primary.main
                      : theme.palette.secondary.main,
                })}
              >
                <Badge
                  badgeContent={open ? 0 : readedNotifications.length}
                  color="error"
                >
                  <Avatar
                    sx={{
                      width: "24px",
                      height: "24px",
                    }}
                  />
                </Badge>
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ fontWeight: "500" }}>Tài khoản</Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setAnchorElMenuNotifications(e.currentTarget);
                    }}
                  >
                    <Badge
                      badgeContent={open ? readedNotifications.length : 0}
                      color="error"
                    >
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Box>
              </ListItemText>
            </ListItemButton>
            <Menu
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              sx={{
                maxHeight: "360px",
                ".MuiMenu-paper": {
                  padding: "4px 0",
                },
              }}
              anchorEl={anchorElMenuNotifications}
              open={!!anchorElMenuNotifications}
              onClose={() => setAnchorElMenuNotifications(null)}
            >
              {readedNotifications.map((notification) => (
                <Box
                  key={notification._id}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "8px 16px",
                    gap: "8px",
                    borderBottom: "1px solid #ccc",
                    justifyContent: "center",
                  }}
                >
                  {notification.content}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      size="small"
                      color="error"
                      onClick={() => {
                        handleReadNotification(notification);
                        handleDeclineInviteBot(
                          notification.metadata.bot_invite
                        );
                      }}
                    >
                      Từ chối
                    </Button>
                    <Button
                      onClick={() => {
                        handleReadNotification(notification);
                        handleConfirmInviteBot(
                          notification.metadata.bot_invite
                        );
                      }}
                      size="small"
                      variant="contained"
                      color="primary"
                    >
                      Đồng ý
                    </Button>
                  </Box>
                </Box>
              ))}
            </Menu>
          </ListItem>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={() => {
                handleLogout();
              }}
              sx={(theme) => ({
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              })}
            >
              <ListItemIcon
                sx={(theme) => ({
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                })}
              >
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText
                sx={{
                  opacity: open ? 1 : 0,
                }}
              >
                <Typography sx={{ fontWeight: "500" }}>Đăng xuất</Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Sidebar;
