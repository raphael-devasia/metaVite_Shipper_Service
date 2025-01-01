import mongoose from "mongoose"
import Company, { IClient, IClientResult, ICompany } from "../database/shipper.model"
import { connectRabbitMQ } from "./rabbitmq.service"
import { deleteUserResourcebyid, fetchGetAllClients, fetchGetAllPickUps, fetchGetSingleClient, fetchGetSinglePickUp, getShipperById, saveClientToDB, savePickupToDB } from "../repositories/shipper.repository"


const consumerShipperServiceQueue = async () => {
    const {  channel } = await connectRabbitMQ()
    const queue = "shipperServiceQueue"

    await channel.assertQueue(queue, { durable: true })
    console.log("Waiting for messages in queue:", queue)

    channel.consume(queue, async (msg: any) => {
        if (msg !== null) {
            const message = JSON.parse(msg.content.toString())
            console.log("Received message:", message)

            const {
                userId,
                name,
                email,
                companyRefId,
                personalDetails: { emergencyContact },
                companyDetails,
            } = message

            const {
                companyName,
                companyEmail,
                companyPhone,
                taxId,
                address: companyAddress,
            } = companyDetails

            const { addressLine1, addressLine2, city, state, postalCode } =
                companyAddress

            try {
                if (!userId) {
                    throw new Error("Missing userId in message")
                }
                const objectId = new mongoose.Types.ObjectId(userId)
                console.log(objectId);
                

                const newCompany = new Company({
                    _id: objectId,
                    name,
                    email,
                    companyRefId,
                    address: {
                        addressLine1,
                        addressLine2,
                        city,
                        state,
                        postalCode,
                    },
                    personalDetails: {
                        emergencyContact: {
                            name: emergencyContact.name,
                            phoneNumber: emergencyContact.phoneNumber,
                        },
                    },
                    companyDetails: {
                        companyName,
                        companyEmail,
                        companyPhone,
                        taxId,
                        address: {
                            addressLine1,
                            addressLine2,
                            city,
                            state,
                            postalCode,
                        },
                    },
                })

                await newCompany.save()
                console.log("Company data saved:", newCompany)
                channel.ack(msg)
            } catch (error) {
                console.error("Error saving company data:", error)
                channel.nack(msg)
            }
        }
    })
}

consumerShipperServiceQueue().catch(console.error)



export const addNewClient = async (client:IClient): Promise<IClientResult> => {
    try {
        console.log(client);
        
        // Call the repository to register the client
        return await saveClientToDB(client)
    } catch (error) {
        console.error("Error in adding Client:", error)
        throw new Error("Service error while fetching user")
    }
}
export const addNewPickup = async (address: IClient): Promise<IClientResult> => {
    try {
        console.log(address)

        // Call the repository to register the client
        return await savePickupToDB(address)
    } catch (error) {
        console.error("Error in adding Address:", error)
        throw new Error("Service error while fetching user")
    }
}
export const GetAllPickUps = async (
    id: string
): Promise<{ success: boolean; addresses: IClient[]; message: string }> => {
    try {
        console.log(id)

        // Call the repository to register the client
        return await fetchGetAllPickUps(id)
    } catch (error) {
        console.error("Error in adding Address:", error)
        throw new Error("Service error while fetching user")
    }
}
export const getAllClients = async (
    id: string
): Promise<{ success: boolean; addresses: IClient[]; message: string }> => {
    try {
        console.log(id)

        // Call the repository to register the client
        return await fetchGetAllClients(id)
    } catch (error) {
        console.error("Error in adding Address:", error)
        throw new Error("Service error while fetching user")
    }
}

export const fetchShipperById = async (id: string): Promise<ICompany | null> => {
    try {
       
        return await getShipperById(id)
    } catch (error) {
        console.error("Error in fetchDriverById service:", error)
        throw new Error("Service error while fetching user")
    }
}

export const fetchClientById = async (
    id: string
): Promise<{ success: boolean; address: IClient | null; message: string }> => {
    try {
        console.log(id)

        // Call the repository to fetch the client
        return await fetchGetSingleClient(id)
    } catch (error) {
        console.error("Error in fetching client:", error)
        return {
            success: false,
            message: "Service error while fetching client.",
            address: null,
        }
    }
}

export const fetchPickUpById = async (
    id: string
): Promise<{ success: boolean; address: IClient | null; message: string }> => {
    try {
        console.log(id)

        // Call the repository to fetch the pickup
        return await fetchGetSinglePickUp(id)
    } catch (error) {
        console.error("Error in fetching pickup:", error)
        return {
            success: false,
            message: "Service error while fetching pickup.",
            address: null,
        }
    }
}
export const deleteUserResource = async (
    id: string,
    message:string
): Promise<{ success: boolean; message: string }> => {
    try {
        let target:string =''
        console.log("Attempting to delete resource with ID:", id)

        // Validate the ID
        if (!id) {
            return {
                success: false,
                message: "Resource ID is required for deletion.",
            }
        }
          if (!message) {
              return {
                  success: false,
                  message: "Resource target is required for deletion.",
              }
          }
          if(message==='All Clients'){
            target = 'Clients'
          }if (message === "All Pickups"){
             target = "Pickups"
          }
              // Call the repository function to delete the resource
              const deletionResult = await deleteUserResourcebyid(id, target)

        // Return the result from the repository
        return deletionResult
    } catch (error) {
        console.error("Error in deleting resource:", error)
        return {
            success: false,
            message:
                "An error occurred while attempting to delete the resource.",
        }
    }
}
