import { RegisterForm } from '@/app/components/auth/RegisterForm'
import Image from 'next/image'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-600">SiyoMart</h1>
            <p className="mt-2 text-sm text-gray-600">
              Create your account to start shopping 
            </p>
          </div>
          <RegisterForm />
        </div>
      </div>
      
      {/* Right side - Image */}
      <div className="hidden lg:flex flex-1 relative">
        <Image
          src="https://images.unsplash.com/photo-1604076913837-52ab5629fba9?q=80&w=1974&auto=format&fit=crop"
          alt="Sri Lankan Handicraft"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-12">
          <blockquote className="text-white">
            <p className="text-xl font-medium mb-4">
              "Join our community of artisans and customers celebrating the rich cultural heritage of Sri Lanka."
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
