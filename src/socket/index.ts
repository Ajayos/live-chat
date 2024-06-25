import * as fs from 'fs';
import * as path from 'path';
import { Server } from 'socket.io';

// @ts-ignore
import '@ajayos/nodelog';

// @ts-ignore
declare var log: any;

export default async (io: Server) => {
	// Get the absolute path to the current directory
	const socketDir = __dirname;

	// Read all files in the directory (excluding index.ts)
	const socketFiles = fs
		.readdirSync(socketDir)
		.filter(file => file !== 'index.js' && file.endsWith('.js'));

	// Dynamically load and run each socket file
	for (const file of socketFiles) {
		const filePath = path.join(socketDir, file);
		try {
			// Use dynamic import to load the module
			const { default: socketModule } = await import(filePath);

			// Check if the imported module is a function
			if (typeof socketModule === 'function') {
				// Call the exported function with the io instance
				socketModule(io);
			} else {
				log(
					`Error loading socket file: ${file}. The module does not export a function.`,
					'e',
				);
			}
		} catch (error) {
			log(`Error loading socket file: ${file}. ` + error, 'e');
		}
	}

	log('All socket files loaded and running.');
};