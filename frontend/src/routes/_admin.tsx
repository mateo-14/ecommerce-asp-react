import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Link, Outlet, UseLinkPropsOptions, createFileRoute, useLocation } from '@tanstack/react-router'
import { clsx } from 'clsx'
import { Archive, Filter, GanttChart, Group } from 'lucide-react'

export const Route = createFileRoute('/_admin')({
  component: Layout
})

function Layout() {
  return (
    <div className="flex min-h-screen">
      <Menu />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="mt-4 px-4 h-full">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
function Header() {
  return (
    <div className="border-b py-4 px-4 flex justify-end">
      <UserMenu />
    </div>
  )
}
function Menu() {
  return (
    <div className="min-w-60 pr-4 border-r p-4">
      <h2 className="text-xl">Admin</h2>
      <nav className="mt-6 space-y-1.5">
        <MenuItem to="/admin" text="Overview" icon={<GanttChart className="size-5" />} />

        <MenuItem to="/admin/products" text="Products" icon={<Archive className="size-5" />} />
        <MenuItem to="/admin/categories" text="Categories" icon={<Group className="size-5" />} />
        <MenuItem text="Filters" to="/admin/filters" icon={<Filter className="size-5" />} />
      </nav>
    </div>
  )
}

interface MenuItemProps {
  icon?: React.ReactNode
  text: string
  to: UseLinkPropsOptions['to']
}
function MenuItem({ icon, text, to }: MenuItemProps) {
  const location = useLocation({
    select: (location) => location.pathname
  })
  return (
    <Link
      className={clsx(
        'hover:bg-secondary transition px-3 py-1.5 rounded-md font-medium text-sm flex items-center gap-x-2.5',
        {
          'bg-secondary text-white': location === to
        }
      )}
      to={to}
    >
      {icon && <span className="min-w-5">{icon}</span>}
      {text}
    </Link>
  )
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar asChild>
          <button type="button">
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback>CN</AvatarFallback>
          </button>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 mr-4 mt-1">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {/* <User className="mr-2 h-4 w-4" /> */}
            <span>Profile</span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            {/* <CreditCard className="mr-2 h-4 w-4" /> */}
            <span>Billing</span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            {/* <Settings className="mr-2 h-4 w-4" /> */}
            <span>Settings</span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            {/* <Keyboard className="mr-2 h-4 w-4" /> */}
            <span>Keyboard shortcuts</span>
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            {/* <Users className="mr-2 h-4 w-4" /> */}
            <span>Team</span>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {/* <UserPlus className="mr-2 h-4 w-4" /> */}
              <span>Invite users</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  {/* <Mail className="mr-2 h-4 w-4" /> */}
                  <span>Email</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  {/* <MessageSquare className="mr-2 h-4 w-4" /> */}
                  <span>Message</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  {/* <PlusCircle className="mr-2 h-4 w-4" /> */}
                  <span>More...</span>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            {/* <Plus className="mr-2 h-4 w-4" /> */}
            <span>New Team</span>
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {/* <Github className="mr-2 h-4 w-4" /> */}
          <span>GitHub</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          {/* <LifeBuoy className="mr-2 h-4 w-4" /> */}
          <span>Support</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          {/* <Cloud className="mr-2 h-4 w-4" /> */}
          <span>API</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {/* <LogOut className="mr-2 h-4 w-4" /> */}
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
