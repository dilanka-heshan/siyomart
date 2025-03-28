import { LoginForm } from '@/app/components/auth/LoginForm'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-600">SiyoMart</h1>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back! Please sign in to your account.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <Image
          src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop"
          alt="Sri Lankan Handcraft"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
          <blockquote className="text-white">
            <p className="text-xl font-medium mb-4">
              "Discover authentic Sri Lankan craftsmanship and culture through our carefully curated collection."
            </p>
            <footer className="text-sm">
              - SiyoMart Team
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}