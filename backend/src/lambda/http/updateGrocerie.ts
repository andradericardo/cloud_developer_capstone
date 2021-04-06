import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateGrocerieRequest } from '../../requests/UpdateGrocerieRequest'
import { getUserId } from '../utils'
import { updateGrocerie } from '../../businessLogic/groceries'
import { createLogger } from '../../utils/logger'


const logger = createLogger('updateGroceries')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const grocerieId = event.pathParameters.grocerieId
    const updatedGrocerie: UpdateGrocerieRequest = JSON.parse(event.body)

    // TODO: Update a Grocerie item with the provided id using values in the "updatedGrocerie" object
    logger.info('Running updateGroceries.', { event })

    const userId = getUserId(event)
    await updateGrocerie(userId, grocerieId, updatedGrocerie)

    // message
    const statusCode = 200
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
