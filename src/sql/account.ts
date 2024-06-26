import DATABASE from "../../lib/database";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

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
  private user: string;
  private salt: number;
  private token_key: string;

  constructor() {
    super();
    this.user = "user";
    this.salt = 10;
    this.token_key = process.env.TOKEN || "chatApp";
  }

  async createAccount(data: {
    username: string;
    password: string;
  }): Promise<any> {
    try {
      const { username, password } = data;

      // Check if the username already exists in the database
      const existingUser = await this.db.getDB(this.user, username);
      if (existingUser) {
        throw new Error("Username already exists");
      }

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

      await this.db.setDB(this.user, username, account);
      return account;
    } catch (error) {
      throw new Error("Error creating account");
    }
  }

  async login(data: { username: string; password: string }): Promise<any> {
	try {
	  const { username, password } = data;

	  // Check if the user exists in the database
	  const user = await this.db.getDB(this.user, username);
	  if (!user) {
		throw new Error("User not found");
	  }

	  // Check if the password is correct
	  const validPassword = await bcrypt.compare(password, user.password);
	  if (!validPassword) {
		throw new Error("Invalid password");
	  }

	  // Generate a JWT token for the account
	  const token = await this.createToken({ id: user.id, password: user.password });

	  // Return the user information and the token
	  return { user, token };
	} catch (error: any) {
	  throw new Error(error.message);
	}
  }

  /**
   * Updates the user's information in the database.
   *
   * @param data - The new user information to be updated.
   * @returns A Promise that resolves to the updated user information.
   * @throws Will throw an error if there is an issue updating the user information.
   */
  async update(username: string, data: any): Promise<any> {
    try {
      // Fetch the existing user data from the database
      const oldData = await this.db.getDB(this.user, username);

      // Merge the new data with the existing data
      const newData = { ...oldData, ...data };

      // Update the user data in the database
      await this.db.setDB(this.user, username, newData);

      // Return the updated user information
      return newData;
    } catch (error: any) {
      // If an error occurs during the update process, throw a new error with the original error message
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
  async createToken(data: { id: string; password: string }): Promise<any> {
    try {
      const token = jwt.sign(data, this.token_key, {
        expiresIn: "5w",
      });

      if (!token) {
        throw new Error("Error generating account token");
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
        throw new Error("Invalid account token");
      }

      // Return the decoded payload
      return decoded;
    } catch (error: any) {
      // If there is an error during decoding, throw a new error with the original error message
      throw new Error(error.message);
    }
  }

  /**
   * Deletes the user account from the database.
   *
   * @param username - The username of the account to be deleted.
   * @returns A Promise that resolves to a success message.
   * @throws Will throw an error if there is an issue deleting the account.
   */
  async deleteAccount(username: string): Promise<any> {
    try {
      // Check if the user exists in the database
      const user = await this.db.getDB(this.user, username);
      if (!user) {
        throw new Error("User not found");
      }

      // Delete the user from the database
      await this.db.deleteDB(this.user, username);

      // Return a success message
      return "Account deleted successfully";
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async getUser(username: string): Promise<any> {
	try {
	  const user = await this.db.getDB(this.user, username);
	  if (!user) {
		throw new Error("User not found");
	  }
	  return user;
	} catch (error: any) {
	  throw new Error(error.message);
	}
  }
}

export default ACCOUNT;
