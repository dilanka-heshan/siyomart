'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui/Button'
import { XIcon } from 'lucide-react'

interface LoginPromptProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description: string
}

export function LoginPrompt({ isOpen, onClose, title, description }: LoginPromptProps) {
  const router = useRouter()
  
  const handleLogin = () => {
    router.push('/login')
  }
  
  const handleRegister = () => {
    router.push('/register')
  }
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-start">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    {title}
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <XIcon className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="mt-3">
                  <p className="text-sm text-gray-500">
                    {description}
                  </p>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button
                    type="button"
                    className="flex-1 justify-center"
                    onClick={handleLogin}
                  >
                    Log in
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 justify-center"
                    onClick={handleRegister}
                  >
                    Create account
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
