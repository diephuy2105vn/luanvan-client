"use client";

import React, { useState, useEffect } from "react";
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
  tableCellClasses,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import useBreakpoint from "@/hooks/useBreakpoins";
import adminApi from "@/api/adminApi";
import { styled } from "@mui/material";

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
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  const fetchOrder = async () => {
    const res = await adminApi.getOrders();
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleClickOpen = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleBulkDeleteOpen = () => {
    setBulkDeleteOpen(true);
  };

  const handleBulkDeleteClose = () => {
    setBulkDeleteOpen(false);
    setSelectedOrders([]);
  };

  const handleDelete = async () => {
    if (selectedOrder) {
      await adminApi.deleteOrder(selectedOrder._id);
      fetchOrder();
      handleClose();
    }
  };

  const handleBulkDelete = async () => {
    await Promise.all(selectedOrders.map((id) => adminApi.deleteOrder(id)));
    fetchOrder();
    handleBulkDeleteClose();
  };

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prevSelected) =>
      prevSelected.includes(orderId)
        ? prevSelected.filter((id) => id !== orderId)
        : [...prevSelected, orderId]
    );
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    const isExpired = new Date(order.expiration_date) < new Date();
    return filter === "expired" ? isExpired : !isExpired;
  });

  return (
    <Container>
      {breakpoint.sm && (
        <Typography variant="h5" sx={{ fontWeight: "500" }}>
          Đăng ký dịch vụ
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
        Danh sách người dùng đăng ký dịch vụ
      </Typography>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <Select size="small" value={filter} onChange={handleFilterChange}>
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="active">Còn hạn</MenuItem>
          <MenuItem value="expired">Hết hạn</MenuItem>
        </Select>
        {selectedOrders.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={handleBulkDeleteOpen}
          >
            Xóa đã chọn
          </Button>
        )}
      </div>

      <TableContainer component={Paper}>
        <Table size="small" sx={{ minWidth: 700 }}>
          <TableHead>
            <StyledTableRow>
              <StyledTableCell padding="checkbox">
                <Checkbox
                  size="small"
                  checked={
                    selectedOrders.length === filteredOrders.length &&
                    filteredOrders.length > 0
                  }
                  onChange={(e) =>
                    setSelectedOrders(
                      e.target.checked
                        ? filteredOrders.map((order) => order._id)
                        : []
                    )
                  }
                />
              </StyledTableCell>
              <StyledTableCell>Tên tài khoản</StyledTableCell>
              <StyledTableCell>Ngày đăng ký</StyledTableCell>
              <StyledTableCell>Ngày hết hạn</StyledTableCell>
              <StyledTableCell>Giá</StyledTableCell>
              <StyledTableCell>Tên gói</StyledTableCell>
              <StyledTableCell>Hành động</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {filteredOrders
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((order) => (
                <StyledTableRow key={order.id}>
                  <StyledTableCell padding="checkbox">
                    <Checkbox
                      size="small"
                      checked={selectedOrders.includes(order._id)}
                      onChange={() => handleCheckboxChange(order._id)}
                    />
                  </StyledTableCell>
                  <StyledTableCell>
                    {order.user_info?.username
                      ? order.user_info?.username
                      : "Đã xóa"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {new Date(order.order_date).toLocaleDateString()}
                  </StyledTableCell>
                  <StyledTableCell>
                    {new Date(order.expiration_date).toLocaleDateString()}
                  </StyledTableCell>
                  <StyledTableCell>{order.price}</StyledTableCell>
                  <StyledTableCell>
                    {order.pack ? order.pack.name : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>
                    <IconButton onClick={() => handleClickOpen(order)}>
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
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Single Delete Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Xác nhận xóa"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa đơn hàng này không?
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
            Bạn có chắc chắn muốn xóa các đơn hàng đã chọn không?
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
