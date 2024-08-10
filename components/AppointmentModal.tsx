"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Appointment } from "@/types/appwrite.type";

const AppointmentModal = ({
  type,
  patientId,
  userId,
  appointment
}: {
  type: "schedule" | "cancel";
  patientId: string;
  userId: string;
  appointment?: Appointment;
  setOpen:(open:boolean)=>void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant={"ghost"}
            className={`capitalize ${type === "schedule" && "text-green-500"} ${type === "cancel" && "text-red-500"}`}
          >
            {type}
          </Button>
        </DialogTrigger>
        <DialogContent className="shad-dialog sm:max-w-md">
          <DialogHeader className="mb-4 space-y-3">
            <DialogTitle className="capitalize">{type} Appointment</DialogTitle>
            <DialogDescription>
              Plesase fill in the following details to {type} an appointment
            </DialogDescription>
          </DialogHeader>
          {/* <AppointmentForm/> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppointmentModal;
