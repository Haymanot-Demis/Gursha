export const passwordRegEx = new RegExp(
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
);

export const phoneNumberRegEx = new RegExp(/^\+251\d{9}$/);
