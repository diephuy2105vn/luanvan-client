"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";
import "@mui/material/Button";

export const SIDEBAR_WIDTH = 240;

declare module "@mui/material" {
	interface ButtonPropsVariantOverrides {
		gradient: true;
	}
	interface SimplePaletteColorOptions {
		rgb?: string;
	}
	interface PaletteColor {
		rgb?: string;
	}
	interface TextFieldPropsSizeOverrides {
		large: true;
	}
}

export const roboto = Roboto({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
});

const theme = createTheme({
	typography: {
		fontFamily: roboto.style.fontFamily,
		fontSize: Number((14 * 100) / 62.5),
	},
	palette: {
		primary: {
			rgb: "222, 116, 28",
			light: "#fea837",
			main: "#de741c",
			dark: "#d26710",
		},
		secondary: {
			rgb: "142, 78, 101",
			light: "#b85b56",
			main: "#8e4e65",
			dark: "#6c3a4c",
		},
	},
	components: {
		MuiTypography: {
			styleOverrides: {
				root: {
					margin: 0,
				},
			},
		},
		MuiTooltip: {
			styleOverrides: {
				tooltip: {
					fontSize: "1.4rem",
					fontWeight: 400,
					padding: "8px",
				},
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					height: "auto",
					"& .MuiChip-label": {
						fontSize: "1.3rem",
						paddingLeft: "6px",
						paddingRight: "6px",
					},
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiInputBase-root.Mui-disabled": {
						color: "rgba(0, 0, 0, 0.7)", // Màu chữ cho TextField khi disabled
					},
					"& .MuiFormLabel-root.Mui-disabled": {
						color: "rgba(0, 0, 0, 0.7)", // Màu của label khi TextField bị disabled
					},
					"& .MuiInputBase-input.Mui-disabled": {
						"-webkit-text-fill-color": "rgba(0, 0, 0, 0.7)",
					},
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					fontFamily: roboto.style.fontFamily,
					fontWeight: 500,
				},
			},
			variants: [
				{
					props: { variant: "gradient", color: "primary" },
					style: {
						background: `linear-gradient(135deg, ${"#fea837"} 0%, ${"#de741c"} 50%, ${"#d26710"} 100%),
                            radial-gradient(circle, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))`,
						color: "white",
						"&:hover": {
							opacity: 0.8,
						},
					},
				},
				{
					props: { variant: "gradient", color: "secondary" },
					style: {
						background: `linear-gradient(135deg, ${"#b85b56"} 0%, ${"#84495f"} 50%, ${"#6c3a4c"} 100%),
                            radial-gradient(circle, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1))`,
						color: `#fff`,
						"&:hover": {
							opacity: 0.8,
						},
					},
				},
				{
					props: { variant: "text" },
					style: {
						fontWeight: "700",
					},
				},
			],
		},
	},
});

export default theme;
