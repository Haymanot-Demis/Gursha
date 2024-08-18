export class CustomResponse {
	success: boolean;
	message: string;
	data: any;
	constructor(success: boolean, message: string = "", data: any = undefined) {
		this.success = success;
		this.message = message;
		this.data = data;
	}
}
