import React from 'react'
import { UniversalLayout } from '@/components/layout'
import { MessageChatSection } from '@/features/message'

export default function ChatTemplateRoute() {
  return (
    <UniversalLayout title='Chat'>
      <MessageChatSection />
    </UniversalLayout>
  )
}
