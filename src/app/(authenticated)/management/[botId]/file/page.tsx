"use client";

import botApi from "@/api/botApi";
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
  FileCopyOutlined,
  FileUploadOutlined,
  Replay,
} from "@mui/icons-material";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import { useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";

const SIZE_PAGE = 6;

const Page = () => {
  const { showAlert } = useContext(AlertContext);
  const { socket } = useContext(SocketContext);

  const { botId } = useParams();
  const [files, setFiles] = useState<FileBase[]>([]);
  const userPack = useSelector((state: RootState) => getUserPack(state));
  // State filter and pagination
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState<FilterType>({
    sort: "",
  });
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileCapacity, setFileCapacity] = useState(0);

  // State upload files
  const [isUploadError, setIsUploadError] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [openModalUploadFile, setOpenModalUploadFile] = useState(false);

  // State add files
  const [oldFiles, setOldFiles] = useState<FileBase[]>([]);
  const [openModalAddFile, setOpenModalAddFile] = useState(false);
  const [pageOldFiles, setPageOldFiles] = useState(1);
  const [totalPageOldFiles, setTotalPageOldFiles] = useState(1);
  const [selectedOldFiles, setSelectedOldFiles] = useState<FileBase[]>([]);

  // State delete files
  const [deletingFile, setDeletingFile] = useState<FileBase | null>(null);
  const changedSearchValue = useSetValueTimeout(searchValue, 1000);

  const fetchFiles = async () => {
    const res = await botApi.getListFiles(botId as string, {
      page: currentPage,
      size_page: SIZE_PAGE,
      name: changedSearchValue.trim(),
    });

    setFiles(res.data);
    setFileCapacity(res.capacity);
    setTotalPage(Math.ceil(res.total / SIZE_PAGE));
  };

  const fetchOldFiles = async () => {
    const res = await fileApi.getAll({
      page: pageOldFiles,
      size_page: 6,
    });

    const oldFiles: FileBase[] = res.data.filter(
      (oldFile: FileBase) => !files.some((file) => file._id === oldFile._id)
    );

    setOldFiles(oldFiles);
    setTotalPageOldFiles(Math.ceil(res.total / SIZE_PAGE));
  };

  const handleToggleModalAddFile = () => {
    setOpenModalAddFile((pre) => !pre);
  };

  const handleAddFiles = async () => {
    if (selectedOldFiles.length <= 0) {
      showAlert("Vui lòng chọn dữ liệu cần thêm", "warning");
      return;
    }

    const totalSize = selectedOldFiles.reduce((accumulator, file) => {
      return file.size ? file.size + accumulator : accumulator;
    }, 0);

    if (
      userPack?.pack &&
      fileCapacity + totalSize > userPack?.pack?.capacity_bot
    ) {
      showAlert("Dữ liệu không đủ", "warning");
      return;
    }

    try {
      const req = selectedOldFiles.map((file) => file._id);
      await botApi.addFiles(botId as string, req);
      showAlert("Thêm dữ liệu thành công", "success");
      setCurrentPage(1);
      fetchFiles();
      handleToggleModalAddFile();
    } catch (err) {
      showAlert("Đã có lỗi xảy ra", "error");
      handleToggleModalAddFile();
    }
  };

  const handleToggleModalUploadFile = () => {
    setOpenModalUploadFile((pre) => !pre);
    isUploadError && setIsUploadError(false);
  };

  const handleUploadFile = async () => {
    if (uploadingFiles.length <= 0) {
      setIsUploadError(true);
      showAlert("Vui lòng chọn dữ liệu cần tải lên", "warning");
      return;
    }

    const totalSize = uploadingFiles.reduce((accumulator, file) => {
      return file.size ? file.size + accumulator : accumulator;
    }, 0);

    if (
      userPack?.pack &&
      fileCapacity + totalSize > userPack?.pack?.capacity_bot
    ) {
      showAlert("Dữ liệu không đủ", "warning");
      return;
    }

    const formData = new FormData();
    uploadingFiles.forEach((file) => {
      formData.append("files", file);
    });
    try {
      await botApi.uploadFiles(botId as string, formData);

      showAlert("Tải lên dữ liệu thành công", "success");
      setCurrentPage(1);
      fetchFiles();
      handleToggleModalUploadFile();
    } catch (err) {
      showAlert("Đã có lỗi xảy ra", "error");
      handleToggleModalUploadFile();
    }
  };

  const handleToggleModalDeleteFile = (file?: FileBase) => {
    setDeletingFile(file ? file : null);
  };

  const handleDeleteFile = async () => {
    try {
      await botApi.deleteFiles(botId as string, [deletingFile?._id]);
      showAlert("Xóa dữ liệu thành công", "success");
      handleToggleModalDeleteFile();
      fetchFiles();
    } catch (err) {
      showAlert("Đã có lỗi xảy ra", "error");
      handleToggleModalDeleteFile();
    }
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
    setCurrentPage(1);
  }, [changedSearchValue]);

  useEffect(() => {
    fetchFiles();
  }, [botId, currentPage, changedSearchValue]);
  useEffect(() => {
    fetchOldFiles();
  }, [pageOldFiles]);

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
              label="Sắp xếp"
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
            <IconButton
              onClick={() => {
                fetchFiles();
              }}
            >
              <Replay />
            </IconButton>
          </Box>
        </Grid>
        <Grid item>
          <Button
            onClick={() => handleToggleModalAddFile()}
            startIcon={<FileCopyOutlined />}
            variant="outlined"
            sx={{ marginRight: "8px" }}
            // disabled={
            //   !userPack?.pack ||
            //   fileCapacity >= userPack?.pack.capacity_file ||
            //   fileCapacity >= userPack?.pack.capacity_bot
            // }
          >
            Thêm dữ liệu
          </Button>
          <Button
            onClick={() => handleToggleModalUploadFile()}
            startIcon={<FileUploadOutlined />}
            variant="outlined"
          >
            Tải lên dữ liệu
          </Button>
        </Grid>
      </Grid>
      <FileTable
        files={files}
        page={currentPage}
        setPage={setCurrentPage}
        total={totalPage}
        menuItems={menuItems}
      />
      <CustomModal
        open={openModalUploadFile}
        onClose={() => handleToggleModalUploadFile()}
      >
        <Typography
          sx={(theme) => ({
            fontWeight: "500",
            fontSize: "2rem",
            color: theme.palette.grey[700],
            marginBottom: "16px",
          })}
        >
          Tải lên dữ liệu
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
              handleToggleModalUploadFile();
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
        open={openModalAddFile}
        onClose={() => handleToggleModalAddFile()}
      >
        <Typography
          sx={(theme) => ({
            fontWeight: "500",
            fontSize: "2rem",
            color: theme.palette.grey[700],
            marginBottom: "16px",
          })}
        >
          Thêm dữ liệu
        </Typography>
        <FileTable
          fields={["name", "status", "size", "createdAt"]}
          selected={selectedOldFiles}
          setSelected={setSelectedOldFiles}
          files={oldFiles.filter(
            (oldFile) => !files.some((file) => file._id === oldFile._id)
          )}
          page={pageOldFiles}
          setPage={setPageOldFiles}
          total={totalPageOldFiles}
        />
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
              handleToggleModalAddFile();
            }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              handleAddFiles();
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
