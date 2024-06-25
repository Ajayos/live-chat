import { Router } from 'express';
import { readdirSync } from 'fs';
import { join } from 'path';

const router = Router();

// Specify the path to the folder containing your API modules
const apiFolderPath = join(__dirname, '.');

// Read all files in the folder (excluding index.js)
const apiFiles = readdirSync(apiFolderPath).filter(
	file => file.endsWith('.js') && file !== 'index.js',
);

// Import and export each module dynamically
apiFiles.forEach(file => {
	let versionMatch = file.match(/\.v(\d+)?\.js/);
	let version = versionMatch
		? versionMatch[1]
			? `v${versionMatch[1]}`
			: 'v1'
		: false;

	// Set the endpoint with version or without version
	let endpoint = version
		? `/${version}/${file.replace(/\.v\d+\.js$/, '').replace('.js', '')}`
		: `/${file.replace('.js', '')}`;

	const modulePath = `./${file}`;
	const apiModule = require(modulePath).default;

	// Export dynamically
	router.use(endpoint, apiModule);
});

export default router;