import * as React from 'react'
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) { return <button {...props} className={`inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50 ${props.className ?? ''}`} /> }
