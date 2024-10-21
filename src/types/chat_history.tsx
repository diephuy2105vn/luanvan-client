import { defaultChatMessages, ChatMessage } from "./chat_message";

export type ChatHistory = {
	_id?: string;
	user_id: string;
	bot_id: string;
	list_messages: ChatMessage[];
	disabled: boolean;
	created_at: string;
};
