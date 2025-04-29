"use client";

import fileApi from "@/api/fileApi";
import { FilterType } from "@/components/common/Filter";
import { MenuItemProps } from "@/components/common/Menu";
import CustomModal from "@/components/common/Modal";
import CustomSearch from "@/components/common/Search";
import FileTable from "@/components/table/FileTable";
import AlertContext from "@/contexts/AlertContext";
import SocketContext from "@/contexts/SocketContext";
import { FileBase } from "@/types/file";
import { DeleteOutline, RestorePageOutlined } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";

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

  const [deletingFile, setDeletingFile] = useState<FileBase | null>(null);

  const fetchFiles = async () => {
    const res = await fileApi.getDeleted({
      page: currentPage,
      size_page: SIZE_PAGE,
    });
    setFiles(res.data);
    setTotalPage(Math.ceil(res.total / SIZE_PAGE));
  };

  const handleRestoreFile = async (metaData: FileBase) => {
    await fileApi.restoreById(metaData._id as string);
    fetchFiles();
  };

  const handleToggleModalDeleteFile = (file?: FileBase) => {
    setDeletingFile(file ? file : null);
  };

  const handleDeleteFile = async () => {
    try {
      if (!deletingFile?._id) {
        throw new Error();
      }
      await fileApi.hardDeleteByIds([deletingFile?._id]);
      showAlert("Xóa dữ liệu thành công", "success");
      handleToggleModalDeleteFile();
      fetchFiles();
    } catch (err) {
      showAlert("Đã có lỗi xảy ra", "error");
      handleToggleModalDeleteFile();
    }
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
  }, [currentPage]);

  const menuItems: MenuItemProps[] = [
    {
      key: "1",
      label: "Khôi phục",
      action: (metaData: FileBase) => {
        handleRestoreFile(metaData);
      },
      icon: RestorePageOutlined,
      divider: true,
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
            {/*<Filter
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
            />*/}
          </Box>
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
