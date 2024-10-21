"use client";
export const getCookie = (name: string): string | undefined => {
	const matches = document.cookie.match(
		new RegExp(
			"(?:^|; )" +
				name.replace(/([\\.$?*|{}\\(\\)\\[\]\\\\/\\+^])/g, "\\$1") +
				"=([^;]*)"
		)
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const setCookie = (
	name: string,
	value: string,
	options: { [key: string]: any } = {}
): void => {
	options = {
		path: "/",
		// add other defaults here if necessary
		...options,
	};

	if (options.expires instanceof Date) {
		options.expires = options.expires.toUTCString();
	}

	let updatedCookie =
		encodeURIComponent(name) + "=" + encodeURIComponent(value);
	for (const optionKey of Object.keys(options)) {
		updatedCookie += "; " + optionKey;
		const optionValue = options[optionKey];
		if (optionValue !== true) {
			updatedCookie += "=" + optionValue;
		}
	}

	document.cookie = updatedCookie;
};

export const deleteCookie = (name: string): void => {
	setCookie(name, "", {
		"max-age": -1,
	});
};
