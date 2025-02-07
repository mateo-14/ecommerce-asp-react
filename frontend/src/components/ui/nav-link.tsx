import React from 'react'
import { NavItem, type NavItemProps } from './nav-item'
import { createLink } from '@tanstack/react-router'

interface NavLinkComponentProps extends NavItemProps {
  href: string
}

const NavLinkComponent = React.forwardRef<HTMLAnchorElement, NavLinkComponentProps>((props, ref) => {
  const active = props.className?.includes('active')
  return <NavItem {...props} as="a" ref={ref} active={active} />
})
NavLinkComponent.displayName = 'NavLinkComponent'

export const NavLink = createLink(NavLinkComponent)
