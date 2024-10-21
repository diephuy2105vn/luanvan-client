import { UserBase } from "./user";

export enum PermissionEnum {
	READ_FILE = "READ_FILE",
	WRITE_FILE = "WRITE_FILE",
	READ_USER = "READ_USER",
	WRITE_USER = "WRITE_USER",
}

export const listPermission: Record<PermissionEnum, string> = {
	[PermissionEnum.READ_FILE]: "Xem dữ liệu",
	[PermissionEnum.WRITE_FILE]: "Thay đổi dữ liệu",
	[PermissionEnum.READ_USER]: "Xem người dùng",
	[PermissionEnum.WRITE_USER]: "Thay đổi người dùng",
};

export const getPermissionLabel = (permission: PermissionEnum) => {
	return listPermission[permission] || "Unknown Permission";
};

export const getPermissionsShortLabel = (
	permissions: PermissionEnum[]
): string[] => {
	const hasReadFile = permissions.includes(PermissionEnum.READ_FILE);
	const hasWriteFile = permissions.includes(PermissionEnum.WRITE_FILE);
	const hasReadUser = permissions.includes(PermissionEnum.READ_USER);
	const hasWriteUser = permissions.includes(PermissionEnum.WRITE_USER);

	let result: string[] = [];

	if (permissions.length >= 4) {
		result.push("Toàn quyền");
		return result;
	}

	if (hasReadFile && hasWriteFile) {
		result.push("Quản lý dữ liệu");
	} else if (hasReadFile) {
		result.push("Xem dữ liệu");
	}

	if (hasReadUser && hasWriteUser) {
		result.push("Quản lý người dùng");
	} else if (hasReadUser) {
		result.push("Xem người dùng");
	}

	if (result.length === 0) {
		result.push("Không có quyền");
	}

	return result;
};

export type UserPermission = {
	user_id?: string;
	user?: UserBase;
	permissions: PermissionEnum[];
	confirm?: boolean;
};

export type BotCreate = {
	_id?: string;
	name: string;
	description: string;
	list_user_permission?: UserPermission[];
	list_files?: string[];
	avatar: File | null;
	avatar_source?: string;
	response_model: string;
};

export type BotUpdate = {
	name?: string;
	description?: string;
	list_user_permission?: UserPermission[];
	list_files?: string[];
	response_model: string;
};

export type BotBase = {
	_id?: string;
	avatar?: File | null;
	avatar_source?: string;
	name: string;
	owner: string;
	description: string;
	list_user_permission: UserPermission[];
	list_files: string[];
	created_at: string;
	favorited_users: string[];
	response_model: string;
};

export const isBotBase = (object: any): object is BotBase => {
	return typeof object === "object" && object !== null && "_id" in object;
};

export const defaultBotCreate: BotCreate = {
	name: "",
	description: "",
	avatar: null,
	response_model: "",
};
