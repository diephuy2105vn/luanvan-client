import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const useBreakpoint = () => {
	const theme = useTheme();

	const xs = useMediaQuery(theme.breakpoints.down("xs"));
	const sm = useMediaQuery(theme.breakpoints.between("sm", "md"));
	const md = useMediaQuery(theme.breakpoints.between("md", "lg"));
	const lg = useMediaQuery(theme.breakpoints.between("lg", "xl"));
	const xl = useMediaQuery(theme.breakpoints.up("xl"));

	return {
		xs: xs || sm || md || lg || xl,
		sm: sm || md || lg || xl,
		md: md || lg || xl,
		lg: lg || xl,
		xl,
	};
};

export default useBreakpoint;
