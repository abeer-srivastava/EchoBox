import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-border bg-background flex h-12 w-full min-w-0 rounded-base border-[3px] px-3 py-1 text-base font-bold shadow-brutal-sm transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:bg-accent-yellow",
        className
      )}
      {...props}
    />
  )
}

export { Input }
