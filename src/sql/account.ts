import DATABASE from '../../lib/database';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';

interface userInfo_ {
	id: string;
	name?: string;
	notify?: string;
	status?: string;
	status_emoji?: string;
	username?: string;
	profile?: string;
	last_seen?: Date | number;
	password: string;
	password_create: Date | number;
	create: Date | number;
}

class ACCOUNT extends DATABASE {
    private account: string;
	private user: string;
	private salt: number;
	private token_key: string;

	constructor() {
		super();
        this.account = 'account'
		this.user = 'user';
		this.salt = 10;
		this.token_key = 'keerthana_ai';
	}

	async createAccount(data: {username: string, password: string}): Promise<any> {
		try {
			const { username, password } = data;
			const salt = await bcrypt.genSalt(this.salt);
			const hash = await bcrypt.hash(password, salt);
			const id = uuidv4();
			const account: userInfo_ = {
				id,
				password: hash,
				username,
				create: Date.now(),
				password_create: Date.now(),
				last_seen: Date.now(),
			};

			await this.db.setDB(this.account, this.user, account);
			return account;
		} catch (error) {
			throw new Error('Error creating account');
		}
	}

	async login_status(): Promise<boolean> {
		try {
			const account = await this.db.getDB(this.account, this.user);
			return !!account?.id;
		} catch (error) {
			throw new Error('Internal server error');
		}
	}

	/**
	 * Updates the user's information in the database.
	 *
	 * @param data - The new user information to be updated.
	 * @returns A Promise that resolves to the updated user information.
	 * @throws Will throw an error if there is an issue updating the user information.
	 */
	async update(data: any): Promise<any> {
		try {
			// Fetch the existing user data from the database
			const oldData = await this.db.getDB(this.account, this.user);

			// Merge the new data with the existing data
			const newData = { ...oldData, ...data };

			// Update the user data in the database
			await this.db.setDB(this.account, this.user, newData);

			// Return the updated user information
			return newData;
		} catch (error: any) {
			// If an error occurs during the update process, throw a new error with the original error message
			throw new Error(error.message);
		}
	}

	async status_(): Promise<boolean> {
		try {
			const account = await this.db.getDB(this.account, this.user);
			return (account?.id ? true : false) || false;
		} catch (err: any) {
			return false;
		}
	}

	/**
	 * Adds a new device to the user's account.
	 * @param device - The device object containing device information.
	 * @throws Error if no user is found or if an error occurs during the process.
	 */
	async addDevice(device: any, user: any) {
		try {
			const id = uuidv4();
			const devices = await this.getDevices();
			const token = await this.createToken({
				id,
				password: user.password,
			});
			const account: Device = {
				id,
				token,
				name: device.name,
				model: device.model,
				os: device.os,
				os_version: device.os_version,
				location: device.location,
				browser: device.browser,
				ip: device.ip,
				create: Date.now(),
				last_login: Date.now(),
			};

			const devices_: Device[] = devices ? [...devices, account] : [account];

			await this.db.setDB(this.account, this.device, { device: devices_ });
			return account;
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	/**
	 * Updates the last seen time of a device with the specified ID.
	 *
	 * @param id - The ID of the device to update.
	 * @returns A Promise that resolves to the updated list of devices.
	 * @throws If an error occurs during the retrieval process, a new error with the original error message is thrown.
	 */
	async deviceUpdate(id: string): Promise<any> {
		try {
			// take all device data and find that device by id and update its last seen to now time in  single line to find and chnage
			const account = await this.db.getDB(this.account, this.device);
			const devices = account.device.map((device: Device) => {
				if (device.id === id) {
					device.last_login = Date.now();
				}
				return device;
			});
			await this.db.setDB(this.account, this.device, { device: devices });
			return devices;
		} catch (error: any) {
			// If an error occurs during the retrieval process, throw a new error with the original error message
			throw new Error(error.message);
		}
	}

	/**
	 * Retrieves the user information from the database.
	 *
	 * @returns A Promise that resolves to the user information.
	 * @throws Will throw an error if there is an issue retrieving the user information from the database.
	 */
	async me(): Promise<any> {
		try {
			// Fetch the user account data from the database
			return await this.db.getDB(this.account, this.user);
		} catch (error: any) {
			// If an error occurs during the retrieval process, throw a new error with the original error message
			throw new Error(error.message);
		}
	}

	/**
	 * Generates a JWT token for the account.
	 *
	 * @param data - The data to be included in the token.
	 * @returns A Promise that resolves to the generated token.
	 * @throws Will throw an error if the token could not be generated.
	 */
	async createToken(data: tokenData): Promise<any> {
		try {
			const token = jwt.sign(data, this.token_key, {
				expiresIn: '5w',
			});

			if (!token) {
				throw new Error('Error generating account token');
			}

			return token;
		} catch (error: any) {
			throw new Error(error.message);
		}
	}

	/**
	 * Decodes a JWT token and returns its payload.
	 *
	 * @param token - The JWT token to be decoded.
	 * @returns A Promise that resolves to the decoded payload.
	 * @throws Will throw an error if the token is invalid or could not be decoded.
	 */
	async decodeToken(token: string): Promise<any> {
		try {
			// Verify the token using the secret key
			const decoded = jwt.verify(token, this.token_key);

			// If the token is not valid, throw an error
			if (!decoded) {
				throw new Error('Invalid account token');
			}

			// Return the decoded payload
			return decoded;
		} catch (error: any) {
			// If there is an error during decoding, throw a new error with the original error message
			throw new Error(error.message);
		}
	}

	/**
	 * Retrieves all devices associated with the account from the database.
	 *
	 * @returns A Promise that resolves to an array of device information if found, or `false` if no devices are found.
	 * @throws Will throw an error if there is an issue retrieving the devices from the database.
	 */
	async getDevices(): Promise<any> {
		try {
			// Fetch the device data from the database
			const device = await this.db.getDB(this.account, this.device);

			// If device data exists, return it
			if (device) {
				return device.device;
			} else {
				// If no device data exists, return false
				return false;
			}
		} catch (error: any) {
			// If an error occurs during the retrieval process, throw a new error with the original error message
			throw new Error(error.message);
		}
	}

	/**
	 * Retrieves a specific device from the database by its ID.
	 *
	 * @param id - The ID of the device to retrieve.
	 * @returns A Promise that resolves to the device information if found, or `false` if not found.
	 * @throws Will throw an error if there is an issue retrieving the device from the database.
	 */
	async getDevice(id: string): Promise<any> {
		try {
			// Fetch the device data from the database
			const device = await this.db.getDB(this.account, this.device);

			// If device data exists, find the device with the given ID
			if (device) {
				const findDevice = device.device.find((d: Device) => d.id === id);

				// If the device is found, return it
				if (findDevice) {
					return findDevice;
				} else {
					// If the device is not found, return false
					return false;
				}
			} else {
				// If no device data exists, return false
				return false;
			}
		} catch (error: any) {
			// If an error occurs during the retrieval process, throw a new error with the original error message
			throw new Error(error.message);
		}
	}
}

export default ACCOUNT;