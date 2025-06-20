"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Building, Calendar, Clock, CreditCard, LogOut, Menu, Shield, User, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  color?: string
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    color: "text-white",
  },
  {
    title: "Employees",
    href: "/dashboard/employees",
    icon: Users,
    color: "text-white",
  },
  {
    title: "Departments",
    href: "/dashboard/departments",
    icon: Building,
    color: "text-white",
  },
  {
    title: "Leave Requests",
    href: "/dashboard/leave-requests",
    icon: Calendar,
    color: "text-white",
  },
  {
    title: "Salary",
    href: "/dashboard/salary",
    icon: CreditCard,
    color: "text-white",
  },
  {
    title: "Payments",
    href: "/dashboard/payments",
    icon: CreditCard,
    color: "text-white",
  },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="hidden md:block w-64 bg-gray-900 fixed top-0 left-0 h-screen overflow-y-auto">
        <nav className="flex flex-col gap-2 p-4 pt-0 h-full">
          <div className="flex items-center gap-2 font-bold mb-4 mt-4 relative h-16">
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="h-10 w-10 text-yellow-500" />
            </div>
            <div className="absolute top-2 right-2">
              <Users className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="absolute bottom-2 left-2">
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="absolute bottom-2 right-2">
              <BarChart3 className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="absolute top-2 left-2">
              <Building className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2">
              <Calendar className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
              <CreditCard className="h-4 w-4 text-yellow-500" />
            </div>
            <span className="relative z-10 ml-12 text-yellow-500">EmpTrack</span>
          </div>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors text-white",
                pathname === item.href
                  ? "bg-yellow-400 text-gray-900 font-bold shadow-sm"
                  : "hover:bg-yellow-400 hover:text-gray-900",
              )}
            >
              <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-yellow-600" : "text-white group-hover:text-yellow-600")}/>
              {item.title}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mt-auto flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-100 hover:text-red-800"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-h-screen bg-white md:ml-64">
        <div className="w-full px-4 md:px-6 py-4 border-b bg-white">
        </div>
        <main className="flex-1 p-4 md:p-6 bg-white text-gray-900">{children}</main>
      </div>
    </div>
  )
}
