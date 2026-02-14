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
    consumerNo: z.string().trim().max(10, "Consumer number must be at most 10 characters").optional().or(z.literal("")).transform(v => v ? v.toUpperCase() : v),
    mobNo: z.string().trim().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
    emailId: z
        .union([
            z.string().trim().email("Invalid email address").max(26, "Maximum 26 characters allowed"),
            z.literal("")
        ])
        .optional(),

    landLineNo: z.string().trim().max(12, "Maximum 12 characters allowed"),

    // Address Details
    hName: z.string().trim().max(18, "Maximum 18 characters allowed"),
    hNo: z.string().trim().max(4, "Maximum 4 characters allowed").optional(),
    wardNo: z.string().trim().max(4, "Maximum 4 characters allowed").optional(),
    roadName: z.string().trim().max(26, "Maximum 26 characters allowed"),
    landMark: z.string().trim().max(17, "Maximum 17 characters allowed"),
    cityTownVillage: z.string().trim().min(2, "City/Town/Village is required").max(16, "Maximum 16 characters allowed"),
    districtName: z.string().trim().min(2, "District is required").max(13, "Maximum 13 characters allowed"), // Assuming auto-filled or select, but likely text input for now
    pinCode: z.string().trim().regex(/^[0-9]{6}$/, "Pincode must be 6 digits").min(6, "Pincode must be 6 digits").max(6, "Pincode must be 6 digits"),
    rationCardNo: z.union([z.string().trim().regex(/^[0-9]{12}$/, "Ration Card Number must be 12 digits").min(12, "Ration Card Number must be 12 digits").max(12, "Ration Card Number must be 12 digits"), z.literal("")]).optional(),
    rationCardState: z.union([z.string().trim().min(3, "Ration Card State is required").max(13, "Maximum 13 characters allowed"), z.literal("")]).optional(),
    docDate: z.coerce.date().default(() => new Date())
});