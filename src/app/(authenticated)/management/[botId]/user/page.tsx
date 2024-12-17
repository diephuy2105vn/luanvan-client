"use client";

import botApi from "@/api/botApi";
import userApi from "@/api/userApi";
import Filter, { FilterType } from "@/components/common/Filter";
import { MenuItemProps } from "@/components/common/Menu";
import CustomModal from "@/components/common/Modal";
import CustomSearch from "@/components/common/Search";
import UserPermissionTable from "@/components/table/UserPermissionTable";
import { RootState } from "@/config/redux/store";
import { getUserPack } from "@/config/redux/userReducer";
import AlertContext from "@/contexts/AlertContext";
import useSetValueTimeout from "@/hooks/useSetValueTimeOut";
import {
  BotBase,
  getPermissionLabel,
  PermissionEnum,
  UserPermission,
} from "@/types/bot";
import { UserBase } from "@/types/user";
import {
  AdminPanelSettingsOutlined,
  ArrowDownward,
  ArrowUpward,
  Close,
  DeleteOutline,
  FilterAlt,
  Person,
  PersonAddOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Chip,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  ListItemIcon,
  MenuItem,
  Popper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useParams } from "next/navigation";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
const Page = () => {
  const { showAlert } = useContext(AlertContext);

  const { botId } = useParams();
  const [bot, setBot] = useState<BotBase | null>(null);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);

  // Pagination
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState<FilterType>({
    sort: "",
  });

  // State add user
  const inputFindUsernameRef = useRef<HTMLDivElement>(null);
  const [openModalAddUser, setOpenModalAddUser] = useState(false);
  const [findingUsernameValue, setFindingUsernameValue] = useState("");
  const findingUsernameSearch = useSetValueTimeout(findingUsernameValue, 1000);
  const [findedUsers, setFindedUsers] = useState<UserBase[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserBase[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<
    PermissionEnum[]
  >([]);

  const [updatingUser, setUpdatingUser] = useState<UserPermission | null>(null);

  const [anchorElFindedUser, setAnchorElFindedUser] =
    useState<null | HTMLElement>(null);

  // State delete user
  const [deletingUser, setDeletingUser] = useState<UserPermission | null>(null);
  const changedSearchValue = useSetValueTimeout(searchValue, 1000);

  const menuItems: (item: UserPermission) => MenuItemProps[] = useCallback(
    (item: UserPermission) => [
      // {
      //   key: "1",
      //   label: "Thay đổi quyền",
      //   action: (metaData) => {
      //     handleToggleModalUpdateUser(metaData);
      //   },
      //   icon: AdminPanelSettingsOutlined,
      //   disabled: item?.user?._id === bot?.owner,
      // },
      {
        key: "1",
        label: "Xóa",
        action: (metaData) => {
          setDeletingUser(metaData);
        },
        icon: DeleteOutline,
        color: "error",
        disabled: item?.user?._id === bot?.owner,
      },
    ],
    [bot]
  );

  const fetchBot = async () => {
    const res = await botApi.getById(botId as string);
    setBot(res as BotBase);
  };

  const fetchUserPermissions = async () => {
    const res = await botApi.getListUserByBotId(botId as string, {
      username: changedSearchValue.trim(),
    });
    setUserPermissions(res as UserPermission[]);
  };

  // Handle add user
  const handleClosePopover = () => {
    setAnchorElFindedUser(null);
    setFindedUsers([]);
  };

  const handleToggleModalAddUser = () => {
    findingUsernameSearch && setFindingUsernameValue("");
    selectedUsers.length > 0 && setSelectedUsers([]);
    selectedPermissions.length > 0 && setSelectedPermissions([]);

    setOpenModalAddUser((pre) => !pre);
  };

  const handleAddUser = async () => {
    const userPermissions = selectedUsers.map((user) => ({
      user_id: user._id,
      permissions: selectedPermissions,
    }));
    try {
      if (userPermissions.length <= 0) {
        showAlert("Vui lòng chọn người dùng cần thêm", "warning");
        return;
      }
      const invitePromises = userPermissions.map((userPermission) =>
        botApi.inviteUser(botId as string, userPermission)
      );

      await Promise.all(invitePromises);
      showAlert("Đã gửi lời mời tham gia trợ lý AI", "success");
      handleToggleModalAddUser();
      fetchUserPermissions();
    } catch (error) {
      showAlert("Đã có lỗi xảy ra", "error");
      handleToggleModalAddUser();
    }
  };

  const handleToggleModalUpdateUser = (user?: UserPermission) => {
    setUpdatingUser(user ? user : null);
  };

  const handleUpdateUser = async () => {
    try {
      if (!updatingUser) {
        return;
      }

      const userPermissions = {
        user_id: updatingUser.user?._id,
        permissions: updatingUser.permissions,
      };

      const res = await botApi.editUserPermission(
        botId as string,
        userPermissions
      );
      showAlert("Cập nhật quyền người dùng thành công", "success");
      handleToggleModalUpdateUser();
      fetchUserPermissions();
    } catch (error) {
      showAlert("Đã có lỗi xảy ra", "error");
      handleToggleModalUpdateUser();
    }
  };

  // Handle delete user
  const handleToggleModalDeleteUser = (user?: UserPermission) => {
    setDeletingUser(user ? user : null);
  };

  const handleDeleteUser = async () => {
    try {
      if (!deletingUser || !deletingUser.user) {
        throw new Error();
      }
      await botApi.deleteUserPermission(botId as string, deletingUser.user._id);
      showAlert("Xóa thành công", "success");
      handleToggleModalDeleteUser();
      fetchUserPermissions();
    } catch (error) {
      showAlert("Đã có lỗi xảy ra", "error");
    }
  };

  useEffect(() => {
    fetchBot();
  }, []);

  useEffect(() => {
    fetchUserPermissions();
  }, [changedSearchValue]);

  useEffect(() => {
    const handleFindUserByUsername = async () => {
      const res = await userApi.getAll({
        username: findingUsernameSearch,
      });
      setAnchorElFindedUser(inputFindUsernameRef.current);
      setFindedUsers(res.data);
    };

    if (findingUsernameSearch.trim()) {
      handleFindUserByUsername();
    } else {
      handleClosePopover();
    }
  }, [findingUsernameSearch]);

  return (
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
      <Grid
        container
        sx={{ marginBottom: "16px" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item xs={10} md={4}>
          <Box sx={{ display: "flex", gap: "8px" }}>
            <CustomSearch
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              size="small"
            />
            {/* <Filter
              icon={FilterAlt}
              filter={filter}
              setFilter={setFilter}
              items={[
                {
                  key: "1",
                  name: "sort",
                  label: "Ngày tạo",
                  value: "ASC",
                  icon: ArrowUpward,
                },
                {
                  key: "2",
                  name: "sort",
                  label: "Ngày tạo",
                  value: "DESC",
                  icon: ArrowDownward,
                },
              ]}
            /> */}
          </Box>
        </Grid>
        <Grid>
          <Button
            onClick={() => {
              handleToggleModalAddUser();
            }}
            startIcon={<PersonAddOutlined />}
            variant="outlined"
          >
            Thêm
          </Button>
        </Grid>
      </Grid>
      <UserPermissionTable
        bot={bot}
        userPermissions={userPermissions}
        menuItems={menuItems}
        page={currentPage}
        setPage={setCurrentPage}
        total={totalPage}
      />
      <CustomModal
        open={openModalAddUser}
        onClose={() => handleToggleModalAddUser()}
      >
        <Typography
          sx={(theme) => ({
            fontWeight: "500",
            fontSize: "2rem",
            color: theme.palette.grey[700],
            marginBottom: "16px",
          })}
        >
          Thêm người dùng
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Tên tài khoản"
              placeholder="Vui lòng nhập tên tài khoản người dùng"
              ref={inputFindUsernameRef}
              value={findingUsernameValue}
              onChange={(e) => {
                setFindingUsernameValue(e.currentTarget.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {selectedUsers.length > 0 ? (
                      selectedUsers.map((user) => (
                        <Chip
                          key={user._id}
                          sx={{ padding: "2px 0" }}
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <Avatar
                                sx={{
                                  width: "24px",
                                  height: "24px",
                                }}
                              />
                              <Typography
                                sx={{
                                  fontSize: "1.4rem",
                                }}
                              >
                                {user.username}
                              </Typography>
                              <IconButton
                                size="small"
                                onClick={() =>
                                  setSelectedUsers((pre) =>
                                    pre.filter((p) => p._id !== user._id)
                                  )
                                }
                              >
                                <Close
                                  sx={{
                                    fontSize: "16px",
                                  }}
                                />
                              </IconButton>
                            </Box>
                          }
                        />
                      ))
                    ) : (
                      <Person />
                    )}
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
            <Popper
              open={findedUsers.length > 0 && !!anchorElFindedUser}
              anchorEl={anchorElFindedUser}
              placement="bottom-start"
              sx={(theme) => ({
                zIndex: 1300,
                marginTop: "4px",
                backgroundColor: "white",
                boxShadow: theme.shadows[20],
              })}
            >
              {findedUsers
                .filter(
                  (fUser) =>
                    !selectedUsers.some((sUser) => sUser._id === fUser._id) &&
                    !userPermissions.some((per) => per.user?._id === fUser._id)
                )
                .map((fUser) => (
                  <MenuItem
                    key={fUser._id}
                    onClick={() => {
                      setSelectedUsers((pre) => [...pre, fUser]);
                      setFindingUsernameValue("");
                      handleClosePopover();
                    }}
                    sx={{
                      width: anchorElFindedUser
                        ? anchorElFindedUser.clientWidth
                        : "auto",
                      gap: "10px",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: "30px",
                        height: "30px",
                      }}
                    />
                    <Typography sx={{ fontSize: "1.4rem" }}>
                      {fUser?.username}
                    </Typography>
                  </MenuItem>
                ))}
            </Popper>
          </Grid>
          {/* <Grid item xs={12}> 
            <FormControl fullWidth>
              <InputLabel>Quyền</InputLabel>
              <Select
                multiple
                label="Quyền"
                value={selectedPermissions}
                renderValue={(selected) => (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                    }}
                  >
                    {selected.map((value) => {
                      return (
                        <Chip key={value} label={getPermissionLabel(value)} />
                      );
                    })}
                  </Box>
                )}
              >
                 <MenuItem
                  onClick={() => {
                    setSelectedPermissions((prev) => {
                      if (prev.includes(PermissionEnum.WRITE_FILE)) {
                        return prev;
                      }

                      const updatedPermissions = prev.includes(
                        PermissionEnum.READ_FILE
                      )
                        ? prev.filter(
                            (perm) => perm !== PermissionEnum.READ_FILE
                          )
                        : [...prev, PermissionEnum.READ_FILE];
                      return updatedPermissions;
                    });
                  }}
                  key={PermissionEnum.READ_FILE}
                  value={PermissionEnum.READ_FILE}
                >
                  <ListItemIcon>
                    <Checkbox
                      sx={{
                        padding: "0",
                        "& svg": {
                          width: "1.6rem",
                          height: "1.6rem",
                        },
                      }}
                      size="small"
                      checked={selectedPermissions.includes(
                        PermissionEnum.READ_FILE
                      )}
                    />
                  </ListItemIcon>
                  {getPermissionLabel(PermissionEnum.READ_FILE)}
                </MenuItem> 
                <MenuItem
                  onClick={() => {
                    setSelectedPermissions((prev) => {
                      const updatedPermissions = prev.includes(
                        PermissionEnum.WRITE_FILE
                      )
                        ? prev.filter(
                            (perm) => perm !== PermissionEnum.WRITE_FILE
                          )
                        : prev.includes(PermissionEnum.READ_FILE)
                        ? [...prev, PermissionEnum.WRITE_FILE]
                        : [
                            ...prev,
                            PermissionEnum.WRITE_FILE,
                            PermissionEnum.READ_FILE,
                          ];
                      return updatedPermissions;
                    });
                  }}
                  key={PermissionEnum.WRITE_FILE}
                  value={PermissionEnum.WRITE_FILE}
                >
                  <ListItemIcon>
                    <Checkbox
                      sx={{
                        padding: "0",
                        "& svg": {
                          width: "1.6rem",
                          height: "1.6rem",
                        },
                      }}
                      size="small"
                      checked={selectedPermissions.includes(
                        PermissionEnum.WRITE_FILE
                      )}
                    />
                  </ListItemIcon>
                      Quản trị dữ liệu
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setSelectedPermissions((prev) => {
                      if (prev.includes(PermissionEnum.WRITE_USER)) {
                        return prev;
                      }

                      const updatedPermissions = prev.includes(
                        PermissionEnum.READ_USER
                      )
                        ? prev.filter(
                            (perm) => perm !== PermissionEnum.READ_USER
                          )
                        : [...prev, PermissionEnum.READ_USER];

                      return updatedPermissions;
                    });
                  }}
                  key={PermissionEnum.READ_USER}
                  value={PermissionEnum.READ_USER}
                >
                  <ListItemIcon>
                    <Checkbox
                      sx={{
                        padding: "0",
                        "& svg": {
                          width: "1.6rem",
                          height: "1.6rem",
                        },
                      }}
                      size="small"
                      checked={selectedPermissions.includes(
                        PermissionEnum.READ_USER
                      )}
                    />
                  </ListItemIcon>
                  {getPermissionLabel(PermissionEnum.READ_USER)}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setSelectedPermissions((prev) => {
                      const updatedPermissions = prev.includes(
                        PermissionEnum.WRITE_USER
                      )
                        ? prev.filter(
                            (perm) => perm !== PermissionEnum.WRITE_USER
                          )
                        : prev.includes(PermissionEnum.READ_USER)
                        ? [...prev, PermissionEnum.WRITE_USER]
                        : [
                            ...prev,
                            PermissionEnum.WRITE_USER,
                            PermissionEnum.READ_USER,
                          ];
                      return updatedPermissions;
                    });
                  }}
                  key={PermissionEnum.WRITE_USER}
                  value={PermissionEnum.WRITE_USER}
                >
                  <ListItemIcon>
                    <Checkbox
                      sx={{
                        padding: "0",
                        "& svg": {
                          width: "1.6rem",
                          height: "1.6rem",
                        },
                      }}
                      size="small"
                      checked={selectedPermissions.includes(
                        PermissionEnum.WRITE_USER
                      )}
                    />
                  </ListItemIcon>
                  {getPermissionLabel(PermissionEnum.WRITE_USER)}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid> */}
        </Grid>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <Button
            color="error"
            onClick={() => {
              handleToggleModalAddUser();
            }}
          >
            Hủy
          </Button>
          <Button variant="contained" onClick={handleAddUser}>
            Xác nhận
          </Button>
        </Box>
      </CustomModal>
      <CustomModal
        open={!!updatingUser}
        onClose={() => handleToggleModalUpdateUser()}
      >
        <Typography
          sx={(theme) => ({
            fontWeight: "500",
            fontSize: "2rem",
            color: theme.palette.grey[700],
            marginBottom: "16px",
          })}
        >
          Cập nhật người dùng
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Quyền</InputLabel>
              <Select
                multiple
                label="Quyền"
                value={
                  updatingUser?.permissions ? updatingUser.permissions : []
                }
                renderValue={(selected) => (
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 0.5,
                    }}
                  >
                    {selected.map((value) => {
                      return (
                        <Chip key={value} label={getPermissionLabel(value)} />
                      );
                    })}
                  </Box>
                )}
              >
                <MenuItem
                  onClick={() => {
                    setUpdatingUser((prev) => {
                      if (!prev) {
                        return null;
                      }
                      const permissions = prev.permissions;
                      if (permissions?.includes(PermissionEnum.WRITE_FILE)) {
                        return prev;
                      }

                      const updatedPermissions = permissions.includes(
                        PermissionEnum.READ_FILE
                      )
                        ? permissions.filter(
                            (perm) => perm !== PermissionEnum.READ_FILE
                          )
                        : [...permissions, PermissionEnum.READ_FILE];

                      return {
                        ...prev,
                        permissions: updatedPermissions,
                      };
                    });
                  }}
                  key={PermissionEnum.READ_FILE}
                  value={PermissionEnum.READ_FILE}
                >
                  <ListItemIcon>
                    <Checkbox
                      sx={{
                        padding: "0",
                        "& svg": {
                          width: "1.6rem",
                          height: "1.6rem",
                        },
                      }}
                      size="small"
                      checked={updatingUser?.permissions?.includes(
                        PermissionEnum.READ_FILE
                      )}
                    />
                  </ListItemIcon>
                  {getPermissionLabel(PermissionEnum.READ_FILE)}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setUpdatingUser((prev) => {
                      if (!prev) {
                        return null;
                      }
                      const permissions = prev.permissions;
                      const updatedPermissions = permissions.includes(
                        PermissionEnum.WRITE_FILE
                      )
                        ? permissions.filter(
                            (perm) => perm !== PermissionEnum.WRITE_FILE
                          )
                        : permissions.includes(PermissionEnum.READ_FILE)
                        ? [...permissions, PermissionEnum.WRITE_FILE]
                        : [
                            ...permissions,
                            PermissionEnum.WRITE_FILE,
                            PermissionEnum.READ_FILE,
                          ];
                      return {
                        ...prev,
                        permissions: updatedPermissions,
                      };
                    });
                  }}
                  key={PermissionEnum.WRITE_FILE}
                  value={PermissionEnum.WRITE_FILE}
                >
                  <ListItemIcon>
                    <Checkbox
                      sx={{
                        padding: "0",
                        "& svg": {
                          width: "1.6rem",
                          height: "1.6rem",
                        },
                      }}
                      size="small"
                      checked={updatingUser?.permissions?.includes(
                        PermissionEnum.WRITE_FILE
                      )}
                    />
                  </ListItemIcon>
                  {getPermissionLabel(PermissionEnum.WRITE_FILE)}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setUpdatingUser((prev) => {
                      if (!prev) {
                        return null;
                      }

                      const permissions = prev.permissions;

                      if (permissions.includes(PermissionEnum.WRITE_USER)) {
                        return prev;
                      }

                      const updatedPermissions = permissions.includes(
                        PermissionEnum.READ_USER
                      )
                        ? permissions.filter(
                            (perm) => perm !== PermissionEnum.READ_USER
                          )
                        : [...permissions, PermissionEnum.READ_USER];

                      return {
                        ...prev,
                        permissions: updatedPermissions,
                      };
                    });
                  }}
                  key={PermissionEnum.READ_USER}
                  value={PermissionEnum.READ_USER}
                >
                  <ListItemIcon>
                    <Checkbox
                      sx={{
                        padding: "0",
                        "& svg": {
                          width: "1.6rem",
                          height: "1.6rem",
                        },
                      }}
                      size="small"
                      checked={updatingUser?.permissions.includes(
                        PermissionEnum.READ_USER
                      )}
                    />
                  </ListItemIcon>
                  {getPermissionLabel(PermissionEnum.READ_USER)}
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setUpdatingUser((prev) => {
                      if (!prev) {
                        return null;
                      }

                      const permissions = prev.permissions;
                      const updatedPermissions = permissions.includes(
                        PermissionEnum.WRITE_USER
                      )
                        ? permissions.filter(
                            (perm) => perm !== PermissionEnum.WRITE_USER
                          )
                        : permissions.includes(PermissionEnum.READ_USER)
                        ? [...permissions, PermissionEnum.WRITE_USER]
                        : [
                            ...permissions,
                            PermissionEnum.WRITE_USER,
                            PermissionEnum.READ_USER,
                          ];
                      return {
                        ...prev,
                        permissions: updatedPermissions,
                      };
                    });
                  }}
                  key={PermissionEnum.WRITE_USER}
                  value={PermissionEnum.WRITE_USER}
                >
                  <ListItemIcon>
                    <Checkbox
                      sx={{
                        padding: "0",
                        "& svg": {
                          width: "1.6rem",
                          height: "1.6rem",
                        },
                      }}
                      size="small"
                      checked={updatingUser?.permissions.includes(
                        PermissionEnum.WRITE_USER
                      )}
                    />
                  </ListItemIcon>
                  {getPermissionLabel(PermissionEnum.WRITE_USER)}
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <Button
            color="error"
            onClick={() => {
              handleToggleModalUpdateUser();
            }}
          >
            Hủy
          </Button>
          <Button variant="contained" onClick={handleUpdateUser}>
            Xác nhận
          </Button>
        </Box>
      </CustomModal>
      <CustomModal
        open={!!deletingUser}
        onClose={() => handleToggleModalDeleteUser()}
      >
        <Typography
          sx={(theme) => ({
            fontWeight: "500",
            fontSize: "2rem",
            color: theme.palette.error.main,
            marginBottom: "16px",
          })}
        >
          Xóa dữ liệu
        </Typography>
        <Typography
          sx={(theme) => ({
            marginBottom: "16px",
          })}
        >
          Hành động này không thể khôi phục, bạn chắc chắn muốn xóa dữ liệu ?
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
              handleToggleModalDeleteUser();
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleDeleteUser();
            }}
          >
            Xác nhận
          </Button>
        </Box>
      </CustomModal>
    </Box>
  );
};

export default Page;
