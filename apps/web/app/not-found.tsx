'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className='flex h-svh flex-col items-center justify-center gap-4 text-center'>
      <h1 className='text-4xl font-bold'>404</h1>
      <p className='text-muted-foreground'>The page you are looking for does not exist.</p>
      <Button asChild>
        <Link href='/'>Back to System Design</Link>
      </Button>
    </div>
  )
}
