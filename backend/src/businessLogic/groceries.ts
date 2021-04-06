import 'source-map-support/register'

import * as uuid from 'uuid'

import { GroceriesAccess } from '../dataLayer/groceriesAccess'
import { GroceriesStorage } from '../dataLayer/groceriesStorage'
import { GrocerieItem } from '../models/GrocerieItem'
import { GrocerieUpdate } from '../models/GrocerieUpdate'
import { CreateGrocerieRequest } from '../requests/CreateGrocerieRequest'
import { UpdateGrocerieRequest } from '../requests/UpdateGrocerieRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('groceries')

const groceriesAccess = new GroceriesAccess()
const groceriesStorage = new GroceriesStorage()


export async function getGroceries(userId: string): Promise<GrocerieItem[]> {
    logger.info(`Get all groceries for user ${userId}.`, { userId })
    return await groceriesAccess.getGroceries(userId)
}


export async function createGrocerie(userId: string, createGrocerieRequest: CreateGrocerieRequest): Promise<GrocerieItem> {
    const grocerieId = uuid.v4()
    const newItem: GrocerieItem = {
        userId,
        grocerieId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmentUrl: null,
        ...createGrocerieRequest
    }
    logger.info(`Create new grocerie item with id ${grocerieId} for user ${userId}.`, { userId, grocerieId, grocerieItem: newItem })
    await groceriesAccess.createGrocerie(newItem)
    return newItem
}


export async function updateGrocerie(userId: string, grocerieId: string, updateGrocerieRequest: UpdateGrocerieRequest) {
    logger.info(`Update grocerie with id ${grocerieId} for user ${userId}.`, { userId, grocerieId, grocerieUpdate: updateGrocerieRequest })
    const item = await groceriesAccess.getGrocerie(grocerieId)

    if (!item)
        throw new Error(`Item with id ${grocerieId} not found.`)

    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to update grocerie with id ${grocerieId}.`)
        throw new Error('User not authorized.')
    }
    groceriesAccess.updateGrocerie(grocerieId, updateGrocerieRequest as GrocerieUpdate)
}


export async function deleteGrocerie(userId: string, grocerieId: string) {
    logger.info(`Delete grocerie with id ${grocerieId} for user ${userId}.`, { userId, grocerieId })
    const item = await groceriesAccess.getGrocerie(grocerieId)
    if (!item)
        throw new Error('Item not found')

    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to delete grocerie ${grocerieId}`)
        throw new Error('User not authorized.')
    }
    groceriesAccess.deleteGrocerie(grocerieId)
}


export async function updateAttachmentUrl(userId: string, grocerieId: string, attachmentId: string) {
    logger.info(`Get URL for attachment with id ${attachmentId}.`)
    const attachmentUrl = await groceriesStorage.getAttachmentUrl(attachmentId)
    logger.info(`Update grocerie with id ${grocerieId} with attachment URL with id ${attachmentUrl}.`, { userId, grocerieId })
    const item = await groceriesAccess.getGrocerie(grocerieId)

    if (!item)
        throw new Error('Item not found')

    if (item.userId !== userId) {
        logger.error(`User ${userId} does not have permission to update grocerie ${grocerieId}.`)
        throw new Error('User not authorized.')
    }
    await groceriesAccess.updateUrl(grocerieId, attachmentUrl)
}


export async function generateUploadUrl(attachmentId: string): Promise<string> {
    logger.info(`Generate upload URL for attachment with id ${attachmentId}.`)
    const uploadUrl = await groceriesStorage.getSignedUrl(attachmentId)
    return uploadUrl
}