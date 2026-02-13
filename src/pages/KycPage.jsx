import React from 'react'
import Input from '../components/Input'
import api from '../axios/axiosInstance'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eKycSchema } from '../validators/eKycValidator'

const KycPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(eKycSchema),
        defaultValues: {
            mrMrsMs: "",
            fName: "",
            mName: "",
            lName: "",
            dob: "",
            fatherOrSpouse: "",
            consumerNo: "",
            mobileNo: "",
            email: "",
            hName: "",
            hNo: "",
            wardNo: "",
            roadName: "",
            landMark: "",
            cityTownVillage: "",
            districtName: "",
            pincode: ""
        }
    })

    const onSubmit = async (data) => {
        try {
            const res = await api.post("/pdf/kyc", data, { responseType: "blob" });
            window.open(URL.createObjectURL(new Blob([res.data], {
                type: "application/pdf"
            })));
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="min-h-screen bg-theme-primary transition-colors duration-300 p-2 sm:p-4">
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col h-full max-w-7xl mx-auto bg-theme-secondary p-4 rounded-lg shadow-md border border-theme-color'>
                <h2 className="text-xl font-bold text-theme-primary mb-3 border-b border-theme-color pb-2">KYC Application</h2>

                <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-theme-secondary whitespace-nowrap">
                        Personal Details
                    </span>
                    <hr className="flex-1 border-theme-color opacity-50" />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-2'>
                    <Input
                        type="select"
                        labelText="Salutation"
                        {...register("mrMrsMs")}
                        error={errors.mrMrsMs}
                        options={[{ label: "Mr", value: "Mr" }, { label: "Mrs", value: "Mrs" }, { label: "Ms", value: "Ms" }]}
                    />
                    <Input
                        labelText="First Name"
                        {...register("fName")}
                        error={errors.fName}
                    />
                    <Input
                        labelText="Middle Name"
                        {...register("mName")}
                        error={errors.mName}
                    />
                    <Input
                        labelText="Last Name"
                        {...register("lName")}
                        error={errors.lName}
                    />
                    <Input
                        labelText="DOB"
                        type="date"
                        {...register("dob")}
                        error={errors.dob}
                    />
                    <Input
                        labelText="Father/Spouse"
                        {...register("fatherOrSpouse")}
                        error={errors.fatherOrSpouse}
                    />
                    <Input
                        labelText="Consumer No"
                        {...register("consumerNo")}
                        error={errors.consumerNo}
                    />
                    <Input
                        labelText="Mobile No"
                        {...register("mobileNo")}
                        error={errors.mobileNo}
                    />
                    <Input
                        labelText="Email"
                        {...register("email")}
                        error={errors.email}
                    />
                </div>

                <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-theme-secondary whitespace-nowrap">
                        Address Details
                    </span>
                    <hr className="flex-1 border-theme-color opacity-50" />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4'>
                    <Input
                        labelText="House/Flat #, Name*"
                        {...register("hName")}
                        error={errors.hName}
                    />
                    <Input
                        labelText="House No*"
                        {...register("hNo")}
                        error={errors.hNo}
                    />
                    <Input
                        labelText="Ward No*"
                        {...register("wardNo")}
                        error={errors.wardNo}
                    />
                    <Input
                        labelText="Street/Road Name"
                        {...register("roadName")}
                        error={errors.roadName}
                    />
                    <Input
                        labelText="Land mark"
                        {...register("landMark")}
                        error={errors.landMark}
                    />
                    <Input
                        labelText="City/ Town /Village"
                        {...register("cityTownVillage")}
                        error={errors.cityTownVillage}
                    />
                    <Input
                        labelText="District"
                        {...register("districtName")}
                        error={errors.districtName}
                    />
                    <Input
                        labelText="Pincode"
                        {...register("pincode")}
                        error={errors.pincode}
                    />
                </div>

                <hr className="w-full my-3 border-theme-color opacity-30" />

                <div className="flex justify-end">
                    <button
                        className='px-6 py-2 rounded-md font-bold text-sm shadow-sm transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1'
                        style={{ backgroundColor: 'var(--accent-color)', color: 'var(--bg-primary)' }}
                        type='submit'
                    >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    )
}

export default KycPage
