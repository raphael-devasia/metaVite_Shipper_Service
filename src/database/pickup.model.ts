import mongoose, { Schema } from "mongoose"

const AddressSchema: Schema = new Schema(
    {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    { _id: false }
)

const PickUpSchema: Schema = new Schema(
    {
        companyName: { type: String, required: true },

        address: { type: AddressSchema, required: true },
        contactPerson: { type: String, required: true },
        contactNumber: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
)

export default mongoose.model("Pickup", PickUpSchema)
