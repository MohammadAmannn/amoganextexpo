'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

export interface WorkspaceTemplateProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: React.ReactNode
  leftSidebar?: React.ReactNode
  rightSidebar?: React.ReactNode
  footer?: React.ReactNode
  children: React.ReactNode
}

export function WorkspaceTemplate({
  header,
  leftSidebar,
  rightSidebar,
  footer,
  children,
  className,
  ...props
}: WorkspaceTemplateProps) {
  return (
    <div
      className={cn(
        'flex h-screen w-full flex-col overflow-hidden bg-background text-foreground',
        className
      )}
      {...props}
    >
      {header && (
        <header className='flex h-14 shrink-0 items-center border-b px-4 bg-background z-10'>
          {header}
        </header>
      )}

      <div className='flex flex-1 overflow-hidden'>
        {leftSidebar && (
          <aside className='hidden md:flex w-64 shrink-0 flex-col border-r bg-sidebar p-3 overflow-y-auto'>
            {leftSidebar}
          </aside>
        )}

        <main className='flex flex-1 flex-col overflow-y-auto p-4 sm:p-6 bg-muted/20'>
          {children}
        </main>

        {rightSidebar && (
          <aside className='hidden lg:flex w-80 shrink-0 flex-col border-l bg-background p-4 overflow-y-auto'>
            {rightSidebar}
          </aside>
        )}
      </div>

      {footer && (
        <footer className='flex h-10 shrink-0 items-center border-t px-4 text-xs text-muted-foreground bg-background'>
          {footer}
        </footer>
      )}
    </div>
  )
}
