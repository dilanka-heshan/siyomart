import Link from 'next/link'
import { 
  Home, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  BarChart, 
  Tag, 
  MessageSquare,
  Inbox
} from 'lucide-react'

export default function AdminSidebar() {
  const menuItems = [
    { name: 'Dashboard', icon: <Home className="h-5 w-5" />, href: '/dashboard/admin' },
    { name: 'Products', icon: <Package className="h-5 w-5" />, href: '/dashboard/admin/products' },
    { name: 'Users', icon: <Users className="h-5 w-5" />, href: '/dashboard/admin/users' },
    { name: 'Orders', icon: <ShoppingCart className="h-5 w-5" />, href: '/dashboard/admin/orders' },
    { name: 'Categories', icon: <Tag className="h-5 w-5" />, href: '/dashboard/admin/categories' },
    { name: 'Contact Inquiries', icon: <Inbox className="h-5 w-5" />, href: '/dashboard/admin/inquiries' },
    { name: 'Analytics', icon: <BarChart className="h-5 w-5" />, href: '/dashboard/admin/analytics' },
    { name: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/dashboard/admin/settings' },
  ]

  return (
    <div className="bg-white w-64 min-h-screen border-r border-gray-200 hidden md:block">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Admin Dashboard</h2>
      </div>
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-amber-600">
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
