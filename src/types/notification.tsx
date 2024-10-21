export enum NotificationEnum {
	BotInvite = "BOT_INVITE",
	FileError = "FILE_ERROR",
	FileSuccess = "FILE_SUCCESS",
	Message = "MESSAGE",
}

export type NotificationBase = {
	_id?: string;
	sender?: string | null;
	receiver: string;
	type: NotificationEnum;
	content: string;
	metadata: Record<string, any>;
	created_at: string;
	read?: boolean | null;
};
