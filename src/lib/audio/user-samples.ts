// User Sample Upload & Management
// Allows users to upload their own samples (Splice, Serum, etc.)

import { supabase } from '@/lib/supabase/client'

export interface UserSample {
  id: string
  user_id: string
  name: string
  file_path: string
  file_size: number
  duration?: number
  created_at: string
}

const BUCKET_NAME = 'user-samples'

/**
 * Upload a user sample to Supabase Storage
 */
export async function uploadUserSample(
  file: File,
  userId: string
): Promise<{ success: boolean; data?: UserSample; error?: string }> {
  try {

    // Validate file type
    const validTypes = ['audio/wav', 'audio/wave', 'audio/x-wav', 'audio/mpeg', 'audio/mp3']
    if (!validTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Please upload WAV or MP3 files only.'
      }
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'File too large. Maximum size is 50MB.'
      }
    }

    // Generate unique file path
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${userId}/${timestamp}_${sanitizedName}`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return {
        success: false,
        error: `Upload failed: ${uploadError.message}`
      }
    }

    // Save metadata to database
    const { data: sampleData, error: dbError } = await supabase
      .from('user_samples')
      .insert({
        user_id: userId,
        name: sanitizedName,
        file_path: filePath,
        file_size: file.size
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Clean up uploaded file if database insert fails
      await supabase.storage.from(BUCKET_NAME).remove([filePath])
      return {
        success: false,
        error: `Failed to save sample metadata: ${dbError.message}`
      }
    }

    console.log('✅ User sample uploaded:', sampleData)
    return {
      success: true,
      data: sampleData as UserSample
    }
  } catch (error: any) {
    console.error('❌ Error uploading user sample:', error)
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    }
  }
}

/**
 * Get all user samples for a specific user
 */
export async function getUserSamples(userId: string): Promise<UserSample[]> {
  try {

    const { data, error } = await supabase
      .from('user_samples')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user samples:', error)
      return []
    }

    return data as UserSample[]
  } catch (error) {
    console.error('❌ Error getting user samples:', error)
    return []
  }
}

/**
 * Get public URL for a user sample
 */
export async function getUserSampleUrl(filePath: string): Promise<string | null> {
  try {

    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('❌ Error getting sample URL:', error)
    return null
  }
}

/**
 * Delete a user sample
 */
export async function deleteUserSample(
  sampleId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {

    // Get file path from database
    const { data: sample, error: fetchError } = await supabase
      .from('user_samples')
      .select('file_path')
      .eq('id', sampleId)
      .eq('user_id', userId)
      .single()

    if (fetchError || !sample) {
      return {
        success: false,
        error: 'Sample not found'
      }
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([sample.file_path])

    if (storageError) {
      console.error('Storage delete error:', storageError)
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('user_samples')
      .delete()
      .eq('id', sampleId)
      .eq('user_id', userId)

    if (dbError) {
      return {
        success: false,
        error: `Failed to delete sample: ${dbError.message}`
      }
    }

    console.log('✅ User sample deleted:', sampleId)
    return { success: true }
  } catch (error: any) {
    console.error('❌ Error deleting user sample:', error)
    return {
      success: false,
      error: error.message || 'Unknown error occurred'
    }
  }
}

/**
 * Play a user sample using Web Audio API
 */
export async function playUserSample(
  filePath: string,
  ctx: AudioContext,
  destination: AudioNode,
  velocity: number = 100
): Promise<void> {
  try {
    const url = await getUserSampleUrl(filePath)
    if (!url) {
      throw new Error('Failed to get sample URL')
    }

    // Fetch audio file
    const response = await fetch(url)
    const arrayBuffer = await response.arrayBuffer()

    // Decode audio data
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer)

    // Create audio source
    const source = ctx.createBufferSource()
    source.buffer = audioBuffer

    // Create gain node for velocity control
    const gainNode = ctx.createGain()
    gainNode.gain.value = velocity / 127

    // Connect audio graph
    source.connect(gainNode)
    gainNode.connect(destination)

    // Play
    source.start(ctx.currentTime)

    console.log('🎵 Playing user sample:', filePath)
  } catch (error) {
    console.error('❌ Error playing user sample:', error)
    throw error
  }
}
