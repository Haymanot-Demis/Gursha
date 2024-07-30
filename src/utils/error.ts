enum ErrorType {
	UNAUTHORIZED_ERROR = "Unauthorized_Error",
	UNAUTHENTICATED_ERROR = "Unauthenticated_Error",
	INVALID_CREDENTIALS_ERROR = "Invalid_Credentials_Error",
	ACCOUNT_LOCKED_ERROR = "Account_Locked_Error",
	ACCOUNT_NOT_VERIFIED_ERROR = "Account_Not_Verified_Error",
	RESOURCE_NOT_FOUND_ERROR = "Resource_Not_Found_Error",
	EMAIL_SENDING_ERROR = "Email_Sending_Error",
	INVALID_OR_EXPIRED_TOKEN_ERROR = "Invalid_Or_Expired_Token_Error",
	ROLE_RETRIEVAL_ERROR = "Role_Retrieval_Error",
	DATABASE_ERROR = "Database_Error",
	NETWORK_ERROR = "Network_Error",
	UNKNOWN_ERROR = "Unknown_Error",
	RESOURCE_ALREADY_EXISTS_ERROR = "Resource_Already_Exists_Error",
	BAD_REQUEST_ERROR = "Resource_Already_Exists_Error",
}

export abstract class CustomError extends Error {
	abstract statusCode: number;

	constructor(message?: string) {
		super(message);
		// This line is needed to restore the correct prototype chain
		Object.setPrototypeOf(this, new.target.prototype);
	}
}

export class UnauthorizedError extends CustomError {
	statusCode = 403;

	constructor(public message: string) {
		super(message);
		this.name = ErrorType.UNAUTHORIZED_ERROR;
	}
}

export class unauthunticatedError extends CustomError {
	statusCode = 401;

	constructor(public message: string) {
		super(message);
		this.name = ErrorType.UNAUTHENTICATED_ERROR;
	}
}

export class InvalidCredentialsError extends CustomError {
	statusCode = 401;
	constructor(public message: string) {
		super(message);
		this.name = ErrorType.INVALID_CREDENTIALS_ERROR;
	}
}

export class AccountNotVerifiedError extends CustomError {
	statusCode = 401;
	constructor(public message: string) {
		super(message);
		this.name = ErrorType.ACCOUNT_NOT_VERIFIED_ERROR;
	}
}

export class AccountLockedError extends CustomError {
	statusCode = 401;
	constructor(public message: string) {
		super(message);
		this.name = ErrorType.ACCOUNT_LOCKED_ERROR;
	}
}

export class ResourceNotFoundError extends CustomError {
	statusCode = 404;

	constructor(public message: string) {
		super(message);
		this.name = ErrorType.RESOURCE_NOT_FOUND_ERROR;
	}
}

export class InvalidOrExpiredTokenError extends CustomError {
	statusCode = 404;

	constructor(public message: string) {
		super(message);
		this.name = ErrorType.INVALID_OR_EXPIRED_TOKEN_ERROR;
	}
}

export class ResourceAlreadyExistsError extends CustomError {
	statusCode = 409;
	constructor(public message: string) {
		super(message);
		this.name = ErrorType.RESOURCE_ALREADY_EXISTS_ERROR;
	}
}

export class DatabaseError extends CustomError {
	statusCode = 500;

	constructor(public message: string) {
		super(message);
		this.name = ErrorType.DATABASE_ERROR;
	}
}

export class NetworkError extends CustomError {
	statusCode = 500;

	constructor(public message: string) {
		super(message);
		this.name = ErrorType.NETWORK_ERROR;
	}
}

export class UnknownError extends CustomError {
	statusCode = 500;

	constructor(public message: string) {
		super(message);
		this.name = ErrorType.UNKNOWN_ERROR;
	}
}

export class BadRequest extends CustomError {
	statusCode = 400;

	constructor(public message: string) {
		super(message);
		this.name = ErrorType.BAD_REQUEST_ERROR;
	}
}
