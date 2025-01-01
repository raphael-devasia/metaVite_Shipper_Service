import Company, {
    IClient,
    IClientResult,
    ICompany,
} from "../database/shipper.model"
import Client from "../database/client.model"
import Pickup from "../database/pickup.model"
import { Types } from "mongoose"

export const saveClientToDB = async (
    clientData: IClient
): Promise<IClientResult> => {
    try {
        console.log(clientData)
       

        let userId: string

        // Check if a client with the same company name and address exists
        const existingClient = await Client.findOne({
            companyName: clientData.companyName,
            address: clientData.address,
        })

        // If the client already exists
        if (existingClient) {
            // Ensure _id is treated as an ObjectId and convert to string
            userId = (existingClient._id as Types.ObjectId).toString()

            console.log(
                "Client with the same company name and address already exists:",
                existingClient
            )
            if(clientData._id!==""){
                 return {
                     success: false,
                     message: "Client Data is already Available.",
                     userId: clientData._id||'',
                 }
            }

            // Check if the client is already linked to any company
            const company = await Company.findOne({
                clients: existingClient._id,
            })

            if (company) {
                console.log("Client is already linked to the company.")
                return {
                    success: false,
                    message: "Client is already linked to the company.",
                    userId,
                }
            }

            console.log("Client is not linked to any company.")

            // Add client to the company's clients array
            console.log(clientData.companyRefId)

            const companyToUpdate = await Company.findOne({
                companyRefId: clientData.companyRefId,
            })
            console.log(companyToUpdate)

            if (companyToUpdate) {
                // Check if the clients array is undefined and initialize it if necessary
                if (!companyToUpdate.clients) {
                    companyToUpdate.clients = [] // Initialize to an empty array
                }
                companyToUpdate.clients.push(
                    existingClient._id as Types.ObjectId
                )
                await companyToUpdate.save()
                console.log("Client ID added to the company's clients array.")

                return {
                    success: true,
                    userId,
                    message:
                        "Client added successfully and linked to the company.",
                }
            } else {
                console.error("Company not found for client reference.0")
                return {
                    success: false,
                    message: "Company not found for client reference.0",
                    userId,
                }
            }
        }

       if (clientData._id !== "") {
           await Client.findByIdAndUpdate(clientData._id, {
               $set: {
                   companyName: clientData.companyName,
                   address: {
                       addressLine1: clientData.address.addressLine1,
                       addressLine2: clientData.address.addressLine2,
                       city: clientData.address.city,
                       state: clientData.address.state,
                       postalCode: clientData.address.postalCode,
                   },
                   contactPerson: clientData.contactPerson,
                   contactNumber: clientData.contactNumber,
               },
           })

           return {
               success: true,
               message: "Client data has been updated successfully.",
               userId: clientData._id||'',
           }
       }

        // If the client does not exist, create a new client and link to the company
        const { _id, ...clientDataWithoutId } = clientData
        const newClient = new Client(clientDataWithoutId)
        await newClient.save()
        console.log("Client saved to database:", newClient)
        userId = (newClient._id as Types.ObjectId).toString()
        // Link new client to the company's clients array
        const company = await Company.findOne({
            companyRefId: clientData.companyRefId,
        })
        if (company) {
            // Check if the clients array is undefined and initialize it if necessary
            if (!company.clients) {
                company.clients = [] // Initialize to an empty array
            }
            company.clients.push(newClient._id as Types.ObjectId)
            await company.save()
            console.log("Client ID added to the company's clients array.")
            return {
                success: true,
                userId,
                message: "Client added successfully and linked to the company.",
            }
        } else {
            console.error("Company not found for client reference.1")
            return {
                success: false,
                message: "Company not found for client reference.",
                userId,
            }
        }
    } catch (error) {
        console.error("Error saving client to database:", error)
        throw new Error("Failed to save client to database")
    }
}
export const savePickupToDB = async (
    pickupData: IClient
): Promise<IClientResult> => {
    try {
        console.log(pickupData)

        let pickupId: string

        // Check if a pickup with the same company name and address exists
        const existingPickup = await Pickup.findOne({
            companyName: pickupData.companyName,
            address: pickupData.address,
        })

        // If the pickup already exists
        if (existingPickup) {
            // Ensure _id is treated as an ObjectId and convert to string
            pickupId = (existingPickup._id as Types.ObjectId).toString()

            console.log(
                "Pickup with the same company name and address already exists:",
                existingPickup
            )
             if (pickupData._id !== "") {
                 return {
                     success: false,
                     message: "Pickup Data is already Available.",
                     userId: pickupData._id || "",
                 }
             }

            // Check if the pickup is already linked to any company
            const company = await Company.findOne({
                pickups: existingPickup._id,
            })

            if (company) {
                console.log("Pickup is already linked to the company.")
                return {
                    success: false,
                    message: "Pickup is already linked to the company.",
                    userId: pickupId,
                }
            }

            console.log("Pickup is not linked to any company.")

            // Add pickup to the company's pickups array
            console.log(pickupData.companyRefId)

            const companyToUpdate = await Company.findOne({
                companyRefId: pickupData.companyRefId,
            })
            console.log(companyToUpdate)

            if (companyToUpdate) {
                // Check if the pickups array is undefined and initialize it if necessary
                if (!companyToUpdate.pickups) {
                    companyToUpdate.pickups = [] // Initialize to an empty array
                }
                companyToUpdate.pickups.push(
                    existingPickup._id as Types.ObjectId
                )
                await companyToUpdate.save()
                console.log("Pickup ID added to the company's pickups array.")

                return {
                    success: true,
                    userId: pickupId,
                    message:
                        "Pickup added successfully and linked to the company.",
                }
            } else {
                console.error("Company not found for pickup reference.")
                return {
                    success: false,
                    message: "Company not found for pickup reference.",
                    userId: pickupId,
                }
            }
        }

         if (pickupData._id !== "") {
             await Pickup.findByIdAndUpdate(pickupData._id, {
                 $set: {
                     companyName: pickupData.companyName,
                     address: {
                         addressLine1: pickupData.address.addressLine1,
                         addressLine2: pickupData.address.addressLine2,
                         city: pickupData.address.city,
                         state: pickupData.address.state,
                         postalCode: pickupData.address.postalCode,
                     },
                     contactPerson: pickupData.contactPerson,
                     contactNumber: pickupData.contactNumber,
                 },
             })

             return {
                 success: true,
                 message: "Pickup data has been updated successfully.",
                 userId: pickupData._id || "",
             }
         }

        // If the pickup does not exist, create a new pickup and link to the company
         const { _id, ...clientDataWithoutId } = pickupData
        const newPickup = new Pickup(clientDataWithoutId)
        await newPickup.save()
        console.log("Pickup saved to database:", newPickup)
        pickupId = (newPickup._id as Types.ObjectId).toString()
        // Link new pickup to the company's pickups array
        const company = await Company.findOne({
            companyRefId: pickupData.companyRefId,
        })
        if (company) {
            // Check if the pickups array is undefined and initialize it if necessary
            if (!company.pickups) {
                company.pickups = [] // Initialize to an empty array
            }
            company.pickups.push(newPickup._id as Types.ObjectId)
            await company.save()
            console.log("Pickup ID added to the company's pickups array.")
            return {
                success: true,
                userId: pickupId,
                message: "Pickup added successfully and linked to the company.",
            }
        } else {
            console.error("Company not found for pickup reference.")
            return {
                success: false,
                message: "Company not found for pickup reference.",
                userId: pickupId,
            }
        }
    } catch (error) {
        console.error("Error saving pickup to database:", error)
        throw new Error("Failed to save pickup to database")
    }
}

