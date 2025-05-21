"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { BarChart3, Building, Calendar, Clock, CreditCard, LogOut, Menu, User, Users } from "lucide-react"

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
    title: "Attendance",
    href: "/dashboard/attendance",
    icon: Clock,
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
      <aside className="hidden md:block w-64 bg-gray-900">
        <nav className="flex flex-col gap-2 p-4 pt-0 h-full">
          <div className="flex items-center gap-2 font-bold mb-4 mt-4">
            <Users className="h-6 w-6 text-yellow-500" />
            <span className="text-yellow-500">EmpTrack</span>
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
      <div className="flex-1 flex flex-col min-h-screen bg-white">
        <div className="w-full px-4 md:px-6 py-4 border-b bg-white">
        </div>
        <main className="flex-1 p-4 md:p-6 bg-white text-gray-900">{children}</main>
      </div>
    </div>
  )
}
