export const passwordRegEx = new RegExp(
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
);

export const phoneNumberRegEx = new RegExp(
	/^[+251]{4} [9]{1}[1-9]{1}[0-9]{1} [0-9]{3} [0-9]{3}$/
);
