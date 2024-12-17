"use client";

import packApi from "@/api/packApi";
import packageApi from "@/api/packApi";
import userApi from "@/api/userApi";
import PackCard from "@/components/card/PackCard";
import CustomModal from "@/components/common/Modal";
import { getUserPack, getUser, setUser } from "@/config/redux/userReducer";
import AlertContext from "@/contexts/AlertContext";
import { useAppSelector } from "@/hooks/common";
import useBreakpoint from "@/hooks/useBreakpoins";
import { PackageType } from "@/types/package";
import { UserBase } from "@/types/user";
import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #ccc",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};
const Page = () => {
  const dispatch = useDispatch();
  const breakpoint = useBreakpoint();
  const [packages, setPackages] = useState<PackageType[]>([]);
  const fetchPackages = async () => {
    const res = await packageApi.getAll();
    setPackages(res.data);
  };
  const [newPack, setNewPack] = useState<PackageType | null>({
    name: "",
    type: "",
    price: "",
    numBot: "",
    capacity_bot: "",
    capacity_file: "",
  });
  const [editingPack, setEditingPack] = useState<PackageType | null>(null);
  const [deletingPack, setDeletingPack] = useState<PackageType | null>(null);
  const [openModalCreate, setOpenModalCreate] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const handleToggleModalCreate = () => {
    setOpenModalCreate((pre) => !pre);
  };
  const handleToggleModalEdit = () => {
    setOpenModalEdit((pre) => !pre);
  };
  const handleToggleModalDelete = () => {
    setOpenModalDelete((pre) => !pre);
  };
  const { showAlert } = useContext(AlertContext);

  const handleCreatePack = async () => {
    await packApi.create(newPack as PackageType);
    setNewPack({
      name: "",
      type: "",
      price: 0,
      numBot: 0,
      capacity_bot: 0,
      capacity_file: 0,
    });
    handleToggleModalCreate();
    fetchPackages();
  };

  const handleEditPack = async () => {
    await packApi.update(editingPack._id, editingPack);
    setEditingPack(null);
    handleToggleModalEdit();
    fetchPackages();
  };

  const handleDeletePack = async () => {
    await packApi.delete(deletingPack._id);
    setDeletingPack(null);
    handleToggleModalDelete();
    fetchPackages();
    showAlert("Xóa thành công", "success");
  };
  useEffect(() => {
    fetchPackages();
  }, []);

  return (
    <Container sx={{ paddingTop: "16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          {breakpoint.sm && (
            <Typography variant="h5" sx={{ fontWeight: "500" }}>
              Danh sách các gói dịch vụ
            </Typography>
          )}

          <Typography
            sx={(theme) => ({
              fontWeight: "500",
              fontSize: "1.6rem",
              color: theme.palette.grey[600],
            })}
          >
            Danh sách các gói dịch vụ
          </Typography>
        </div>
        <Button variant="contained" onClick={handleToggleModalCreate}>
          Thêm gói
        </Button>
      </div>

      <Grid
        container
        wrap="wrap"
        sx={(theme) => ({
          marginTop: "40px",
          padding: {
            xs: theme.spacing(1),
            md: theme.spacing(2),
          },
        })}
      >
        {packages.map((pack) => (
          <Grid
            key={pack._id as string}
            sx={{ padding: "6px 8px" }}
            item
            md={4}
            sm={12}
          >
            <PackCard
              handleClickEdit={(pack) => {
                setEditingPack(pack);
                setOpenModalEdit(true);
              }}
              handleClickDelete={(pack) => {
                setDeletingPack(pack);
                setOpenModalDelete(true);
              }}
              pack={pack}
            />
          </Grid>
        ))}
        <CustomModal open={openModalCreate} onClose={handleToggleModalCreate}>
          <Box
            sx={{
              ...style,
              width: 600,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "500" }}>
              Thêm gói dịch vụ
            </Typography>
            <TextField
              size="small"
              label="Tên gói"
              onChange={(e) =>
                setNewPack((pre) => ({ ...pre, name: e.target.value }))
              }
              value={newPack?.name}
            ></TextField>
            <TextField
              size="small"
              type="number"
              label="Giá gói"
              onChange={(e) =>
                setNewPack((pre) => ({ ...pre, price: e.target.value }))
              }
              value={newPack?.price}
            ></TextField>
            <FormControl size="small" fullWidth>
              <InputLabel>Loại gói</InputLabel>
              <Select
                value={newPack?.type}
                onChange={(e) =>
                  setNewPack((pre) => ({ ...pre, type: e.target.value }))
                }
                label="Loại gói"
              >
                <MenuItem value="PACKAGE_FREE">Miễn phí</MenuItem>
                <MenuItem value="PACKAGE_MEMBER">Thành viên</MenuItem>
                <MenuItem value="PACKAGE_VIP">VIP</MenuItem>
              </Select>
            </FormControl>
            <TextField
              size="small"
              type="number"
              label="Số chatbot được tạo"
              onChange={(e) =>
                setNewPack((pre) => ({ ...pre, numBot: e.target.value }))
              }
              value={newPack?.numBot}
            ></TextField>

            <TextField
              size="small"
              type="number"
              label="Dung lượng chatbot"
              onChange={(e) =>
                setNewPack((pre) => ({ ...pre, capacity_bot: e.target.value }))
              }
              value={newPack?.capacity_bot}
            ></TextField>
            <TextField
              size="small"
              type="number"
              label="Dung lượng file"
              onChange={(e) =>
                setNewPack((pre) => ({ ...pre, capacity_file: e.target.value }))
              }
              value={newPack?.capacity_file}
            ></TextField>
            <Button onClick={handleCreatePack} variant="contained">
              Tạo gói
            </Button>
          </Box>
        </CustomModal>
        <CustomModal open={openModalEdit} onClose={handleToggleModalEdit}>
          <Box
            sx={{
              width: 600,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "500" }}>
              Cập nhật gói dịch vụ
            </Typography>
            <TextField
              size="small"
              label="Tên gói"
              onChange={(e) =>
                setEditingPack((pre) => ({ ...pre, name: e.target.value }))
              }
              value={editingPack?.name}
            ></TextField>
            <TextField
              size="small"
              type="number"
              label="Giá gói"
              onChange={(e) =>
                setEditingPack((pre) => ({ ...pre, price: e.target.value }))
              }
              value={editingPack?.price}
            ></TextField>
            <TextField
              size="small"
              label="Loại gói"
              onChange={(e) =>
                setEditingPack((pre) => ({ ...pre, type: e.target.value }))
              }
              value={editingPack?.type}
            ></TextField>
            <TextField
              size="small"
              type="number"
              label="Số chatbot được tạo"
              onChange={(e) =>
                setEditingPack((pre) => ({ ...pre, numBot: e.target.value }))
              }
              value={editingPack?.numBot}
            ></TextField>
            <TextField
              size="small"
              type="number"
              label="Dung lượng chatbot"
              onChange={(e) =>
                setEditingPack((pre) => ({
                  ...pre,
                  capacity_bot: e.target.value,
                }))
              }
              value={editingPack?.capacity_bot}
            ></TextField>
            <TextField
              size="small"
              type="number"
              label="Dung lượng file"
              onChange={(e) =>
                setEditingPack((pre) => ({
                  ...pre,
                  capacity_file: e.target.value,
                }))
              }
              value={editingPack?.capacity_file}
            ></TextField>
            <Button onClick={handleEditPack} variant="contained">
              Cập nhật
            </Button>
          </Box>
        </CustomModal>
        <CustomModal open={openModalDelete} onClose={handleToggleModalDelete}>
          <Box
            sx={{
              width: 600,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "500" }}>
              Cập nhật gói dịch vụ
            </Typography>
            <Typography>Bạn chắc chắn muốn xóa gói dịch vụ</Typography>
          </Box>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleDeletePack}
              variant="contained"
              color="error"
            >
              Xác nhận
            </Button>
          </div>
        </CustomModal>
      </Grid>
    </Container>
  );
};

export default Page;
