import { ID, Query } from "node-appwrite";
import { users } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  try {
    console.log(user, "form user");
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name,
    );

    console.log({ newUser }, "user");

    return parseStringify(newUser);
  } catch (error: any) {
    console.log(error, "error");

    if (error && error?.code === 409) {
      const docs = await users.list([Query.equal("email", [user.email])]);

      return docs?.users[0];
    }
  }
};

export const getUser = async (userId: string) => {
  try {
    const user = await users.get(userId);

    return parseStringify(user);
  } catch (error) {
    console.log(error);
  }
};
