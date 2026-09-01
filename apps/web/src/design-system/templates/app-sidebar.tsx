'use client'

import { useLayout } from '../../context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
} from '../components/ui/sidebar'
import { sidebarData } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { TeamSwitcher } from './team-switcher'
import { NavUser } from './nav-user'

export function AppSidebar() {
  const { collapsible } = useLayout()

  return (
    <Sidebar collapsible={collapsible} variant='sidebar'>
      {/* Logo & Toggle Header */}
      <SidebarHeader className='p-2 pb-1'>
        <div className='flex items-center justify-between gap-1'>
          <div className='flex-1 min-w-0'>
            <TeamSwitcher teams={sidebarData.teams} />
          </div>
          <div className='group-data-[collapsible=icon]:hidden shrink-0'>
            <SidebarTrigger
              variant='ghost'
              className='h-8 w-8 hover:bg-sidebar-accent text-sidebar-foreground'
              aria-label='Toggle sidebar'
            />
          </div>
        </div>

        {/* When collapsed to icon mode */}
        <div className='hidden group-data-[collapsible=icon]:flex justify-center pt-2 pb-1'>
          <SidebarTrigger
            variant='ghost'
            className='h-8 w-8 hover:bg-sidebar-accent text-sidebar-foreground'
            aria-label='Toggle sidebar'
          />
        </div>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        {sidebarData.navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>

      {/* User Profile */}
      <SidebarFooter>
        <NavUser user={sidebarData.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
