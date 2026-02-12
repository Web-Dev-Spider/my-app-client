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
        <form onSubmit={handleSubmit} className='flex bg-slate-100 flex-col h-full  p-5'>
            <h2>Welcome to KYC Page</h2>
            <div className="flex items-center gap-3 my-4">
                <span className="text-lg font-semibold whitespace-nowrap">
                    Personal details
                </span>

                <hr className="flex-1 border-gray-300" />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4'>
                <Input type="select" labelText="Salutation" name="mrMrsMs" value={kycData.mrMrsMs} onChange={handleChange} options={[{ label: "Select", value: "" }, { label: "Mr", value: "Mr" }, { label: "Mrs", value: "Mrs" }, { label: "Ms", value: "Ms" }]} />
                <Input labelText="First Name" name="fName" value={kycData.fName} onChange={handleChange} />
                <Input labelText="Middle Name" name="mName" value={kycData.mName} onChange={handleChange} />
                <Input labelText="Last Name" name="lName" value={kycData.lName} onChange={handleChange} />
                <Input labelText="Date of Birth" name="dob" type="date" value={kycData.dob} onChange={handleChange} />
                <Input labelText="Father or Spouse" name="fatherOrSpouse" value={kycData.fatherOrSpouse} onChange={handleChange} />
                <Input labelText="Consumer No" name="consumerNo" value={kycData.consumerNo} onChange={handleChange} />
                <Input labelText="Mobile No" name="mobileNo" value={kycData.mobileNo} onChange={handleChange} />
                <Input labelText="Email" name="email" value={kycData.email} onChange={handleChange} />
            </div>
            <div className="flex items-center gap-3 my-4">
                <span className="text-lg font-semibold whitespace-nowrap">
                    Contact details
                </span>

                <hr className="flex-1 border-gray-300" />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4'>
            </div>
            <hr className="w-full my-4 border-gray-300" />

            <button className='bg-blue-500 text-white px-4 py-2 rounded-md md:w-1/4' type='submit'>Submit</button>
        </form>
    )
}

export default KycPage
