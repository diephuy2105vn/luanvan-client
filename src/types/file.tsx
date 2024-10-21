import { UserBase } from "./user";

export enum FileStatus {
	LOADING = "LOADING",
	ERROR = "ERROR",
	SUCCESS = "SUCCESS",
}

export type FilePropertyType = {
	file: File;
	name: string;
	extension: string;
};

export type Doc = {
	_id: string;
	source: string;
	text: string;
	page: string;
	file_id: string;
};

export type FileBase = {
	_id?: string;
	name: string;
	path?: string | null;
	extension?: string | null;
	size?: number | null;
	owner?: string | null;
	owner_info?: UserBase;
	disabled: boolean;
	created_at: string;
	status: FileStatus;
};

export type FileDetail = {
	_id?: string;
	name: string;
	path?: string | null;
	extension?: string | null;
	size?: number | null;
	owner?: string | null;
	owner_info?: UserBase;
	created_at: string;
	docs: Doc[];
	disabled: boolean;
};
