import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import { deleteGrocerie } from '../../businessLogic/groceries'


const logger = createLogger('deleteGrocerie')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const grocerieId = event.pathParameters.grocerieId

    // TODO: Remove a Grocerie item by id
    logger.info('Running deleteGrocerie.', { event })

    const userId = getUserId(event)
    await deleteGrocerie(userId, grocerieId)

    // message
    const statusCode = 204
    const headers = {
      'Access-Control-Allow-Origin': '*',
    }
    const body = ''

    const message = {
      statusCode: statusCode,
      headers: headers,
      body: body
    }

    return message
}
