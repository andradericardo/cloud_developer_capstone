import { apiEndpoint } from '../config'
import { Grocerie } from '../types/Grocerie';
import { CreateGrocerieRequest } from '../types/CreateGrocerieRequest';
import Axios from 'axios'
import { UpdateGrocerieRequest } from '../types/UpdateGrocerieRequest';

export async function getGroceries(idToken: string): Promise<Grocerie[]> {
  console.log('Fetching groceries')

  const response = await Axios.get(`${apiEndpoint}/groceries`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Groceries:', response.data)
  return response.data.items
}

export async function createGrocerie(
  idToken: string,
  newGrocerie: CreateGrocerieRequest
): Promise<Grocerie> {
  const response = await Axios.post(`${apiEndpoint}/groceries`,  JSON.stringify(newGrocerie), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchGrocerie(
  idToken: string,
  grocerieId: string,
  updatedGrocerie: UpdateGrocerieRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/groceries/${grocerieId}`, JSON.stringify(updatedGrocerie), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteGrocerie(
  idToken: string,
  grocerieId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/groceries/${grocerieId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  grocerieId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/groceries/${grocerieId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
