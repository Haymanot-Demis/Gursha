export class CustomResponse {
	success: boolean;
	message: string;
	data: any;
	metaData: any;
	constructor(
		success: boolean,
		message: string = "",
		data: any = undefined,
		metaData: any = {}
	) {
		this.success = success;
		this.message = message;
		this.data = data;
		this.metaData = metaData;
	}
}
