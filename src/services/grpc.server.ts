// import { ServerUnaryCall, sendUnaryData } from "@grpc/grpc-js"
import path from "path"
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
})

server.bindAsync(
    "0.0.0.0:3003",
    grpc.ServerCredentials.createInsecure(),
    () => {
        console.log("Auth Service gRPC server running at http://0.0.0.0:3003")
        server.start()
    }
)
