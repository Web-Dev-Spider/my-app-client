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
            poIcode: "",
            poINo: "",
            poaCode: "",
            dob: "",
            fatherOrSpouse: "",
            consumerNo: "",
            mobNo: "",
            emailId: "",
            hName: "",
            hNo: "",
            wardNo: "",
            roadName: "",
            landMark: "",
            cityTownVillage: "",
            districtName: "",
            pinCode: "",
            poANo: "",
            docDate: new Date().toLocaleDateString('en-CA')
        }
    })

    const [selectedPages, setSelectedPages] = React.useState({
        kyc: true,
        newConnectionDeclaration: true,
        hotPlateInspection: true
    });

    const handlePageSelection = (page) => {
        setSelectedPages(prev => ({
            ...prev,
            [page]: !prev[page]
        }));
    };

    const onSubmit = async (data) => {
        const pagesToPrint = Object.keys(selectedPages).filter(page => selectedPages[page]);

        if (pagesToPrint.length === 0) {
            alert("Please select at least one page to print");
            return;
        }

        const payload = {
            ...data,
            selectedPages: pagesToPrint
        };

        try {
            const res = await api.post("/pdf/kyc", payload, { responseType: "blob" });
            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (err) {
            // console.log(err);
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
                    <hr className="flex-1 text-theme-color opacity-100" />


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
                        labelText="Date of Birth"
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
                        type="select"
                        labelText="Proof of ID"
                        {...register("poIcode")}
                        error={errors.poIcode}
                        options={[
                            { label: "Aadhaar (UID/EID)", value: "POI01" },
                            { label: "Passport", value: "POI02" },
                            { label: "PAN Card", value: "POI03" },
                            { label: "Voter ID Card", value: "POI05" },
                            { label: "ID card Issued By Central/State", value: "POI06" },
                            { label: "Driving License", value: "POI07" }
                        ]}
                    />
                    <Input
                        labelText="Proof of ID Number"
                        {...register("poINo")}
                        error={errors.poINo}
                    />
                    <Input
                        labelText="Mobile No"
                        {...register("mobNo")}
                        error={errors.mobNo}
                    />
                    <Input
                        labelText="Consumer No"
                        {...register("consumerNo")}
                        error={errors.consumerNo}
                    />
                    <Input
                        labelText="LandLine No"
                        {...register("landLineNo")}
                        error={errors.landLineNo}
                    />
                    <Input
                        labelText="Email"
                        {...register("emailId")}
                        error={errors.emailId}
                    />


                </div>

                <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-theme-secondary whitespace-nowrap">
                        Address Details
                    </span>
                    <hr className="flex-1 text-theme-color opacity-100" />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4'>
                    <Input
                        type="select"
                        labelText="Proof of Address"
                        {...register("poaCode")}
                        error={errors.poaCode}
                        options={[
                            { label: "Aadhaar (UID)", value: "POA01" },
                            { label: "Driving License", value: "POA02" },
                            { label: "Lease agreement", value: "POA03" },
                            { label: "Voter ID", value: "POA05" },
                            { label: "Telephone/Electricity /Water bill", value: "POA06" },
                            { label: "Passport", value: "POA07" },
                            { label: "Self-declaration attested by a Gazetted officer", value: "POA08" },
                            { label: "Ration Card", value: "POA09" },
                            { label: "Flat allotment/possession letter", value: "POA10" },
                            { label: "House registration document", value: "POA11" },
                            { label: "LIC Policy", value: "POA12" },
                            { label: "Bank/Credit Card Statement", value: "POA13" }
                        ]}
                    />
                    {/* <Input
                        labelText="Proof of Address No"
                        {...register("poANo")}
                        error={errors.poANo}
                    /> */}
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
                        {...register("pinCode")}
                        error={errors.pinCode}
                    />
                    <Input
                        labelText="Ration Card State"
                        {...register("rationCardState")}
                        error={errors.rationCardState}
                    />
                    <Input
                        labelText="Ration Card Number"
                        {...register("rationCardNo")}
                        error={errors.rationCardNo}
                    />
                    <Input
                        labelText="Document Date"
                        type="date"
                        {...register("docDate")}
                        error={errors.docDate}
                    />
                </div>

                <hr className="w-full my-3 border-theme-color opacity-30" />

                <div className="flex flex-col sm:flex-row justify-end items-center gap-4">
                    <div className="flex items-center gap-4 mr-2">
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-theme-primary select-none">
                            <input
                                type="checkbox"
                                checked={selectedPages.kyc}
                                onChange={() => handlePageSelection('kyc')}
                                className="w-4 h-4 rounded border-gray-300 text-theme-accent focus:ring-theme-accent"
                            />
                            KYC Page
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-theme-primary select-none">
                            <input
                                type="checkbox"
                                checked={selectedPages.newConnectionDeclaration}
                                onChange={() => handlePageSelection('newConnectionDeclaration')}
                                className="w-4 h-4 rounded border-gray-300 text-theme-accent focus:ring-theme-accent"
                            />
                            New Connection Declaration
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-theme-primary select-none">
                            <input
                                type="checkbox"
                                checked={selectedPages.hotPlateInspection}
                                onChange={() => handlePageSelection('hotPlateInspection')}
                                className="w-4 h-4 rounded border-gray-300 text-theme-accent focus:ring-theme-accent"
                            />
                            Hot Plate Inspection Report
                        </label>
                    </div>
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
