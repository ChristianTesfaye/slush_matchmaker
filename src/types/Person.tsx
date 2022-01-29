import { Request } from "./Request";

export interface Person {
    id?: number,
    firstName?: string,
    lastName?: string,
    organization?: string,
    email?: string,
    incomingRequests?: Request,
    outgoingRequests?: Request,
}