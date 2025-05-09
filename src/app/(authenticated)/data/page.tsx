"use client";

import fileApi from "@/api/fileApi";
import { FilterType } from "@/components/common/Filter";
import { MenuItemProps } from "@/components/common/Menu";
import CustomModal from "@/components/common/Modal";
import CustomSearch from "@/components/common/Search";
import FileTable from "@/components/table/FileTable";
import UploadFile from "@/components/upload/UploadFile";
import { RootState } from "@/config/redux/store";
import { getUserPack } from "@/config/redux/userReducer";
import AlertContext from "@/contexts/AlertContext";
import SocketContext from "@/contexts/SocketContext";
import useSetValueTimeout from "@/hooks/useSetValueTimeOut";
import { FileBase } from "@/types/file";
import {
  DeleteOutline,
  Download,
  FileUploadOutlined,
} from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SIZE_PAGE = 6;

const Page = () => {
  const { socket } = useContext(SocketContext);
  const { showAlert } = useContext(AlertContext);

  const [files, setFiles] = useState<FileBase[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState<FilterType>({
    sort: "",
  });
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileCapacity, setFileCapacity] = useState(0);

  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [deletingFile, setDeletingFile] = useState<FileBase | null>(null);

  const [isUploadError, setIsUploadError] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const changedSearchValue = useSetValueTimeout(searchValue, 1000);
  const userPack = useSelector((state: RootState) => getUserPack(state));

  const handleToggleModal = () => {
    setOpenModal((pre) => !pre);
    isUploadError && setIsUploadError(false);
  };

  const handleToggleModalUploadFile = () => {
    setOpenModal((pre) => !pre);
    isUploadError && setIsUploadError(false);
  };

  const handleUploadFile = async () => {
    if (uploadingFiles.length > 0) {
      const totalSize = uploadingFiles.reduce((accumulator, file) => {
        return file.size ? file.size + accumulator : accumulator;
      }, 0);
      if (
        userPack?.pack?.capacity_file &&
        totalSize + fileCapacity > userPack?.pack?.capacity_file
      ) {
        showAlert("Dung lượng không đủ", "warning");
        return;
      }
      const formData = new FormData();
      uploadingFiles.forEach((file) => {
        formData.append("files", file);
      });
      try {
        const res = await fileApi.upload(formData);

        showAlert("Thêm dữ liệu thành công", "success");
        setCurrentPage(1);
        fetchFiles();
        handleToggleModalUploadFile();
      } catch (err) {
        showAlert("Đã có lỗi xảy ra", "error");
        handleToggleModalUploadFile();
      }
      return;
    }
    setIsUploadError(true);
  };

  const handleDownload = async (file: FileBase) => {
    try {
      const res = await fileApi.download(file._id as string);
      const fileURL = URL.createObjectURL(
        new Blob([res as any], {
          type:
            file.extension === "docx"
              ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              : file.extension === "doc"
              ? "application/msword"
              : "application/pdf",
        })
      );

      const link = document.createElement("a");
      link.href = fileURL;
      link.setAttribute("download", file.name);

      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(fileURL);
    } catch (error) {
      console.log(error);
      showAlert("Đã có lỗi xảy ra", "error");
    }
  };

  const handleToggleModalDeleteFile = (file?: FileBase) => {
    setDeletingFile(file ? file : null);
  };

  const handleDeleteFile = async () => {
    try {
      if (!deletingFile?._id) {
        throw new Error();
      }
      await fileApi.deleteByIds([deletingFile?._id]);
      showAlert("Xóa dữ liệu thành công", "success");
      handleToggleModalDeleteFile();
      fetchFiles();
    } catch (err) {
      showAlert("Đã có lỗi xảy ra", "error");
      handleToggleModalDeleteFile();
    }
  };

  const fetchFiles = async () => {
    const res = await fileApi.getAll({
      page: currentPage,
      size_page: SIZE_PAGE,
      name: changedSearchValue.trim(),
    });
    setFiles(res.data);
    setTotalPage(Math.ceil(res.total / SIZE_PAGE));
    setFileCapacity(res.capacity);
  };

  useEffect(() => {
    if (socket) {
      socket?.on("file_status", (fileStatus) => {
        setFiles((prev) =>
          prev.map((file) => {
            if (file._id === fileStatus.file_id) {
              file.status = fileStatus.status;
            }
            return file;
          })
        );
      });
    }
  }, [socket]);

  useEffect(() => {
    fetchFiles();
  }, [currentPage, changedSearchValue]);

  useEffect(() => {
    setCurrentPage(1);
  }, [changedSearchValue]);

  const menuItems: MenuItemProps[] = [
    {
      key: "1",
      label: "Download",
      action: (metaData: FileBase) => {
        handleDownload(metaData);
      },
      icon: Download,
    },
    {
      key: "2",
      label: "Xóa",
      action: (metaData: FileBase) => {
        handleToggleModalDeleteFile(metaData);
      },
      icon: DeleteOutline,
      color: "error",
    },
  ];

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
          </Box>
        </Grid>
        <Grid>
          <Button
            onClick={() => handleToggleModal()}
            startIcon={<FileUploadOutlined />}
            variant="outlined"
            // disabled={
            //   !userPack?.pack || fileCapacity > userPack?.pack.capacity_file
            // }
          >
            Thêm Dữ Liệu
          </Button>
        </Grid>
      </Grid>
      <FileTable
        fields={["name", "status", "size", "createdAt"]}
        files={files}
        page={currentPage}
        setPage={setCurrentPage}
        total={totalPage}
        menuItems={menuItems}
      />
      <CustomModal open={openModal} onClose={() => handleToggleModal()}>
        <Typography
          sx={(theme) => ({
            fontWeight: "500",
            fontSize: "2rem",
            color: theme.palette.grey[700],
            marginBottom: "16px",
          })}
        >
          Thêm Dữ Liệu
        </Typography>
        <UploadFile
          error={isUploadError}
          onChange={(files) => {
            setUploadingFiles(files);
          }}
          size="large"
        />
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
              handleToggleModal();
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleUploadFile();
            }}
          >
            Xác nhận
          </Button>
        </Box>
      </CustomModal>
      <CustomModal
        size="large"
        open={!!deletingFile}
        onClose={() => handleToggleModalDeleteFile()}
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
          Dữ liệu của bạn sẽ được chuyển đến thùng rác. Bạn có thể khôi phục
          sau.
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
              handleToggleModalDeleteFile();
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleDeleteFile();
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
