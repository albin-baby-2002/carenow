"use server";
import { ID, Query } from "node-appwrite";
import { databases } from "../appwrite.config";
import { parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.type";
import { revalidatePath } from "next/cache";

export const createAppointment = async (
  appointmentData: CreateAppointmentParams,
) => {
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

export const getAppointment = async (appointmentId: string) => {
  try {
    const appointment = await databases.getDocument(
      process.env.DATABASE_ID!,
      process.env.APPOINTMENTS_COLLECTION_ID!,
      appointmentId,
    );

    return appointment;
  } catch (error) {
    console.log(error);
  }
};

export const getRecentAppointments = async () => {
  try {
    const appointments = await databases.listDocuments(
      process.env.DATABASE_ID!,
      process.env.APPOINTMENTS_COLLECTION_ID!,
      [Query.orderDesc("$createdAt")],
    );

    const intialCounts = {
      scheduledCount: 0,
      pendingCount: 0,
      cancelledCount: 0,
    };

    const counts = (appointments.documents as Appointment[]).reduce(
      (acc, appointments) => {
        if (appointments.status === "scheduled") {
          acc.scheduledCount += 1;
        } else if (appointments.status === "pending") {
          acc.pendingCount += 1;
        } else if (appointments.status === "cancelled") {
          acc.cancelledCount += 1;
        }

        return acc;
      },
      intialCounts,
    );
    
    const data = {
      total:appointments.total,
      ...counts,
      documents:appointments.documents
    }
    
    return parseStringify(data)
  } catch (error) {
    
    console.log(error)
  }
};


export const updateAppointment = async ({appointmentId,userId,appointment,type}:UpdateAppointmentParams) => {
  try {
    
    const updatedAppointment = await databases.updateDocument(
      process.env.DATABASE_ID!,
      process.env.APPOINTMENTS_COLLECTION_ID!,
      appointmentId,
      appointment
    );
    
    if(!updatedAppointment){
      throw new Error('Failed to update appointment2')
    }
    
    revalidatePath('/admin');
    
    return parseStringify(updatedAppointment)
    
  } catch (error) {
    
    console.log(error)
  }
};
