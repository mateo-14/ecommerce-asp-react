import { Flex, FlexProps, Icon } from '@chakra-ui/react'
import { NavLink } from './ui/nav-link'
import { HiMiniArchiveBox, HiMiniSquares2X2 } from 'react-icons/hi2'

interface DashboardMenuProps extends FlexProps {}

export function DashboardMenu(props: DashboardMenuProps) {
  return (
    <Flex as="ul" gap={1} flexDirection={'column'} {...props}>
      <li>
        <NavLink to="/categories">
          {({ isActive }) => {
            return (
              <>
                <Icon fontSize="xl" color={isActive ? 'purple.600' : 'currentColor'} as="span">
                  <HiMiniSquares2X2 />
                </Icon>
                Categories
              </>
            )
          }}
        </NavLink>
      </li>
      <li>
        <NavLink to="/products">
          {({ isActive }) => {
            return (
              <>
                <Icon fontSize="xl" color={isActive ? 'purple.600' : 'currentColor'} as="span">
                  <HiMiniArchiveBox />
                </Icon>
                Products
              </>
            )
          }}
        </NavLink>
      </li>
    </Flex>
  )
}
