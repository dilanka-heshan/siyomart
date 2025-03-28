'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/app/components/ui/Button'
import { Loader } from '@/app/components/ui/Loader'

interface RegisterFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  role: 'user' | 'operator'
}

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>({
    defaultValues: {
      role: 'user'
    }
  })
  
  const password = watch('password')

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true)
      setError('')
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.message || 'Registration failed')
        return
      }

      // Redirect to login page on success
      router.push('/login?registered=true')
    } catch (error) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          {...register('name', { 
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          })}
          type="text"
          className="input-field mt-1"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          type="email"
          className="input-field mt-1"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          {...register('password', { 
            required: 'Password is required',
            minLength: {
              value: 6,
              message: 'Password must be at least 6 characters'
            }
          })}
          type="password"
          className="input-field mt-1"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
          Confirm Password
        </label>
        <input
          {...register('confirmPassword', { 
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match'
          })}
          type="password"
          className="input-field mt-1"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          I want to register as
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <input
              {...register('role')}
              type="radio"
              value="user"
              id="role-user"
              className="peer absolute opacity-0 h-0 w-0"
            />
            <label 
              htmlFor="role-user" 
              className="block border rounded-md p-3 text-center cursor-pointer peer-checked:border-amber-600 peer-checked:bg-amber-50"
            >
              Buyer
            </label>
          </div>
          <div className="relative">
            <input
              {...register('role')}
              type="radio"
              value="operator"
              id="role-operator"
              className="peer absolute opacity-0 h-0 w-0"
            />
            <label 
              htmlFor="role-operator" 
              className="block border rounded-md p-3 text-center cursor-pointer peer-checked:border-amber-600 peer-checked:bg-amber-50"
            >
              Seller
            </label>
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full flex justify-center"
        disabled={loading}
      >
        {loading ? <Loader className="h-5 w-5" /> : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link 
          href="/login" 
          className="text-amber-600 hover:text-amber-500"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
