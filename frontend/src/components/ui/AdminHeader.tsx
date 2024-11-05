import { Link } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './breadcrumb'
import React from 'react'

interface AdminHeaderProps {
  title: string
  children?: React.ReactNode
  path: string
}
export default function AdminHeader({ title, children, path }: AdminHeaderProps) {
  const pathParts = path?.split('/').filter(Boolean)
  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/admin">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          {pathParts.slice(0, pathParts.length - 1).map((part, index) => (
            <React.Fragment key={part}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    to={`/admin/${pathParts
                      .slice(0, index + 1)
                      .join('/')
                      .toLowerCase()}`}
                  >
                    {part}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </React.Fragment>
          ))}

          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{pathParts[pathParts.length - 1]}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex justify-between mt-1.5">
        <h1 className="text-2xl font-medium">{title}</h1>
        <div>{children}</div>
      </div>
    </div>
  )
}
