"use server";

import { ID, Query, Functions } from "node-appwrite";
import { databases, storage, users } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createUser = async (user: CreateUserParams) => {
  try {
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name,
    );

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

export const registerPatient = async ({
  identificationDocument,
  ...patient
}: RegisterUserParams) => {
  try {
    let file, image;

    console.log(identificationDocument, "identification doc");

    let blob = identificationDocument?.get("blobFile");
    let fileName = identificationDocument?.get("fileName");

    if (blob) {
      image = new File([blob], "filename.ext");
    }

    if (image) {
      console.log(process.env.NEXT_PUBLIC_BUCKET_ID, "BUCKET ID");

      try {
        file = await storage.createFile(
          process.env.NEXT_PUBLIC_BUCKET_ID!,
          ID.unique(),
          image,
        );
      } catch (error) {
        console.log(error, "image error");
      }
    }

    console.log(process.env.DATABASE_ID, "DATABASE ID");

    console.log(
      "url",
      `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`,
    );

    try {
      let newPatient = await databases.createDocument(
        process.env.DATABASE_ID!,
        process.env.PATIENT_COLLECTION_ID!,
        ID.unique(),
        {
          identificationDocumentId: file?.$id || null,
          identificationDocumentUrl: `${process.env.NEXT_PUBLIC_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_BUCKET_ID}/files/${file?.$id}/view?project=${process.env.NEXT_PUBLIC_PROJECT_ID}`,
          ...patient,
        },
      );
      console.log(newPatient, "success");
      return parseStringify(newPatient);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {}
};


export const getPatient = async (userId: string) => {
  try {
    const patient = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.PATIENT_COLLECTION_ID!,
      [
        Query.equal('userId',userId)
      ]
    );

    
    console.log(userId,'patient')
    return parseStringify(patient.documents[0]);
  } catch (error) {
    console.log(error,'error getting patient data');
  }
};