// @ts-ignore
import nodeDb from '@ajayos/nodedb';

class DATABASE {
	public db: any; 

	version: string;

	constructor() {
		this.db = new nodeDb('DATABASE/chat.db');
		this.version = '1.0.0';
	}
}

export default DATABASE;