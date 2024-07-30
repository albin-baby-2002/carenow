"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { patientFormSchema, RegisterFormSchema } from "@/lib/validation";
import { createUser, registerPatient } from "@/lib/actions/patient.actions";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { RadioGroup } from "@radix-ui/react-radio-group";
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  registerFormDefaultValues,
} from "@/constants";
import { RadioGroupItem } from "../ui/radio-group";
import { Label } from "@radix-ui/react-label";
import Image from "next/image";
import { SelectItem } from "../ui/select";
import FileUploader from "../FileUploader";

interface RegisterFormProps {
  user: User;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ user }) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof RegisterFormSchema>>({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      ...registerFormDefaultValues,
    },
  });

  async function onSubmit(values: z.infer<typeof RegisterFormSchema>) {
    console.log("submit");
    // setIsLoading(true);
    setIsLoading(true);
    try {
      let formData;
      if (
        values.identificationDocument &&
        values.identificationDocument?.length > 0
      ) {
        const blobFile = new Blob([values.identificationDocument[0]], {
          type: values.identificationDocument[0].type,
        });

        formData = new FormData();
        formData.append("blobFile", blobFile);
        formData.append("fileName", values.identificationDocument[0].name);
      }

      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: JSON.stringify(values.birthDate),
        identificationDocument: formData,
      };

      console.log(patientData);

      console.log(values.identificationDocument, "identification doc");

      const patient = await registerPatient(patientData);

      console.log("success", patient);

      setIsLoading(false);

      if (patient) router.push(`/patient/${patient.userId}/new-appointment`);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (err) => {
          console.log(err);
        })}
        className="flex-1 space-y-12"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <p className="sub-header">Personal Information</p>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="username"
          label="Full name"
          placeholder="John doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex w-full flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="phone"
            label="Phone number"
            placeholder="+91 9456239999"
            iconSrc="/assets/icons/email.svg"
            iconAlt="phone"
          />
        </div>

        <div className="flex w-full flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="birthDate"
            label="Date of Birth"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => {
              return (
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex h-11 gap-6 xl:justify-between"
                  >
                    {GenderOptions.map((option) => (
                      <div key={option} className="radio-group">
                        <RadioGroupItem value={option} id={option} />
                        <Label className="cursor-pointer" htmlFor={option}>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              );
            }}
          />
        </div>

        <div className="flex w-full flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="address"
            label="Address"
            placeholder="14th main street New York"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="occupation"
            label="Occupation"
            placeholder="Software Architect"
          />
        </div>

        <div className="flex w-full flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Emergency Contact Name"
            placeholder="Guardian's Name"
          />

          <CustomFormField
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Emergency Contact Number"
            placeholder="+91 9456239999"
            iconSrc="/assets/icons/email.svg"
            iconAlt="phone"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <p className="sub-header">Medical Information</p>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary Physician"
          placeholder="Select a physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem
              key={doctor.name}
              value={doctor.name}
              className="cursor-pointer hover:bg-slate-600"
            >
              <div className="flex items-center gap-2 py-2">
                <Image
                  src={doctor.image}
                  width={32}
                  height={32}
                  alt={doctor.name}
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <div className="flex w-full flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Insurance Provider"
            placeholder="National Health Group"
          />

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Insurance Policy Number"
            placeholder="3DFD32SFGGD3"
          />
        </div>

        <div className="flex w-full flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Honey, Lactose"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Current Medication"
            placeholder="Insulin, Ibuprofen"
          />
        </div>

        <div className="flex w-full flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedialHistory"
            label="Family Medical History"
            placeholder="Diabetes,High Blood Pressure"
          />

          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="Appendectomy,Tonsillectomy"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <p className="sub-header">Identification and verification</p>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification Type"
          placeholder="Select an identification type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem
              key={type}
              value={type}
              className="cursor-pointer hover:bg-slate-600"
            >
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Identification Number"
          placeholder="FD32SFGGD3"
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scanned copy of identification document"
          renderSkeleton={(field) => {
            return (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            );
          }}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <p className="sub-header">Consent and privacy</p>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="Treatment Consent"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />
        <CustomFormField
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="I consent to privacy policy"
        />

        <div className="flex w-full flex-col gap-6 xl:flex-row"></div>

        <SubmitButton Loading={isLoading}>Get started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
