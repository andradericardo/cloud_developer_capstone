import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { getGroceries } from '../../businessLogic/groceries'



const logger = createLogger('getGroceries')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Get all Grocerie items for a current user
    logger.info('Running getGroceries.', { event })

    const userId = getUserId(event)
    const items = await getGroceries(userId)

    // message
    const statusCode = 200
    const headers = {
      'Access-Control-Allow-Origin': '*',
    }
    const body = JSON.stringify({items})

    const message = {
      statusCode: statusCode,
      headers: headers,
      body: body
    }

    return message
}
