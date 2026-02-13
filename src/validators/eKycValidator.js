import { z } from "zod";

export const eKycSchema = z.object({
    // Personal Details
    mrMrsMs: z.enum(["Mr", "Mrs", "Ms"], { message: "Please select a salutation" }),
    fName: z.string().trim().min(2, "First Name must be at least 2 characters"),
    mName: z.string().trim().optional(),
    lName: z.string().trim().min(1, "Last Name is required"),

    dob: z.string()
        .min(1, { message: "DOB is required" })
        .transform((val) => new Date(val))
        .refine((date) => {
            const today = new Date();
            const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
            return date <= minAgeDate;
        }, { message: "Customer must be at least 18 years old" }),

    fatherOrSpouse: z.string().trim().min(2, "Father/Spouse name is required"),
    consumerNo: z.string().trim().max(10, "Consumer number must be at most 10 characters").optional().or(z.literal("")),
    mobNo: z.string().trim().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
    emailId: z.string().email("Invalid email address").trim().max(26, "Maximum 26 characters allowed"),
    landLineNo: z.string().trim().max(12, "Maximum 12 characters allowed"),

    // Address Details
    hName: z.string().trim().min(1, "House/Flat Name is required"),
    hNo: z.string().trim().max(4, "Maximum 4 characters allowed").optional(),
    wardNo: z.string().trim().max(4, "Maximum 4 characters allowed").optional(),
    roadName: z.string().trim().max(26, "Maximum 26 characters allowed"),
    landMark: z.string().trim().max(17, "Maximum 17 characters allowed"),
    cityTownVillage: z.string().trim().min(2, "City/Town/Village is required").max(16, "Maximum 16 characters allowed"),
    districtName: z.string().trim().min(2, "District is required"), // Assuming auto-filled or select, but likely text input for now
    pinCode: z.string().trim().regex(/^[0-9]{6}$/, "Pincode must be 6 digits").min(6, "Pincode must be 6 digits").max(6, "Pincode must be 6 digits"),
});