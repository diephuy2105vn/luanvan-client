import { PackageType } from "./package";

export type UserPackage = {
	id: string;
	registration_date: string;
	expiration_date: string;
};

export type UserPackageInfo = {
	pack: PackageType;
	registration_date: string;
	expiration_date: string;
};

export type UserBase = {
	_id: string;
	username: string;
	role: "user" | "admin";
	email?: string;
	full_name?: string;
	phone_number?: string;
	avatar?: File | null;
	avatar_source?: string;
	disabled: boolean;
	pack?: UserPackage;
};

export type UserRegister = {
	_id: string;
	username: string;
	role: "user" | "admin";
	email?: string;
	full_name?: string;
	phone_number?: string;
	disabled: boolean;
	pack?: string;
};

export const defaultUser: UserBase = {
	_id: "",
	username: "",
	role: "user",
	email: "",
	full_name: "",
	phone_number: "",
	avatar: null,
	disabled: false,
};
