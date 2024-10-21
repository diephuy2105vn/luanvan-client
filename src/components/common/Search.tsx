import { Filter, Search } from "@mui/icons-material";
import {
	Box,
	Button,
	ButtonGroup,
	IconButton,
	Input,
	styled,
} from "@mui/material";
import React from "react";

const StyledSearch = styled(ButtonGroup)({
	width: "100%",
	height: "100%",
	paddingLeft: "16px",
	overflow: "hidden",
	display: "flex",
	border: "1px solid #ccc",
	borderRadius: "8px",
});

const CustomInput = styled(Input, {
	shouldForwardProp: (prop) => prop !== "size",
})(({ size }) => ({
	boxSizing: "border-box",
	height: "100%",
	width: "100%",
	outline: "none",
	border: "none",
	fontSize: "1.6rem",
	"& .MuiInput-input": {
		padding: size == "medium" ? "10px 0" : "6px 0",
	},
}));

const CustomSearch = ({
	size = "medium",
	color = "primary",
	value = "",
	onChange,
}: {
	value: string;
	onChange: (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => void;
	size?: "small" | "medium";
	color?: "primary" | "secondary";
}) => {
	return (
		<StyledSearch>
			<CustomInput
				color={color}
				size={size}
				value={value}
				onChange={onChange}
				disableUnderline
				placeholder="Nhập nội dung tìm kiếm ..."
			/>
			<Button variant="contained" color={color}>
				<Search />
			</Button>
		</StyledSearch>
	);
};

export default CustomSearch;
