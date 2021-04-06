/**
 * Fields in a request to update a single Grocerie item.
 */
export interface UpdateGrocerieRequest {
  name: string
  dueDate: string
  done: boolean
}