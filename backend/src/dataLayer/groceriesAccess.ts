import 'source-map-support/register'

// AWS modules
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

// Logger
import { createLogger } from '../utils/logger'

// Database Models
import { GrocerieItem } from '../models/GrocerieItem'
import { GrocerieUpdate } from '../models/GrocerieUpdate'



const XAWS = AWSXRay.captureAWS(AWS)// ORM query object

const logger = createLogger('groceriesAccess') // Logger object



// DynamoDB ORM object
export class GroceriesAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly groceriesTable = process.env.GROCERIES_TABLE,
        private readonly groceriesByUserIndex = process.env.GROCERIES_BY_USER_INDEX
    ) {}

  
    async grocerieExists(grocerieId: string): Promise<boolean> {
        logger.info(`Check if grocerie ${grocerieId} exists.`)
        const item = await this.getGrocerie(grocerieId)
        return !!item
    }


    async getGroceries(userId: string): Promise<GrocerieItem[]> {
        logger.info(`Get all groceries for user ${userId} in ${this.groceriesTable}.`)

        const result = await this.docClient.query({
        TableName: this.groceriesTable,
        IndexName: this.groceriesByUserIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {':userId': userId}
        }).promise()

        const items = result.Items
        logger.info(`Found ${items.length} grocerie items in ${this.groceriesTable} for user ${userId}.`)
        return items as GrocerieItem[]
    }


    async getGrocerie(grocerieId: string): Promise<GrocerieItem> {
        logger.info(`Get grocerie item ${grocerieId} from ${this.groceriesTable}.`)

        const result = await this.docClient.get({
        TableName: this.groceriesTable,
        Key: {grocerieId}
        }).promise()

        const item = result.Item
        return item as GrocerieItem
    }


    async createGrocerie(grocerieItem: GrocerieItem) {
        logger.info(`Insert grocerie item ${grocerieItem.grocerieId} into ${this.groceriesTable}.`)

        await this.docClient.put({
        TableName: this.groceriesTable,
        Item: grocerieItem,
        }).promise()
    }


    async updateGrocerie(grocerieId: string, grocerieUpdate: GrocerieUpdate) {
        logger.info(`Update grocerie item ${grocerieId} in ${this.groceriesTable}.`)

        await this.docClient.update({
        TableName: this.groceriesTable,
        Key: {grocerieId},
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {"#name": "name"},
        ExpressionAttributeValues: {
            ":name": grocerieUpdate.name,
            ":dueDate": grocerieUpdate.dueDate,
            ":done": grocerieUpdate.done
        }
        }).promise()   
    }


    async deleteGrocerie(grocerieId: string) {
        logger.info(`Delete grocerie item ${grocerieId} from ${this.groceriesTable}.`)

        await this.docClient.delete({
        TableName: this.groceriesTable,
        Key: {grocerieId}
        }).promise()    
    }


    async updateUrl(grocerieId: string, attachmentUrl: string) {
        logger.info(`Update URL of grocerie item ${grocerieId} in ${this.groceriesTable}.`)

        await this.docClient.update({
        TableName: this.groceriesTable,
        Key: {grocerieId},
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {':attachmentUrl': attachmentUrl}
        }).promise()
    }

}