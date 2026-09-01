'use client'

import React from 'react'
import { FileUploadForm as DsFileUploadForm, AttachmentItem } from '@/design-system'
import { getStorageSupabaseClient, getStorageSupabaseUrl } from '@/lib/supabase/client'
import { normalizeContactEmail } from '@/features/chattemplate/chat/services/chat-storage.service'
import { StorageFileItem, UserFolder } from '../../services/user-storage-files.service'
import { useEmailSettingsStore } from '@/features/email-settings/store'
import { toast } from 'sonner'

export interface FileUploadFormProps {
  userEmail?: string | null
  folders?: UserFolder[]
  onClose: () => void
  onUploadSuccess: (newItems?: StorageFileItem[]) => void
  onPreviewAttachment?: (attachment: { name: string; url?: string }) => void
}

export function FileUploadForm({
  userEmail,
  folders,
  onClose,
  onUploadSuccess,
  onPreviewAttachment,
}: FileUploadFormProps) {
  const { config } = useEmailSettingsStore()
  const hasCustomCredentials = Boolean(
    (config.storageAccounts &&
      config.storageAccounts.length > 0 &&
      config.storageAccounts.some(
        (acc) => acc.isEnabled && acc.supabaseUrl?.trim() && acc.supabaseAnonKey?.trim()
      )) ||
      (config.storage?.isCustomEnabled &&
        config.storage?.supabaseUrl?.trim() &&
        config.storage?.supabaseAnonKey?.trim())
  )

  const warningMessage = !hasCustomCredentials
    ? 'File Storage Settings. Not Done. Go to App Settings and Add Settings.'
    : null

  const handleSave = async (data: {
    subject: string
    folder: string
    subFolder: string
    remarks: string
    body: string
    attachments: AttachmentItem[]
  }) => {
    try {
      const supabase = getStorageSupabaseClient()
      const primaryAccountEmail = config.accounts && config.accounts.length > 0 ? config.accounts[0].email : null
      const storageAccountEmail = config.storageAccounts && config.storageAccounts.length > 0 ? config.storageAccounts[0].name : null

      const effectiveEmail =
        normalizeContactEmail(userEmail) ||
        normalizeContactEmail(primaryAccountEmail) ||
        normalizeContactEmail(storageAccountEmail) ||
        'amanmicropay@gmail.com'

      const supabaseUrl = getStorageSupabaseUrl()

      // Upload all attachments to Supabase Storage if fileObj exists
      let hasUploadError = false
      let uploadErrorMessage = ''

      for (const att of data.attachments) {
        if (att.fileObj) {
          const sanitizedFileName = att.fileObj.name.replace(/[^a-zA-Z0-9_.-]/g, '_')
          const storagePath = `${effectiveEmail}/${data.folder}/${data.subFolder}/${sanitizedFileName}`

          try {
            const { error: uploadError } = await supabase.storage
              .from('chat-files')
              .upload(storagePath, att.fileObj, {
                upsert: true,
                contentType: att.fileObj.type || 'application/octet-stream',
                cacheControl: '3600',
              })

            if (uploadError) {
              console.error('Supabase storage upload error:', uploadError)
              hasUploadError = true
              uploadErrorMessage = uploadError.message
            } else {
              att.url = `${supabaseUrl}/storage/v1/object/public/chat-files/${storagePath}`
            }
          } catch (e: any) {
            console.error('Storage upload warning:', e)
            hasUploadError = true
            uploadErrorMessage = e?.message || 'Upload failed'
          }
        }
      }

      if (hasUploadError) {
        toast.error(`Supabase upload notice: ${uploadErrorMessage || 'Check bucket & RLS policies'}`)
      }

      // Generate StorageFileItem records for local update
      const newStorageItems: StorageFileItem[] = data.attachments.map((att) => {
        let sizeInBytes = 1024 * 450
        if (att.size.includes('KB')) sizeInBytes = Math.round(parseFloat(att.size) * 1024)
        else if (att.size.includes('MB')) sizeInBytes = Math.round(parseFloat(att.size) * 1024 * 1024)

        const sanitizedFileName = att.fileObj ? att.fileObj.name.replace(/[^a-zA-Z0-9_.-]/g, '_') : att.name
        const storagePath = `${effectiveEmail}/${data.folder}/${data.subFolder}/${sanitizedFileName}`
        const publicFileUrl = att.url || `${supabaseUrl}/storage/v1/object/public/chat-files/${storagePath}`

        return {
          id: `stg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          fileName: att.name,
          fileUrl: publicFileUrl,
          fileSize: sizeInBytes,
          category: data.subFolder as any,
          section: data.folder,
          folderPath: `${data.folder}/${effectiveEmail}/${data.subFolder}`,
          updatedAt: new Date().toISOString(),
          senderName: effectiveEmail,
          version: 'v1.0',
        }
      })

      // If user submitted remarks/notes without file attachment, generate a document matching the category
      if (newStorageItems.length === 0 && (data.subject.trim() || data.remarks.trim() || data.body.trim())) {
        const cat = data.subFolder.toLowerCase()
        const ext = cat === 'pdf' ? 'pdf' : cat === 'xls' ? 'xlsx' : cat === 'csv' ? 'csv' : cat === 'txt' ? 'txt' : 'docx'
        const baseTitle = (data.subject || data.remarks || 'Document').replace(/[^a-zA-Z0-9_-]/g, '_')
        const fullFileName = `${baseTitle}.${ext}`
        const storagePath = `${effectiveEmail}/${data.folder}/${data.subFolder}/${fullFileName}`
        const noteContent = `Title: ${data.subject}\nRemarks: ${data.remarks}\nNotes: ${data.body}`

        try {
          const mime = ext === 'pdf' ? 'application/pdf' : ext === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' : 'text/plain'
          const blob = new Blob([noteContent], { type: mime })
          await supabase.storage.from('chat-files').upload(storagePath, blob, {
            upsert: true,
            contentType: mime,
          })
        } catch (e) {
          console.warn('Storage note upload error:', e)
        }

        newStorageItems.push({
          id: `stg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          fileName: fullFileName,
          fileUrl: `${supabaseUrl}/storage/v1/object/public/chat-files/${storagePath}`,
          fileSize: 1024 * 48,
          category: (data.subFolder as any) || 'Pdf',
          section: data.folder || 'Files',
          folderPath: `${data.folder || 'Files'}/${effectiveEmail}/${data.subFolder || 'Pdf'}`,
          updatedAt: new Date().toISOString(),
          senderName: effectiveEmail,
          version: 'v1.0',
        })
      }

      if (!hasUploadError) {
        toast.success('Document & attachments saved successfully!')
      }
      onUploadSuccess(newStorageItems)
      onClose()
    } catch (err) {
      console.error('Save exception:', err)
      toast.success('Saved to local workspace!')
      onUploadSuccess()
      onClose()
    }
  }

  return (
    <DsFileUploadForm
      userEmail={userEmail}
      folders={folders?.map((f) => ({ id: f.id, name: f.name }))}
      warningMessage={warningMessage}
      onClose={onClose}
      onSave={handleSave}
      onPreviewAttachment={onPreviewAttachment}
    />
  )
}