export const fetchGetAllPickUps = async (
    id: string
): Promise<{ success: boolean; addresses: IClient[]; message: string }> => {
    try {
        console.log("Fetching pickups for company ID:", id)

        // Find the company by ID
        const company = await Company.findById(id)

        if (!company) {
            console.error("Company not found for pickup reference.")
            return {
                success: false,
                message: "Company not found for pickup reference.",
                addresses: [],
            }
        }

        // Ensure the pickups array exists
        if (!company.pickups || company.pickups.length === 0) {
            console.log("No pickups linked to this company.")
            return {
                success: true,
                message: "No pickups linked to this company.",
                addresses: [],
            }
        }

        console.log("Fetching pickup details for IDs:", company.pickups)

        // Fetch pickup details from the Pickup collection
        const pickups: IClient[] = await Pickup.find({
            _id: { $in: company.pickups },
            isActive: { $ne: false },
        })

        console.log("Fetched pickup details:", pickups)

        return {
            success: true,
            message: "Pickups fetched successfully.",
            addresses: pickups, // Returning the array of pickup details
        }
    } catch (error) {
        console.error("Error fetching pickups:", error)
        throw new Error("Failed to fetch pickups from the database")
    }
}
export const fetchGetAllClients = async (
    id: string
): Promise<{ success: boolean; addresses: IClient[]; message: string }> => {
    try {
        console.log("Fetching pickups for company ID:", id)

        // Find the company by ID
        const company = await Company.findById(id)

        if (!company) {
            console.error("Company not found for pickup reference.")
            return {
                success: false,
                message: "Company not found for pickup reference.",
                addresses: [],
            }
        }

        // Ensure the pickups array exists
        if (!company.clients || company.clients.length === 0) {
            console.log("No clients linked to this company.")
            return {
                success: true,
                message: "No clients linked to this company.",
                addresses: [],
            }
        }

        console.log("Fetching clients details for IDs:", company.clients)

        // Fetch pickup details from the Pickup collection
        const clients: IClient[] = await Client.find({
            _id: { $in: company.clients },
            isActive: { $ne: false },
        })

        console.log("Fetched client details:", clients)

        return {
            success: true,
            message: "Pickups fetched successfully.",
            addresses: clients, // Returning the array of pickup details
        }
    } catch (error) {
        console.error("Error fetching pickups:", error)
        throw new Error("Failed to fetch pickups from the database")
    }
}
export const getShipperById = async (id: string): Promise<ICompany | null> => {
    try {
        // Log the ID being queried
        console.log("Fetching shipper with ID:", id)

        // Query the database for the user with the given ID
        let user = await Company.findById(id).exec() // Adding exec() for better readability with Promises
        if (!user) {
            user = await Company.findOne({ companyRefId: id }).exec()
        }

        // Log the result of the query
        console.log("User found:", user)

        // Return the user data if found, otherwise null
        return user ? (user as ICompany) : null
    } catch (error) {
        console.error("Error fetching user:", error)
        throw new Error("Failed to fetch user data")
    }
}
export const fetchGetSinglePickUp = async (
    pickupId: string
): Promise<{ success: boolean; address: IClient | null; message: string }> => {
    try {
        console.log("Fetching pickup details for ID:", pickupId)

        // Fetch the pickup details from the Pickup collection using the provided ID
        const pickup: IClient | null = await Pickup.findById(pickupId)

        if (!pickup) {
            console.error("Pickup not found for the given ID.")
            return {
                success: false,
                message: "Pickup not found for the given ID.",
                address: null,
            }
        }

        console.log("Fetched pickup details:", pickup)

        return {
            success: true,
            message: "Pickup fetched successfully.",
            address: pickup, // Returning the single pickup detail
        }
    } catch (error) {
        console.error("Error fetching pickup:", error)
        return {
            success: false,
            message: "Failed to fetch pickup from the database.",
            address: null,
        }
    }
}
export const fetchGetSingleClient = async (
    clientId: string
): Promise<{ success: boolean; address: IClient | null; message: string }> => {
    try {
        console.log("Fetching client details for ID:", clientId)

        // Fetch the client details from the Client collection using the provided ID
        const client: IClient | null = await Client.findById(clientId)

        if (!client) {
            console.error("Client not found for the given ID.")
            return {
                success: false,
                message: "Client not found for the given ID.",
                address: null,
            }
        }

        console.log("Fetched client details:", client)

        return {
            success: true,
            message: "Client fetched successfully.",
            address: client, // Returning the single client detail
        }
    } catch (error) {
        console.error("Error fetching client:", error)
        return {
            success: false,
            message: "Failed to fetch client from the database.",
            address: null,
        }
    }
}


