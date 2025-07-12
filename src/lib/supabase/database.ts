import { supabase } from './client'

// Generic database operations

// Fetch all records from a table
export async function fetchAll<T>(tableName: string): Promise<T[]> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
  
  if (error) {
    console.error('Error fetching data:', error)
    throw error
  }
  
  return data || []
}

// Fetch a single record by ID
export async function fetchById<T>(tableName: string, id: string | number): Promise<T | null> {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching record:', error)
    throw error
  }
  
  return data
}

// Insert a new record
export async function insertRecord<T>(tableName: string, record: Partial<T>): Promise<T> {
  const { data, error } = await supabase
    .from(tableName)
    .insert(record)
    .select()
    .single()
  
  if (error) {
    console.error('Error inserting record:', error)
    throw error
  }
  
  return data
}

// Update a record by ID
export async function updateRecord<T>(
  tableName: string, 
  id: string | number, 
  updates: Partial<T>
): Promise<T> {
  const { data, error } = await supabase
    .from(tableName)
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) {
    console.error('Error updating record:', error)
    throw error
  }
  
  return data
}

// Delete a record by ID
export async function deleteRecord(tableName: string, id: string | number): Promise<void> {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', id)
  
  if (error) {
    console.error('Error deleting record:', error)
    throw error
  }
} 