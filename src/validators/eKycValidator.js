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
    mobileNo: z.string().trim().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
    email: z.string().email("Invalid email address").trim(),

    // Address Details
    hName: z.string().trim().min(1, "House/Flat Name is required"),
    hNo: z.string().trim().min(1, "House No is required"),
    wardNo: z.string().trim().min(1, "Ward No is required"),
    roadName: z.string().trim().optional(),
    landMark: z.string().trim().optional(),
    cityTownVillage: z.string().trim().min(2, "City/Town/Village is required"),
    districtName: z.string().trim().min(2, "District is required"), // Assuming auto-filled or select, but likely text input for now
    pincode: z.string().trim().regex(/^[0-9]{6}$/, "Pincode must be 6 digits"),
});