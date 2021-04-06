import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateGrocerieRequest } from '../../requests/CreateGrocerieRequest'

import { getUserId } from '../utils'
import { createGrocerie } from '../../businessLogic/groceries'
import { createLogger } from '../../utils/logger'


const logger = createLogger('createGrocerie')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newGrocerie: CreateGrocerieRequest = JSON.parse(event.body)

    // TODO: Implement creating a new Grocerie item
    logger.info('Running createGrocerie.', { event })

    const userId = getUserId(event)
    const newItem = await createGrocerie(userId, newGrocerie)
    
    // message
    const statusCode = 201
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    }
    const body = JSON.stringify({item: newItem})

    const message = {
      statusCode: statusCode,
      headers: headers,
      body: body
    }

    return message
}
