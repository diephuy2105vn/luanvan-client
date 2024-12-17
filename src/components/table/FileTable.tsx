"use client";

import { FileBase, FileStatus } from "@/types/file";
import { formatCapacity, formatDateFromDB } from "@/utils";
import {
  Cancel,
  CheckCircle,
  InsertDriveFileOutlined,
  Inventory,
  MoreVert,
} from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  Pagination,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table, { TableProps } from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Link from "next/link";
import React, { useRef, useState } from "react";
import CustomMenu, { MenuItemProps } from "../common/Menu";
import Excel from "../icon/Excel";
import Pdf from "../icon/Pdf";
import Word from "../icon/Word";
import { UserCell } from "./UserPermissionTable";
import { Checkbox } from "@mui/material";

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

export const FileCell = ({
  file,
  color,
  align = "left",
  size = "medium",
}: {
  file: FileBase;
  align?: "left" | "right" | "center";
  color?: "primary" | "secondary" | "info" | "warning" | "error";
  size?: "medium" | "small";
}) => {
  const Icon =
    file.extension === "pdf"
      ? Pdf
      : file.extension === "xlmn"
      ? Excel
      : file.extension === "doc" || file.extension === "docx"
      ? Word
      : InsertDriveFileOutlined;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent:
          align === "right"
            ? "flex-end"
            : align === "center"
            ? "center"
            : "flex-start",
        gap: "10px",
      }}
    >
      <Icon
        sx={
          size === "small"
            ? { width: "20px", height: "20px", fontSize: "20px" }
            : { width: "24px", height: "24px", fontSize: "24px" }
        }
      />
      <Typography
        sx={{
          color: (theme) =>
            color ? theme.palette[color].main : theme.palette.common.black,
          fontSize: "1.4rem",
        }}
      >
        {file.name}
      </Typography>
    </Box>
  );
};

const FileTable = ({
  fields = ["name", "user", "status", "size", "createdAt"],
  files = [],
  page,
  setPage,
  total,
  menuItems,
  selected,
  setSelected,
  ...props
}: {
  fields?: string[];
  files: FileBase[];
  page?: number;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  total?: number;
  menuItems?: MenuItemProps[];
  selected?: FileBase[];
  setSelected?: React.Dispatch<React.SetStateAction<FileBase[]>>;
} & TableProps) => {
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleChangePage = (
    _event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setAnchorEl(null);
    setPage && setPage(value);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!setSelected) {
      return;
    }
    if (event.target.checked) {
      setSelected(files);
      return;
    }
    setSelected([]);
  };

  const handleSelected = (
    e: React.ChangeEvent<HTMLInputElement>,
    file: FileBase
  ) => {
    if (!selected || !setSelected) {
      return;
    }
    let newSelected = [...selected];

    if (isSelected(file)) {
      newSelected = newSelected.filter((f) => f._id !== file._id);
    } else {
      newSelected = [...newSelected, file];
    }
    setSelected(newSelected);
  };

  const isSelected = (file: FileBase) =>
    selected && !!selected.find((f) => f._id === file._id);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} {...props}>
        <TableHead>
          <TableRow>
            {selected && (
              <StyledTableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < files.length
                  }
                  checked={
                    files.length > 0 && selected?.length === files.length
                  }
                  onChange={handleSelectAll}
                  inputProps={{
                    "aria-label": "select all desserts",
                  }}
                />
              </StyledTableCell>
            )}
            {fields.includes("name") && (
              <StyledTableCell
                sx={{
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                }}
              >
                Tên File
              </StyledTableCell>
            )}
            {/* {fields.includes("user") && (
              <StyledTableCell align="center">Người thêm</StyledTableCell>
            )} */}
            {fields.includes("status") && (
              <StyledTableCell align="center">Trạng thái</StyledTableCell>
            )}
            {fields.includes("size") && (
              <StyledTableCell align="right">Dung lượng</StyledTableCell>
            )}
            {fields.includes("createdAt") && (
              <StyledTableCell align="right">Ngày tạo</StyledTableCell>
            )}
            {menuItems && <StyledTableCell></StyledTableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {files.length > 0 ? (
            files.map((file, index) => (
              <StyledTableRow key={file._id}>
                {selected && (
                  <StyledTableCell padding="checkbox" align="center">
                    <Checkbox
                      size="small"
                      color="primary"
                      checked={isSelected(file)}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSelected(e, file)
                      }
                    />
                  </StyledTableCell>
                )}
                {fields.includes("name") && (
                  <StyledTableCell
                    component="th"
                    scope="row"
                    sx={{
                      position: "sticky",
                      left: 0,
                      zIndex: 1,

                      backgroundColor: (theme) =>
                        index % 2 === 0 ? `rgb(249, 246, 247)` : `white`,
                    }}
                  >
                    {file._id ? (
                      <Link
                        style={{
                          display: "block",
                          width: "100%",
                        }}
                        href={`/file/${file._id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FileCell size={props.size} file={file} color="info" />
                      </Link>
                    ) : (
                      <FileCell size={props.size} file={file} color="info" />
                    )}
                  </StyledTableCell>
                )}
                {/* {fields.includes("user") && (
                  <StyledTableCell size="small" align="center">
                    {file.owner_info && <UserCell user={file.owner_info} />}
                  </StyledTableCell>
                )} */}
                {fields.includes("status") && (
                  <StyledTableCell size="small" align="center">
                    {file.status === FileStatus.SUCCESS ? (
                      <CheckCircle fontSize="small" color="success" />
                    ) : file.status === FileStatus.LOADING ? (
                      <CircularProgress size={20} color="info" />
                    ) : (
                      <Cancel fontSize="small" color="error" />
                    )}
                  </StyledTableCell>
                )}
                {fields.includes("size") && (
                  <StyledTableCell size="small" align="right">
                    {formatCapacity(Number(file.size))}
                  </StyledTableCell>
                )}
                {fields.includes("createdAt") && (
                  <StyledTableCell size="small" align="right">
                    {formatDateFromDB(file.created_at)}
                  </StyledTableCell>
                )}
                {menuItems && (
                  <StyledTableCell size="small" align="center">
                    <IconButton
                      size={props.size}
                      ref={(el) => {
                        buttonRefs.current[index] = el;
                      }}
                      onClick={(e) => {
                        setAnchorEl(e.currentTarget);
                      }}
                    >
                      <MoreVert fontSize="small" />
                    </IconButton>
                    <CustomMenu
                      items={menuItems}
                      open={
                        !!anchorEl && anchorEl === buttonRefs.current[index]
                      }
                      anchorEl={anchorEl}
                      metaData={file}
                      onClose={() => setAnchorEl(null)}
                    />
                  </StyledTableCell>
                )}
              </StyledTableRow>
            ))
          ) : (
            <StyledTableRow sx={{ width: "100%" }}>
              <StyledTableCell colSpan={6} align="center">
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px 0",
                    flexDirection: "column",
                    gap: "8px",
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <Inventory sx={{ fontSize: "4.8rem" }} />
                  <Typography>Không có dữ liệu</Typography>
                </Box>
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </Table>
      {total && total > 0 ? (
        <Pagination
          count={total}
          page={page}
          onChange={handleChangePage}
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "16px 0",
          }}
        />
      ) : (
        <></>
      )}
    </TableContainer>
  );
};

export default FileTable;
