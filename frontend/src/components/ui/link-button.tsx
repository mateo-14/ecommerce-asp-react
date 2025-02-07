"use client"

import type { HTMLChakraProps, RecipeProps } from "@chakra-ui/react"
import { createRecipeContext } from "@chakra-ui/react"
import { createLink } from "@tanstack/react-router"

export interface LinkButtonProps
  extends HTMLChakraProps<"a", RecipeProps<"button">> {}

const { withContext } = createRecipeContext({ key: "button" })

// Replace "a" with your framework's link component
const LinkButton_ = withContext<HTMLAnchorElement, LinkButtonProps>("a")
export const LinkButton = createLink(LinkButton_)