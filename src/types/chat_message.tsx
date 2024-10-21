export type ChatMessage = {
	_id?: string;
	chat_history_id: string;
	question: string;
	answer: string;
	source?: Record<string, any>;
	created_at?: string;
	loading?: boolean;
	suggest_question?: string;
};

export const defaultChatMessages: ChatMessage[] = [
	{
		_id: "msg_1",
		chat_history_id: "chat_1",
		question: "Xin chào! Bạn có thể giúp tôi tìm một nhà hàng tốt không?",
		answer: "Chào bạn! Tôi gợi ý bạn thử nhà hàng 'The Gourmet Kitchen' ở gần đây. Họ có món ăn rất ngon và dịch vụ tuyệt vời.",
		created_at: "",
	},
	{
		_id: "msg_2",
		chat_history_id: "chat_1",
		question: "Có thể cho tôi biết thời tiết hôm nay không?",
		answer: "Hôm nay thời tiết khá đẹp với nắng nhẹ và nhiệt độ khoảng 25°C. Rất thích hợp để ra ngoài.",
		created_at: "",
	},
	{
		_id: "msg_3",
		chat_history_id: "chat_1",
		question: "Tôi muốn tìm một bộ phim hay để xem tối nay.",
		answer: "Bạn có thể xem 'Inception' nếu bạn thích phim khoa học viễn tưởng. Nếu bạn muốn một cái gì đó nhẹ nhàng hơn, 'The Grand Budapest Hotel' là một lựa chọn tuyệt vời.",
		created_at: "",
	},
	{
		_id: "msg_4",
		chat_history_id: "chat_1",
		question: "Tôi có thể làm gì để cải thiện kỹ năng lập trình của mình?",
		answer: "Một cách tốt để cải thiện kỹ năng lập trình là tham gia các dự án thực tế, làm bài tập lập trình hàng ngày và đọc các tài liệu từ các chuyên gia trong lĩnh vực. Bạn cũng có thể tham gia vào cộng đồng lập trình để học hỏi từ người khác.",
		created_at: "",
	},
	{
		_id: "msg_5",
		chat_history_id: "chat_1",
		question: "Bạn có thể gợi ý một cuốn sách hay không?",
		answer: "Tôi gợi ý bạn đọc 'Sapiens: Lược sử loài người' của Yuval Noah Harari. Cuốn sách này cung cấp cái nhìn sâu sắc về lịch sử và sự phát triển của loài người.",
		created_at: "",
	},
	{
		_id: "msg_6",
		chat_history_id: "chat_1",
		question:
			"Tôi đang tìm một ứng dụng giúp theo dõi thói quen hàng ngày.",
		answer: "Ứng dụng 'Habitica' có thể giúp bạn theo dõi và quản lý thói quen hàng ngày của mình theo cách thú vị và hiệu quả. Nó cũng có chế độ game hóa giúp bạn duy trì động lực.",
		created_at: "",
	},
	{
		_id: "msg_7",
		chat_history_id: "chat_1",
		question: "Có cách nào để giảm stress nhanh chóng không?",
		answer: "Một cách nhanh chóng để giảm stress là thực hiện các bài tập thở sâu, đi dạo ngoài trời hoặc nghe nhạc thư giãn. Bạn cũng có thể thử thiền hoặc yoga để cảm thấy thư thái hơn.",
		created_at: "",
	},
	{
		_id: "msg_8",
		chat_history_id: "chat_1",
		question: "Bạn có biết cách nấu món pasta ngon không?",
		answer: "Để nấu pasta ngon, bạn cần nấu mì trong nước sôi với một ít muối, sau đó xào với sốt cà chua và thêm các nguyên liệu như thịt bò, nấm hoặc rau củ. Hãy nhớ nêm gia vị vừa phải để món ăn thêm hấp dẫn.",
		created_at: "",
	},
	{
		_id: "msg_9",
		chat_history_id: "chat_1",
		question: "Tôi nên làm gì khi gặp khó khăn trong công việc?",
		answer: "Khi gặp khó khăn trong công việc, hãy thử phân tích vấn đề để tìm nguyên nhân gốc rễ, nhờ sự giúp đỡ từ đồng nghiệp hoặc cấp trên, và tìm cách cải thiện quy trình làm việc. Đôi khi, thay đổi góc nhìn cũng có thể giúp bạn giải quyết vấn đề.",
		created_at: "",
	},
	{
		_id: "msg_10",
		chat_history_id: "chat_1",
		question: "Có mẹo nào để học tiếng Anh hiệu quả không?",
		answer: "Để học tiếng Anh hiệu quả, bạn nên thực hành thường xuyên, sử dụng các ứng dụng học ngôn ngữ, tham gia các lớp học và trò chuyện với người bản ngữ. Đọc sách, xem phim và nghe nhạc bằng tiếng Anh cũng giúp cải thiện kỹ năng của bạn.",
		created_at: "",
	},
];
