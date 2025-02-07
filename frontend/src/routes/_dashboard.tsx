import { DashboardMenu } from '@/components/dashboard-menu'
import {
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle
} from '@/components/ui/drawer'
import { Box, Button, Flex, Grid, GridItem, Heading } from '@chakra-ui/react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useState } from 'react'
export const Route = createFileRoute('/_dashboard')({
  component: RouteComponent
})

function RouteComponent() {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Grid
        templateAreas={{
          base: '"logo header" "content content"',
          lg: '"logo header" "sidebar content"'
        }}
        templateColumns={{
          base: 'auto 1fr',
          lg: '250px 1fr'
        }}
        templateRows={{
          base: 'auto 1fr'
        }}
        minHeight={'100vh'}
        background={'bg.subtle'}
      >
        <GridItem
          area="logo"
          padding={4}
          bg={'bg.panel'}
          borderInlineEndWidth={'1px'}
          borderBlockEndWidth={'1px'}
          borderColor={'border'}
        >
          <Heading as="h1" size="xl">
            Logo
          </Heading>
        </GridItem>
        <GridItem
          area="header"
          as="header"
          padding={4}
          bg={'bg.panel'}
          borderBlockEndWidth={'1px'}
          borderColor={'border'}
        >
          <Flex gap={4} justifyContent={'space-between'}>
            <Button variant="outline" onClick={() => setIsOpen(true)} hideFrom={'lg'} marginInlineStart={'auto'}>
              Open Drawer
            </Button>

            <DrawerRoot open={isOpen} onOpenChange={(e) => setIsOpen(e.open)} size={'xs'} placement={'start'}>
              <DrawerBackdrop />
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Drawer Title</DrawerTitle>
                </DrawerHeader>
                <DrawerBody>
                  <DashboardMenu />
                </DrawerBody>
              <DrawerCloseTrigger />
              </DrawerContent>
            </DrawerRoot>
          </Flex>
        </GridItem>
        <GridItem area="sidebar" hideBelow={'lg'} bg={'bg.panel'} borderInlineEndWidth={'1px'} borderColor={'border'}>
          <DashboardMenu paddingInline={4} marginBlockStart={4} />
        </GridItem>
        <GridItem area="content" padding={4}>
          <Box bg={'bg.panel'} borderWidth={'1px'} borderColor={'border'} padding={4} borderRadius={'lg'} height={'100%'}>
            <Outlet />
          </Box>
        </GridItem>
      </Grid>
    </>
  )
}
