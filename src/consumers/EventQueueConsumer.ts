import {SQSEvent, SQSHandler} from "aws-lambda";
import {getDocumentClient} from "../common/DocumentClient";

const emptyList: any[] = []

enum EventType {
    MACHINE = 'MACHINE',
    NOTIFICATION = 'NOTIFICATION'
}

interface Event {
    event: EventType
    machineId: string
    machineName?: string
    notificationType?: string
    notificationMessage?: string
    ts: number
}

export const handler: SQSHandler = async (
    event: SQSEvent
): Promise<void> => {
    for (const record of event.Records) {
        try {
            const data: Event = JSON.parse(record.body);
            console.log('Event: ', data);
            switch (data.event) {
                case EventType.MACHINE:
                    await updateMachine(data);
                    break;
                case EventType.NOTIFICATION:
                    await updateNotification(data);
                    break;
            }
        } catch (error) {
            console.log(error);
        }
    }
}

async function updateMachine(event: Event) {
    const params = {
        TableName: 'CARS',
        Key: {
            id: event.machineId,
        },
        Item: {
            id: event.machineId,
            machineName: event.machineName,
            notifications: emptyList
        }
    };
    return getDocumentClient()
        .put(params)
        .on('complete', (output) => console.log('Response: ', output.httpResponse.statusCode))
        .promise();
}

async function updateNotification(event: Event) {
    const params = {
        TableName: 'CARS',
        Key: {
            id: event.machineId,
        },
        UpdateExpression: 'SET notifications = list_append(notifications, :notification)',
        ExpressionAttributeValues: {
            ':notification': [{
                notificationType: event.notificationType,
                notificationMessage: event.notificationMessage
            }]
        }
    };
    return getDocumentClient()
        .update(params)
        .on('complete', (output) => console.log('Response: ', output.httpResponse.statusCode))
        .promise();
}