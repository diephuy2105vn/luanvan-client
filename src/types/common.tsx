import { ReactNode } from "react";
export type OnlyChildrenProps = {
	children: ReactNode;
};

export type MenuItemData = {
	key: string;
	label?: string;
	href?: string;
	action?: () => void;
	icon?: ReactNode;
};
