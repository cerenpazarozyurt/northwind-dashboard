"use client"

import { ChakraProvider, defaultSystem } from "@chakra-ui/react"
import {
  ColorModeProvider,
  type ColorModeProviderProps,
} from "./color-mode"
import { Toaster } from "./toaster"

export function Provider({ children, ...rest }: ColorModeProviderProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider {...rest}>
        {children}
        <Toaster />
      </ColorModeProvider>
    </ChakraProvider>
  )
}
