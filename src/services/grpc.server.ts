// import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js"
import { sendUnaryData, ServerUnaryCall } from "@grpc/grpc-js"
import path from "path"
import { IClient, IClientResult, ICompany } from "../database/shipper.model"
import { addNewClient, addNewPickup, deleteUserResource, fetchClientById, fetchPickUpById, fetchShipperById, getAllClients, GetAllPickUps,  } from "./shipper.service"
const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")

// Define paths
const PROTO_PATH = path.join(__dirname, "../../../protos/shipper.proto")
console.log("Resolved proto file path:", PROTO_PATH)

// Load the .proto file with type options
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
})


// Create a typed object from the package definition
const carrierPackage = grpc.loadPackageDefinition(packageDefinition)
    .shipper as any

// Create the gRPC server
const server = new grpc.Server()

server.addService(carrierPackage.ShipperService.service, {
    RegisterUser: {},
    RegisterNewClient: async (
        call: ServerUnaryCall<
            {
                client: IClient
            },
            {
                success: boolean
                data: IClientResult | null
                message: string
            }
        >,
        callback: sendUnaryData<{
            success: boolean
            data: string | null
            message: string
        }>
    ) => {
        try {
            const client: any = call.request
            console.log("entry grpc", client)

            if (!client) {
                callback(null, {
                    success: false,
                    data: null,
                    message: "No Data Available",
                })
                return
            }

            const data: IClientResult = await addNewClient(client)

            callback(null, {
                success: data.success,
                data: data.userId,
                message: data.message,
            })
        } catch (error) {
            console.error("Error in GetUser:", error)
            callback(null, {
                success: false,
                data: null,
                message: "Failed Add Client",
            })
        }
    },
    RegisterNewPickup: async (
        call: ServerUnaryCall<
            {
                address: IClient
            },
            {
                success: boolean
                data: IClientResult | null
                message: string
            }
        >,
        callback: sendUnaryData<{
            success: boolean
            data: string | null
            message: string
        }>
    ) => {
        try {
            const address: any = call.request
            console.log("entry grpc", address)

            if (!address) {
                callback(null, {
                    success: false,
                    data: null,
                    message: "No Data Available",
                })
                return
            }

            const data: IClientResult = await addNewPickup(address)

            callback(null, {
                success: data.success,
                data: data.userId,
                message: data.message,
            })
        } catch (error) {
            console.error("Error in GetUser:", error)
            callback(null, {
                success: false,
                data: null,
                message: "Failed Add Client",
            })
        }
    },

    GetAllShipperPickUps: async (
        call: ServerUnaryCall<
            { id: string },
            { success: boolean; addresses: IClient[] | null; message: string }
        >,
        callback: sendUnaryData<{
            success: boolean
            addresses: IClient[] | null
            message: string
        }>
    ) => {
        try {
            const id = call.request.id

            const result = await GetAllPickUps(id)
            const addresses = result.addresses

            console.log("received something", addresses)

            if (!addresses || addresses.length === 0) {
                callback(null, {
                    success: false,
                    addresses: null,
                    message: "No pickups found",
                })
                return
            }

            callback(null, {
                success: true,
                addresses,
                message: "Pickups fetched successfully",
            })
        } catch (error) {
            console.error("Error in GetAllPickups:", error)
            callback(null, {
                success: false,
                addresses: null,
                message: "Failed to fetch pickups",
            })
        }
    },
    GetAllShipperClients: async (
        call: ServerUnaryCall<
            { id: string },
            { success: boolean; addresses: IClient[] | null; message: string }
        >,
        callback: sendUnaryData<{
            success: boolean
            addresses: IClient[] | null
            message: string
        }>
    ) => {
        try {
            const id = call.request.id
            console.log("the id os ", id)

            const result = await getAllClients(id)
            const addresses = result.addresses

            console.log("received something", addresses)

            console.log("received something", addresses)

            if (!addresses || addresses.length === 0) {
                callback(null, {
                    success: false,
                    addresses: null,
                    message: "No clients found",
                })
                return
            }

            callback(null, {
                success: true,
                addresses,
                message: "Clients fetched successfully",
            })
        } catch (error) {
            console.error("Error in GetAllClients:", error)
            callback(null, {
                success: false,
                addresses: null,
                message: "Failed to fetch clients",
            })
        }
    },
    GetShipperInfo: async (
        call: ServerUnaryCall<
            {
                companyRefId: string
            },
            {
                user: ICompany | null
            }
        >,
        callback: sendUnaryData<{
            success: boolean
            user: ICompany | null
            message: string
        }>
    ) => {
        try {
            const id = call.request.companyRefId
            console.log("the incomimg id is ", id)

            if (!id) {
                callback(null, {
                    success: false,
                    user: null,
                    message: "User ID is required",
                })
                return
            }

            const user = await fetchShipperById(id)
            console.log("the data is ", user)

            if (!user) {
                callback(null, {
                    success: false,
                    user: null,
                    message: "User not found",
                })
                return
            }

            callback(null, {
                success: true,
                user,
                message: "User fetched successfully",
            })
        } catch (error) {
            console.error("Error in GetUser:", error)
            callback(null, {
                success: false,
                user: null,
                message: "Failed to fetch user",
            })
        }
    },
    GetClientInfo: async (
        call: ServerUnaryCall<
            {
                id: string
            },
            {
                addresses: IClient | null
            }
        >,
        callback: sendUnaryData<{
            success: boolean
            addresses: IClient | null
            message: string
        }>
    ) => {
        try {
            const id = call.request.id
            console.log("The incoming ID is:", id)

            if (!id) {
                callback(null, {
                    success: false,
                    addresses: null,
                    message: "Company ID is required.",
                })
                return
            }

            const clientInfo = await fetchClientById(id)
            console.log("The data is:", clientInfo)

            if (!clientInfo.success || !clientInfo.address) {
                callback(null, {
                    success: false,
                    addresses: null,
                    message: clientInfo.message || "Client not found.",
                })
                return
            }

            callback(null, {
                success: true,
                addresses: clientInfo.address,
                message: "Client fetched successfully.",
            })
        } catch (error) {
            console.error("Error in GetClientInfo:", error)
            callback(null, {
                success: false,
                addresses: null,
                message: "Failed to fetch client information.",
            })
        }
    },
    GetPickupInfo: async (
        call: ServerUnaryCall<
            {
                id: string
            },
            {
                addresses: IClient | null
            }
        >,
        callback: sendUnaryData<{
            success: boolean
            addresses: IClient | null
            message: string
        }>
    ) => {
        try {
            const id = call.request.id
            console.log("The incoming ID is:", id)

            if (!id) {
                callback(null, {
                    success: false,
                    addresses: null,
                    message: "Company ID is required.",
                })
                return
            }

            const pickupInfo = await fetchPickUpById(id)
            console.log("The data is:", pickupInfo)

            if (!pickupInfo.success || !pickupInfo.address) {
                callback(null, {
                    success: false,
                    addresses: null,
                    message: pickupInfo.message || "Pickup not found.",
                })
                return
            }

            callback(null, {
                success: true,
                addresses: pickupInfo.address,
                message: "Pickup fetched successfully.",
            })
        } catch (error) {
            console.error("Error in GetPickupInfo:", error)
            callback(null, {
                success: false,
                addresses: null,
                message: "Failed to fetch pickup information.",
            })
        }
    },
   DeleteUserResource: async (
    call: ServerUnaryCall<
        {
            id: string;
            target: string;
        },
        {
            success: boolean;
            message: string;
        }
    >,
    callback: sendUnaryData<{
        success: boolean;
        message: string;
    }>
) => {
    try {
        const { id, target } = call.request;

        console.log("Incoming request for deletion:", { id, target });

        // Validate request data
        if (!id) {
            callback(null, {
                success: false,
                message: "Resource ID is required to delete a shipper resource.",
            });
            return;
        }

        if (!target) {
            callback(null, {
                success: false,
                message: "Target resource type (e.g., client, pickup) is required.",
            });
            return;
        }

        // Fetch and delete the specified resource
        const resourceDeletion = await deleteUserResource(id,target); // Replace with the appropriate deletion function for the target
        console.log("Deletion result for resource:", resourceDeletion);

        // Handle unsuccessful deletion
        if (!resourceDeletion.success) {
            callback(null, {
                success: false,
                message: resourceDeletion.message,
            });
            return;
        }

        // Successfully deleted the resource
        callback(null, {
            success: true,
            message: `The Resource has been successfully deleted.`,
        });
    } catch (error) {
        console.error("Error in DeleteUserResource:", error);

        callback(null, {
            success: false,
            message: "An error occurred while attempting to delete the shipper resource.",
        });
    }
}

})

server.bindAsync(
    "0.0.0.0:3003",
    grpc.ServerCredentials.createInsecure(),
    () => {
        console.log("Auth Service gRPC server running at http://0.0.0.0:3003")
        server.start()
    }
)


  