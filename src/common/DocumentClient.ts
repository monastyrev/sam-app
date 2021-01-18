import {DocumentClient} from "aws-sdk/clients/dynamodb";

let documentClient: DocumentClient | undefined;

export function getDocumentClient(): DocumentClient {
    if (!documentClient) {
        documentClient = new DocumentClient();
    }

    return documentClient;
}