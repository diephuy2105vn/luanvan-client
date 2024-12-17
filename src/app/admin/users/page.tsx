"use client";

import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Checkbox,
  TextField,
  tableCellClasses,
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import useBreakpoint from "@/hooks/useBreakpoins";
import adminApi from "@/api/adminApi";
import { styled } from "@mui/material";
import { UserBase } from "@/types/user";
import { useSelector } from "react-redux";
import { getUser } from "@/config/redux/userReducer";
import AlertContext from "@/contexts/AlertContext";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "rgb(232, 220, 224)",
    color: theme.palette.common.black,
    fontWeight: 500,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: `rgba(${theme.palette.secondary.rgb}, 0.05)`,
  },
}));

const Page = () => {
  const breakpoint = useBreakpoint();
  const [users, setUsers] = useState<UserBase[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [createUserOpen, setCreateUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    role: "user",
    password: "",
    confirmPassword: "",
  });
  const logedUser = useSelector((state) => getUser(state));

  const { showAlert } = useContext(AlertContext);

  const fetchUser = async () => {
    const res = await adminApi.getUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const handleClickOpen = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleDelete = async () => {
    if (selectedUser) {
      await adminApi.deleteUser(selectedUser._id);
      fetchUser();
      handleClose();
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.includes(logedUser._id)) {
      showAlert("Bạn không thể xóa tài khoản của bạn!", "error");
      return;
    }
    await Promise.all(selectedUsers.map((id) => adminApi.deleteUser(id)));
    fetchUser();
    handleBulkDeleteClose();
  };

  const handleCreateUserOpen = () => setCreateUserOpen(true);
  const handleCreateUserClose = () => {
    setCreateUserOpen(false);
    setNewUser({
      username: "",
      role: "user",
      password: "",
      confirmPassword: "",
    });
  };

  const handleCreateUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUserSubmit = async () => {
    if (!newUser.password || !newUser.confirmPassword || !newUser.username) {
      showAlert("Vui lòng nhập đầy đủ thông tin", "error");
      return;
    }

    if (newUser.password !== newUser.confirmPassword) {
      showAlert("Mật khẩu xác nhận đã sai", "error");
      return;
    }

    try {
      await adminApi.register({ ...newUser });
      fetchUser();
      showAlert("Tạo người dùng thành công!", "success");
      handleCreateUserClose();
    } catch (error) {
      showAlert("Failed to create user", "error");
    }
  };

  const handleBulkDeleteOpen = () => {
    if (selectedUsers.includes(logedUser._id)) {
      showAlert("Bạn không thể xóa tài khoản của bạn!", "error");
      return;
    }
    setBulkDeleteOpen(true);
  };

  const handleBulkDeleteClose = () => {
    setBulkDeleteOpen(false);
    setSelectedUsers([]);
  };

  const filteredUsers = users.filter((user) => {
    if (filter === "all") return true;
    return user.role === filter;
  });

  return (
    <Container>
      {breakpoint.sm && (
        <Typography variant="h5" sx={{ fontWeight: "500" }}>
          Người dùng
        </Typography>
      )}
      <Typography
        sx={(theme) => ({
          fontWeight: "500",
          fontSize: "1.6rem",
          color: theme.palette.grey[600],
          marginBottom: "8px",
        })}
      >
        Danh sách người dùng
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <Select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="admin">Quản trị viên</MenuItem>
          <MenuItem value="user">Người dùng</MenuItem>
        </Select>
        <div>
          {selectedUsers.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleBulkDeleteOpen}
            >
              Xóa đã chọn
            </Button>
          )}
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleCreateUserOpen}
            sx={{ ml: 1 }}
          >
            Tạo người dùng
          </Button>
        </div>
      </div>
      <TableContainer component={Paper}>
        <Table size="small" sx={{ minWidth: 700 }}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell padding="checkbox">
                <Checkbox
                  size="small"
                  checked={
                    selectedUsers.length === filteredUsers.length &&
                    filteredUsers.length > 0
                  }
                  onChange={(e) =>
                    setSelectedUsers(
                      e.target.checked
                        ? filteredUsers.map((user) => user._id)
                        : []
                    )
                  }
                />
              </StyledTableCell>
              <StyledTableCell>Tên tài khoản</StyledTableCell>
              <StyledTableCell>Tên</StyledTableCell>
              <StyledTableCell>Số điện thoại</StyledTableCell>
              <StyledTableCell>Vai trò</StyledTableCell>
              {/* <StyledTableCell>Gói đăng kí</StyledTableCell> */}
              <StyledTableCell>Hành động</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {filteredUsers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user) => (
                <StyledTableRow key={user._id}>
                  <StyledTableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleCheckboxChange(user._id)}
                    />
                  </StyledTableCell>
                  <StyledTableCell>{user.username}</StyledTableCell>
                  <StyledTableCell>{user.full_name}</StyledTableCell>
                  <StyledTableCell>{user.phone_number}</StyledTableCell>
                  <StyledTableCell>
                    {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                  </StyledTableCell>
                  {/* <StyledTableCell>{user.pack?.name}</StyledTableCell> */}
                  <StyledTableCell>
                    <IconButton
                      disabled={user._id === logedUser?._id}
                      onClick={() => handleClickOpen(user)}
                    >
                      <Delete />
                    </IconButton>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Create User Dialog */}
      <Dialog open={createUserOpen} onClose={handleCreateUserClose}>
        <DialogTitle>Tạo người dùng mới</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên tài khoản"
            type="text"
            fullWidth
            name="username"
            value={newUser.username}
            onChange={handleCreateUserChange}
            required
          />
          <Select
            label="Quyền"
            name="role"
            value={newUser.role}
            onChange={handleCreateUserChange}
            fullWidth
            margin="dense"
          >
            <MenuItem value="user">Người dùng</MenuItem>
            <MenuItem value="admin">Quản trị viên</MenuItem>
          </Select>
          <TextField
            margin="dense"
            label="Mật khẩu"
            type="password"
            fullWidth
            name="password"
            value={newUser.password}
            onChange={handleCreateUserChange}
            required
          />
          <TextField
            margin="dense"
            label="Xác nhận mật khẩu"
            type="password"
            fullWidth
            name="confirmPassword"
            value={newUser.confirmPassword}
            onChange={handleCreateUserChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCreateUserClose}>Hủy</Button>
          <Button onClick={handleCreateUserSubmit} color="primary">
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa người dùng này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Hủy</Button>
          <Button onClick={handleDelete} color="error" autoFocus>
            Xóa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bulk Delete Dialog */}
      <Dialog
        open={bulkDeleteOpen}
        onClose={handleBulkDeleteClose}
        aria-labelledby="bulk-delete-dialog-title"
        aria-describedby="bulk-delete-dialog-description"
      >
        <DialogTitle id="bulk-delete-dialog-title">
          {"Xác nhận xóa"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="bulk-delete-dialog-description">
            Bạn có chắc chắn muốn xóa người dùng đã chọn không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBulkDeleteClose}>Hủy</Button>
          <Button onClick={handleBulkDelete} color="error" autoFocus>
            Xóa đã chọn
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Page;
