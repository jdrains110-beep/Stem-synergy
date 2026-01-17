import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// Types for database
export interface Blueprint {
  id: string
  name: string
  description: string
  rooms: number
  square_feet: number
  style: string
  svg_data: string
  source: 'description' | 'image'
  created_at: string
  updated_at: string
  user_id: string
  shared: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  user_id: string
}

export interface BlueprintCollaboration {
  id: string
  blueprint_id: string
  user_id: string
  role: 'owner' | 'editor' | 'viewer'
  created_at: string
}

// Blueprint operations
export async function saveBlueprint(blueprint: Omit<Blueprint, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('blueprints')
    .insert([{
      ...blueprint,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single()

  if (error) throw error
  return data as Blueprint
}

export async function getBlueprints(userId: string) {
  const { data, error } = await supabase
    .from('blueprints')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as Blueprint[]
}

export async function getBlueprint(id: string) {
  const { data, error } = await supabase
    .from('blueprints')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Blueprint
}

export async function updateBlueprint(id: string, updates: Partial<Blueprint>) {
  const { data, error } = await supabase
    .from('blueprints')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Blueprint
}

export async function deleteBlueprint(id: string) {
  const { error } = await supabase
    .from('blueprints')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function shareBlueprint(id: string) {
  return updateBlueprint(id, { shared: true })
}

// Project operations
export async function saveProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      ...project,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single()

  if (error) throw error
  return data as Project
}

export async function getProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data || []) as Project[]
}

export async function deleteProject(id: string) {
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) throw error
}

// Collaboration operations
export async function addCollaborator(
  blueprintId: string,
  userId: string,
  role: 'owner' | 'editor' | 'viewer'
) {
  const { data, error } = await supabase
    .from('blueprint_collaborations')
    .insert([{ blueprint_id: blueprintId, user_id: userId, role }])
    .select()
    .single()

  if (error) throw error
  return data as BlueprintCollaboration
}

export async function getCollaborators(blueprintId: string) {
  const { data, error } = await supabase
    .from('blueprint_collaborations')
    .select('*')
    .eq('blueprint_id', blueprintId)

  if (error) throw error
  return (data || []) as BlueprintCollaboration[]
}
