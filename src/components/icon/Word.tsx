import { Box, SxProps, Theme } from "@mui/material";
import React from "react";

const Word = ({
	sx = { width: "24px", height: "24px" },
}: {
	sx?: SxProps<Theme>;
}) => {
	return (
		<Box sx={sx}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				x="0px"
				y="0px"
				width="100%"
				height="100%"
				viewBox="0 0 48 48">
				<path
					fill="#2d92d4"
					d="M42.256,6H15.744C14.781,6,14,6.781,14,7.744v7.259h30V7.744C44,6.781,43.219,6,42.256,6z"></path>
				<path
					fill="#2150a9"
					d="M14,33.054v7.202C14,41.219,14.781,42,15.743,42h26.513C43.219,42,44,41.219,44,40.256v-7.202H14z"></path>
				<path
					fill="#2d83d4"
					d="M14 15.003H44V24.005000000000003H14z"></path>
				<path fill="#2e70c9" d="M14 24.005H44V33.055H14z"></path>
				<path
					fill="#00488d"
					d="M22.319,34H5.681C4.753,34,4,33.247,4,32.319V15.681C4,14.753,4.753,14,5.681,14h16.638 C23.247,14,24,14.753,24,15.681v16.638C24,33.247,23.247,34,22.319,34z"></path>
				<path
					fill="#fff"
					d="M18.403 19L16.857 26.264 15.144 19 12.957 19 11.19 26.489 9.597 19 7.641 19 9.985 29 12.337 29 14.05 21.311 15.764 29 18.015 29 20.359 19z"></path>
			</svg>
		</Box>
	);
};

export default Word;
