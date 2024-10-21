"use client";
// Format number
export const formatNumber = (value: number | string): string => {
	const number = typeof value === "string" ? parseFloat(value) : value;

	if (isNaN(number)) {
		return value.toString();
	}

	return number.toLocaleString("vi-VN");
};

// Format phone number
export const formatPhoneNumber = (phoneNumber: string | number): string => {
	const cleaned = ("" + phoneNumber).replace(/\D/g, "");
	const match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
	if (match) {
		return `${match[1]}.${match[2]}.${match[3]}`;
	}
	return phoneNumber.toString();
};

// Format date to 'dd/MM/yyyy'
export const formatDate = (str: string | Date): string => {
	const date = new Date(str);
	const formattedDate = date.toLocaleString("vi-VN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
	return formattedDate;
};

// Format time to 'HH:mm' if today, else 'MM/dd HH:mm'
export const formatTimeShort = (str: string | Date): string => {
	const date = new Date(str);
	const now = new Date();

	if (date.toDateString() === now.toDateString()) {
		return date.toLocaleString("vi-VN", {
			hour: "2-digit",
			minute: "2-digit",
		});
	}
	return date.toLocaleString("vi-VN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
};

// Format time to 'HH:mm dd/MM/yyyy'
export const formatTime = (str: string | Date): string => {
	const date = new Date(str);
	const now = new Date();

	return date.toLocaleString("vi-VN", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export const getInitials = (str: string, size: number): string => {
	const cleanedName = str.trim().toLowerCase();
	const words = cleanedName.split(" ");
	let initials = "";

	const maxInitials = Math.min(size, words.length);

	words.slice(0, maxInitials).forEach((word) => {
		initials += word.charAt(0);
	});

	return initials.slice(0, size).toUpperCase();
};

// Get file extension from file name
export const getExtensionByName = (name: string): string => {
	const namesplit = name.split(".");
	return namesplit[namesplit.length - 1];
};

// Format date from DB to 'YYYY-MM-DD'
export const formatDateFromDB = (date: string | Date): string => {
	const timeObj = new Date(date);
	return timeObj.toISOString().split("T")[0];
};

// Truncate text longer than size with '...'
export const formatText = (text: string, size: number): string => {
	if (text.length > size) {
		return text.slice(0, size) + "...";
	}
	return text;
};

export const formatCapacity = (capacity: number): string => {
	const formatSizeGB = (capacity / 1024 / 1024 / 1024).toFixed(2);
	if (parseFloat(formatSizeGB) >= 1) {
		return `${formatSizeGB} Gb`;
	}
	const formatSizeMB = (capacity / 1024 / 1024).toFixed(2);
	if (parseFloat(formatSizeMB) >= 1) {
		return `${formatSizeMB} Mb`;
	}
	const formatSizeKB = (capacity / 1024).toFixed(2);
	return `${formatSizeKB} Kb`;
};

export const getColorFromInitial = (initial: string) => {
	const colors = [
		"#ffadad",
		"#ffd6a5",
		"#9bfbc0",
		"#a0c4ff",
		"#b9fbc0",
		"#ffc3a0",
		"#d5aaff",
		"#c2c2f0",
	];
	const index = initial?.charCodeAt(0) % colors.length;
	return colors[index];
};
