import * as fs from 'fs';
import path from 'path';

export default (io: any) => {
	// Function to broadcast file content to all connected clients
	const broadcastFileContent = () => {
		const textFilePath = path.join(__dirname, '..', '..', 'example.txt');
		try {
			const fileContent = fs.readFileSync(textFilePath, 'utf-8');
			io.emit('fileContent', fileContent);
		} catch (error: any) {
			console.error('Error reading file:', error.message);
		}
	};

	io.on('connection', (socket: any) => {
		console.log(`User connected to test socket: ${socket.id}`);

		// Send initial file content to the newly connected client
		broadcastFileContent();

		socket.on('disconnect', () => {
			console.log(`User disconnected from test socket: ${socket.id}`);
		});
	});

	// Watch for changes in the text file and broadcast updates
	fs.watch('example.txt', { encoding: 'buffer' }, (eventType, filename) => {
		if (eventType === 'change') {
			broadcastFileContent();
		}
	});
};