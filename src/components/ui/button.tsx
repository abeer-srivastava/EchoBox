import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import * as React from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-base text-sm font-bold ring-offset-white transition-all gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "text-main-foreground bg-main border-[3px] border-border shadow-brutal-md hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-sm active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none",
        noShadow: "text-main-foreground bg-main border-[3px] border-border",
        neutral:
          "bg-secondary-background text-foreground border-[3px] border-border shadow-brutal-md hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-sm active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none",
        reverse:
          "text-main-foreground bg-main border-[3px] border-border hover:translate-x-reverseBoxShadowX hover:translate-y-reverseBoxShadowY hover:shadow-brutal-md",
        danger:
          "bg-accent-red text-white border-[3px] border-border shadow-brutal-md hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-brutal-sm active:translate-x-boxShadowX active:translate-y-boxShadowY active:shadow-none",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4",
        lg: "h-14 px-10 text-lg",
        icon: "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
