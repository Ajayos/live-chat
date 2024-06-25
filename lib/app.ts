import axios from 'axios';
import { createServer } from 'http';
import { Server as SocketIoServer } from 'socket.io';
import localtunnel from 'localtunnel';
import 'colors';
import express, { Application } from 'express';
import path from 'path';
import fs from 'fs';
import routes from '../src/Routes/index';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'cookie-session';
import 'colors';

// @ts-ignore
import '@ajayos/nodelog';

// @ts-ignore
declare var log: any;

class APP {
	public server: any;
	public io: SocketIoServer;
	public app: Application;
	public port: number | string = 8512;
	private PublicPath = path.join(__dirname, '..', 'app', 'build');

	constructor() {
		this.app = express();
		this.server = createServer(this.app);
		this.io = new SocketIoServer(this.server, {
			cors: {
				origin: '*',
			},
		});
		(global as any).io = this.io;
	}

	async init() {
		this.app.use(cors());
		this.app.use(morgan('dev'));
		this.app.use(cookieParser());
		this.app.use(express.json({ limit: '10kb' }));
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: true }));
		this.app.use(session({ secret: 'AURORA' }));

		this.app.use(routes);

		if (fs.existsSync(this.PublicPath)) {
			this.app.use(express.static(this.PublicPath));
			this.app.get('*', (req, res) => {
				const indexPath = path.join(this.PublicPath, 'index.html');
				if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
				else return res.send('SERVER STARTED');
			});
		} else {
			this.app.get('*', (req, res) => res.send('SERVER STARTED'));
		}

		this.server.listen(this.port, async () => {
			log(`App running on port = ${this.port} ...`);
			log(`PID: ${process.pid}`);

			try {
				const {
					data: { ip },
				} = await axios.get('https://api64.ipify.org?format=json');
				log(`Public IP Address: ${ip}`);
			} catch (err: any) {
				log('Error fetching public IP: ' + err?.message, 'e');
			}

			// Load and run the socket files dynamically
			import('../src/socket/index').then(module => module.default(this.io));
		});
	}

	async close() {
		this.io?.close();
		await this.server?.close(() => {
			process.exit(1);
		});
	}
}

export default APP;