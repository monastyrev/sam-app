import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from "aws-lambda";
import {getDocumentClient} from "../common/DocumentClient";

export const handler: APIGatewayProxyHandler = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
    const params = {
        TableName: 'CARS'
    };
    try {
        const result = await getDocumentClient().scan(params).promise();
        console.log('Response', result);
        return {
            statusCode: result.$response.httpResponse.statusCode,
            body: JSON.stringify(result.Items)
        }
    } catch (error) {
        console.log(error)
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: `Failed to get all cars`
            }),
        }
    }
}
