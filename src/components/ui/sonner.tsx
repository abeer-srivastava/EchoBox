"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      style={{ fontFamily: "inherit" }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "bg-secondary-background text-foreground border border-border font-sans shadow-lg rounded-xl text-[13px] flex items-center gap-2.5 p-4 w-[356px] backdrop-blur-sm [&:has(button)]:justify-between",
          description: "text-muted text-xs",
          actionButton:
            "text-[12px] h-7 px-3 bg-brand-primary text-white rounded-lg font-medium shrink-0",
          cancelButton:
            "text-[12px] h-7 px-3 bg-secondary-background text-foreground border border-border rounded-lg font-medium shrink-0",
          error: "bg-accent-red/10 border-accent-red/20 text-accent-red",
          loading:
            "[&[data-sonner-toast]_[data-icon]]:flex [&[data-sonner-toast]_[data-icon]]:size-4 [&[data-sonner-toast]_[data-icon]]:relative [&[data-sonner-toast]_[data-icon]]:justify-start [&[data-sonner-toast]_[data-icon]]:items-center [&[data-sonner-toast]_[data-icon]]:flex-shrink-0",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
