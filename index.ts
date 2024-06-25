// import { APP, WP, addIo } from '../lib';
// @ts-ignore
import '@ajayos/nodelog';

// @ts-ignore
declare var log: any;

// @ts-ignore
global.log = log;

class CHAT extends APP {
    
	constructor() {
		super();
		this.WP = WP;
	}

	async start() {
		log('APP INITIALIZED', 'i');
		await this.init();
		await addIo()
			.then(() => {
				log('APP SUCCESSFUL', 'i');
			})
			.catch((err: any) => {
				log(` > [t] ${err}`, 'e');
			})
			.finally(async () => {
				await this.WP.connect();
			});
	}

	async closeServer() {
		await this.close();
		await this.WP?.disconnect();
	}
}

export default KEERTHANA;