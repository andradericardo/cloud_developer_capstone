import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as uuid from 'uuid'

import { createLogger } from '../../utils/logger'
import { generateUploadUrl, updateAttachmentUrl } from '../../businessLogic/groceries'
import { getUserId } from '../utils'


const logger = createLogger('generateUploadUrl')



export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const grocerieId = event.pathParameters.grocerieId

    // TODO: Return a presigned URL to upload a file for a Grocerie item with the provided id
    logger.info('Running generateUploadUrl.', { event })

    const userId = getUserId(event)
    const attachmentId = uuid.v4()

    const uploadUrl = await generateUploadUrl(attachmentId)
    await updateAttachmentUrl(userId, grocerieId, attachmentId)

    // message
    const statusCode = 200
    const headers = {
      'Access-Control-Allow-Origin': '*',
    }
    const body = JSON.stringify({uploadUrl})

    const message = {
      statusCode: statusCode,
      headers: headers,
      body: body
    }

    return message
}
