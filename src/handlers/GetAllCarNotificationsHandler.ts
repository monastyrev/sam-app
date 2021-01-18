import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from "aws-lambda";
import {getDocumentClient} from "../common/DocumentClient";

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const params = {
        TableName: 'CARS',
        Key: {id: event.pathParameters.id},
        ProjectionExpression: 'notifications'
    };
    try {
        const result = await getDocumentClient().get(params).promise();
        console.log('Response', result);
        return {
            statusCode: result.$response.httpResponse.statusCode,
            body: JSON.stringify(result.Item.notifications)
        }
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `Failed to get car notifications by id: ${event.pathParameters.id}`
            }),
        }
    }
}