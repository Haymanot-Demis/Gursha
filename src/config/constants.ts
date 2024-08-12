export enum Role {
	CLIENT = "client",
	MERCHANT = "merchant",
}

export enum TokenTypes {
	REFRESH_TOKEN = "refresh",
	RESET_PASSWORD_TOKEN = "resetPassword",
	VERIFY_EMAIL_TOKEN = "verifyEmail",
}

export enum validationSource {
	BODY = "body",
	HEADER = "headers",
	PARAM = "params",
	QUERY = "query",
}
