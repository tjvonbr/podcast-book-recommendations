"use client"

import * as React from "react"

type PopoverProps = {
  trigger: React.ReactNode
  children: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
}

export function Popover({ trigger, children }: PopoverProps) {
  const [open, setOpen] = React.useState(false)
  const triggerRef = React.useRef<HTMLDivElement | null>(null)

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div ref={triggerRef}>{trigger}</div>
      {open ? (
        <div className="absolute z-50 mt-2 w-80 rounded-md border border-black/[.08] dark:border-white/[.145] bg-white dark:bg-[#0a0a0a] shadow-md p-3 text-sm">
          {children}
        </div>
      ) : null}
    </div>
  )
}


