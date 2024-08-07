"use server"
import { ID } from "node-appwrite";
import { databases } from "../appwrite.config";
import { parseStringify } from "../utils";

export const createAppointment = async (appointmentData:CreateAppointmentParams) => {
  try {
    try {
      let appointment = await databases.createDocument(
        process.env.DATABASE_ID!,
        process.env.APPOINTMENTS_COLLECTION_ID!,
        ID.unique(),
        appointmentData,
      );
      console.log(appointment, "success");
      return parseStringify(appointment);
    } catch (error) {
      console.log(error);
    }
  } catch (error) {}
};

export const getAppointment = async (appointmentId:string)=>{
  try {
    
    const appointment = await databases.getDocument(
      process.env.DATABASE_ID!,
      process.env.APPOINTMENTS_COLLECTION_ID!,
      appointmentId
    );
    
    return appointment
  } catch (error) {
    
    console.log(error)
  }
}