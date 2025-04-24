"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Activity, User, Home, LogOut, Clock } from "lucide-react"

export function MainNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Heart Prediction",
      href: "/dashboard/heart-prediction",
      icon: Heart,
    },
    {
      name: "Cancer Prediction",
      href: "/dashboard/cancer-prediction",
      icon: Activity,
    },
    {
      name: "History",
      href: "/dashboard/history",
      icon: Clock, // Add import for Clock from lucide-react
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: User,
    },
  ]

  function logOutByClearingJwt(){
    localStorage.removeItem("token");
    window.location.href = "/";
  }

  return (
    <nav className="flex flex-col space-y-1 w-full">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors ${
              isActive ? "bg-gray-100 text-rose-600" : "text-gray-700"
            }`}
          >
            <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-rose-600" : "text-gray-500"}`} />
            {item.name}
          </Link>
        )
      })}
      <div className="pt-4 mt-4 border-t border-gray-200">
        <button onClick={logOutByClearingJwt} className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors">
          <LogOut className="mr-3 h-5 w-5 text-gray-500" />
          Logout
        </button>
      </div>
    </nav>
  )
}