export const deleteUserResourcebyid = async (
    id: string,
    target: string
): Promise<{ success: boolean; message: string }> => {
    try {
        console.log("Attempting to update isActive flag for resource:", {
            id,
            target,
        })

        // Validate inputs
        if (!id) {
            return {
                success: false,
                message: "Resource ID is required for deletion.",
            }
        }
        if (!target || (target !== "Clients" && target !== "Pickups")) {
            return {
                success: false,
                message:
                    "Invalid or missing target resource type. Must be 'Clients' or 'Pickups'.",
            }
        }

        // Determine which resource to update
        let updateResult
        if (target === "Clients") {
            updateResult = await Client.findByIdAndUpdate(id, {
                $set: { isActive: false },
            })
        } else if (target === "Pickups") {
            updateResult = await Pickup.findByIdAndUpdate(id, {
                $set: { isActive: false },
            })
        }

        // Check if the resource was successfully updated
        if (!updateResult) {
            return {
                success: false,
                message: `No ${target.toLowerCase()} found with the provided ID.`,
            }
        }

        return {
            success: true,
            message: `The ${target.toLowerCase()} was successfully deactivated.`,
        }
    } catch (error) {
        console.error("Error in updating resource:", error)
        return {
            success: false,
            message: `An error occurred while updating the ${target.toLowerCase()} resource.`,
        }
    }
}
