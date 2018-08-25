export function dLog(message: string, data?: any): void {
	console.log('');
	console.log(`debugger - ${message}`);
	console.log('');
	if (data) {
		console.log(data);
	}
}
