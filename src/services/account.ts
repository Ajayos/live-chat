import ACCOUNT from "../sql/account";

const ACC = new ACCOUNT();

/**
 * Retrieves the user information using the provided token.
 * @param token - The authentication token.
 * @returns A Promise that resolves to the user information.
 * @throws An error if there is an issue fetching the user.
 */
export const me = async (token: string): Promise<any> => {
  try {
    const user = await ACC.getUser(token);
    return user;
  } catch (error) {
    throw new Error("Error fetching user");
  }
};

/**
 * Logs in a user.
 *
 * @param body - The login request body.
 * @returns A Promise that resolves to the logged-in user.
 * @throws An error if there is an issue logging in.
 */
export const login = async (body: any): Promise<any> => {
  try {
    const user = await ACC.login(body);
    return user;
  } catch (error) {
    throw new Error("Error logging in");
  }
};

/**
 * Creates a new account.
 * @param body - The account details.
 * @returns A promise that resolves to the created user.
 * @throws An error if there was an issue creating the account.
 */
export const create = async (body: any): Promise<any> => {
  try {
    const user = await ACC.createAccount(body);
    return user;
  } catch (error) {
    throw new Error("Error creating account");
  }
};

/**
 * Updates the user with the specified username.
 * @param {string} username - The username of the user to update.
 * @param {any} body - The updated user data.
 * @returns {Promise<any>} - A promise that resolves to the updated user.
 * @throws {Error} - If there is an error updating the user.
 */
export const update = async (username: string, body: any): Promise<any> => {
  try {
    const user = await ACC.update(username, body);
    return user;
  } catch (error) {
    throw new Error("Error updating user");
  }
};

/**
 * Deletes an account.
 * @param username - The username of the account to be deleted.
 * @returns A Promise that resolves to the deleted user.
 * @throws An error if there was a problem deleting the user.
 */
export const deleteAccount = async (username: string): Promise<any> => {
  try {
    const user = await ACC.deleteAccount(username);
    return user;
  } catch (error) {
    throw new Error("Error deleting user");
  }
};
