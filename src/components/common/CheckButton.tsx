import {
	Box,
	Button,
	ButtonProps,
	Radio,
	styled,
	SvgIcon,
	SvgIconProps,
	Typography,
} from "@mui/material";
import React from "react";
import {
	CheckBox,
	CheckBoxOutlined,
	CheckCircle,
	Public,
} from "@mui/icons-material";
import theme from "@/theme";
import { useTheme } from "@emotion/react";

const StyledButton = styled(Button)(({ theme, size }) => ({
	textTransform: "none",
	textAlign: "left",
	justifyContent: "flex-start",
	padding:
		size === "small"
			? "3px 10px"
			: size === "large"
			? "6px 14px"
			: "5px 12px",
	"& > input ": {
		display: "none",
	},
}));

const CheckButton = React.memo(
	({
		title,
		name,
		valueCheck,
		label,
		checked,
		typeCheck = "checkbox",
		icon,
		helper,
		onClick,
		size = "medium",
		disabled,
		...props
	}: {
		title: string;
		valueCheck: boolean;
		checked: boolean;
		onClick: (value: string | boolean) => void;
		name?: string;
		typeCheck?: "checkbox" | "radio";
		label?: string;
		size?: "small" | "medium" | "large";
		icon?: React.ReactNode;
		helper?: string;
	} & ButtonProps) => {
		const theme = useTheme();
		const IconChecked = typeCheck === "radio" ? CheckCircle : CheckBox;

		return (
			<StyledButton
				{...props}
				size={size}
				variant="outlined"
				onClick={(e) => onClick(valueCheck)}
				color={checked ? "success" : "inherit"}
				sx={(theme) =>
					checked
						? {
								"&.Mui-disabled": {
									borderColor: theme.palette.success.main,
									color: theme.palette.success.main,
								},
						  }
						: {
								borderColor: theme.palette.grey[600],
								color: theme.palette.grey[600],
						  }
				}
				disabled={disabled}>
				<input
					type={typeCheck}
					name={name}
					checked={checked}
					onChange={(e) => {
						e.stopPropagation();
						onClick(valueCheck);
					}}
				/>
				<Box sx={{ flex: 1 }}>
					{label && (
						<Box
							sx={{
								display: "flex",
								gap: "16px",
								justifyContent: "space-between",
								alighItem: "center",
								marginBottom: "4px",
							}}>
							<Typography
								sx={{
									fontSize:
										size == "small"
											? "11px"
											: size == "large"
											? "12px"
											: "13px",
								}}>
								{label}
							</Typography>
							<IconChecked
								sx={{
									opacity: checked ? "1" : "0",
									fontSize:
										size == "small"
											? "14px"
											: size == "large"
											? "16px"
											: "15px",
									transform: "translateX(50%)",
								}}
							/>
						</Box>
					)}
					<Box
						sx={{
							display: "flex",
							gap: "8px",
							alignItems: "center",
						}}>
						{icon && <Typography>{icon}</Typography>}
						<Box
							sx={{
								display: "flex",
								alignItems: "flex-start",
								flexDirection: "column",
								paddingRight:
									label &&
									(size === "small"
										? "12px"
										: size === "large"
										? "16px"
										: "14px"),
							}}>
							<Typography
								fontSize={
									size == "small"
										? 14
										: size == "large"
										? 18
										: 16
								}
								sx={(theme) => ({
									fontWeight: "500",
									color: checked
										? theme.palette.success.main
										: disabled
										? theme.palette.grey[600]
										: theme.palette.grey[800],
								})}>
								{title}
							</Typography>

							<Typography
								fontSize={
									size == "small"
										? 10
										: size == "large"
										? 12
										: 11
								}>
								{helper}
							</Typography>
						</Box>
						{!label && (
							<IconChecked
								sx={{
									opacity: checked ? "1" : "0",
									fontSize:
										size == "small"
											? "14px"
											: size == "large"
											? "16px"
											: "15px",
									transform: "translateX(50%)",
								}}
							/>
						)}
					</Box>
				</Box>
			</StyledButton>
		);
	}
);

export default CheckButton;
