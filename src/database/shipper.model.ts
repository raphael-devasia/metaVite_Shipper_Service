import mongoose, { Schema, Document } from "mongoose"

interface IAddress {
    addressLine1: string
    addressLine2?: string
    city: string
    state: string
    postalCode: string
}

interface IEmergencyContact {
    name: string
    phoneNumber: string
}

interface ICompanyDetails {
    companyName: string
    companyEmail: string
    companyPhone: string
    taxId: string
    address: IAddress
}

export interface ICompany extends Document {
    _id: string
    name: {
        firstName: string
        lastName: string
    }
    email: string
    companyRefId: string
    address: IAddress
    personalDetails: {
        emergencyContact: IEmergencyContact
    }
    companyDetails: ICompanyDetails
}

const AddressSchema: Schema = new Schema({
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
},{_id:false})

const EmergencyContactSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        phoneNumber: { type: String, required: true },
    },
    { _id: false }
)

const CompanyDetailsSchema: Schema = new Schema(
    {
        companyName: { type: String, required: true },
        companyEmail: { type: String, required: true },
        companyPhone: { type: String, required: true },
        taxId: { type: String, required: true },
        address: { type: AddressSchema, required: true },
    },
    { _id: false }
)

const CompanySchema: Schema = new Schema({
    _id: { type: String, required: true },
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    email: { type: String, required: true },
    companyRefId: { type: String, required: true },
    address: { type: AddressSchema, required: true },
    personalDetails: {
        emergencyContact: { type: EmergencyContactSchema, required: true },
    },
    companyDetails: { type: CompanyDetailsSchema, required: true },
})

export default mongoose.model<ICompany>("Company", CompanySchema)
