import React, { useState } from 'react'
import Input from '../components/Input'
import api from '../axios/axiosInstance'

const KycPage = () => {
    const [kycData, setKycData] = useState({
        mrMrsMs: "",
        fName: "",
        mName: "",
        lName: "",
        dob: "",
        fatherOrSpouse: "",
        consumerNo: "",
        mobileNo: "",
        email: ""
    })
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await api.post("/pdf/kyc", kycData, { responseType: "blob" })

            .catch(err => {
                console.log(err);
            })
        // console.log(res.data)

        window.open(URL.createObjectURL(new Blob([res.data], {
            type: "application/pdf"
        })));
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setKycData(prev => ({
            ...prev,
            [name]: value
        }))
    }
    return (
        <div className="min-h-screen bg-theme-primary transition-colors duration-300 p-2 sm:p-4">
            <form onSubmit={handleSubmit} className='flex flex-col h-full max-w-7xl mx-auto bg-theme-secondary p-4 rounded-lg shadow-md border border-theme-color'>
                <h2 className="text-xl font-bold text-theme-primary mb-3 border-b border-theme-color pb-2">KYC Application</h2>

                <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-theme-secondary whitespace-nowrap">
                        Personal Details
                    </span>
                    <hr className="flex-1 border-theme-color opacity-50" />

                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-2'>
                    <Input type="select" labelText="Salutation" name="mrMrsMs" value={kycData.mrMrsMs} onChange={handleChange} options={[{ label: "Mr", value: "Mr" }, { label: "Mrs", value: "Mrs" }, { label: "Ms", value: "Ms" }]} />
                    <Input labelText="First Name" name="fName" value={kycData.fName} onChange={handleChange} />
                    <Input labelText="Middle Name" name="mName" value={kycData.mName} onChange={handleChange} />
                    <Input labelText="Last Name" name="lName" value={kycData.lName} onChange={handleChange} />
                    <Input labelText="DOB" name="dob" type="date" value={kycData.dob} onChange={handleChange} />
                    <Input labelText="Father/Spouse" name="fatherOrSpouse" value={kycData.fatherOrSpouse} onChange={handleChange} />
                    <Input labelText="Consumer No" name="consumerNo" value={kycData.consumerNo} onChange={handleChange} />
                    <Input labelText="Mobile No" name="mobileNo" value={kycData.mobileNo} onChange={handleChange} />
                    <Input labelText="Email" name="email" value={kycData.email} onChange={handleChange} />

                </div>

                <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-theme-secondary whitespace-nowrap">
                        Address Details
                    </span>
                    <hr className="flex-1 border-theme-color opacity-50" />
                </div>

                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4'>
                    <Input labelText="House/Flat #, Name*" name="hName" value={kycData.hName} onChange={handleChange} />
                    <Input labelText="House No*" name="hNo" value={kycData.hNo} onChange={handleChange} />
                    <Input labelText="Ward No*" name="wardNo" value={kycData.wardNo} onChange={handleChange} />
                    <Input labelText="Street/Road Name" name="roadName" value={kycData.roadName} onChange={handleChange} />
                    <Input labelText="Land mark" name="landMark" value={kycData.landMark} onChange={handleChange} />
                    <Input labelText="City/ Town /Village" name="cityTownVillage" value={kycData.cityTownVillage} onChange={handleChange} />
                    <Input labelText="District" name="districtName" value={kycData.districtName} onChange={handleChange} />
                    <Input labelText="Pincode" name="pincode" value={kycData.pincode} onChange={handleChange} />
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
