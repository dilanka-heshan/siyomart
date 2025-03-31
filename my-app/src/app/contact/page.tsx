'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'

type FormData = {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  inquiryType: string;
  message: string;
}

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setErrorMessage(null)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit inquiry')
      }
      
      setIsSubmitted(true)
      reset()
      
      // Reset submission status after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    } catch (error: any) {
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
      console.error('Error submitting form:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1576615278693-f8e095e37e01?q=80&w=2070&auto=format&fit=crop"
            alt="Sri Lankan Traditional Communication"
            fill
            priority
            className="object-cover brightness-[0.85]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/30" />
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Get In Touch</h1>
            <div className="w-24 h-1 bg-amber-500 mb-6"></div>
            <p className="text-white text-lg md:text-xl max-w-2xl">
              We'd love to hear from you. Whether you have a question about our products, 
              becoming a seller, or need help with an order - we're here to assist.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Details and Form Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-12 gap-8 md:gap-12">
            {/* Contact Details */}
            <div className="md:col-span-5 lg:col-span-4">
              <div className="sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Information</h2>
                
                {/* Contact cards */}
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mr-4">
                        <Mail className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Email Us</h3>
                        <p className="text-gray-600 mb-2 text-sm">For general inquiries:</p>
                        <a href="mailto:info@siyomart.com" className="text-amber-600 hover:underline">info@siyomart.com</a>
                        <p className="text-gray-600 mt-2 mb-1 text-sm">For seller support:</p>
                        <a href="mailto:sellers@siyomart.com" className="text-amber-600 hover:underline">sellers@siyomart.com</a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mr-4">
                        <Phone className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Call Us</h3>
                        <p className="text-gray-600 mb-2 text-sm">Customer Support:</p>
                        <a href="tel:+94112345678" className="text-amber-600 hover:underline">+94 76 5714 852</a>
                        <p className="text-gray-600 mt-2 mb-1 text-sm">Business Inquiries:</p>
                        <a href="tel:+94762345678" className="text-amber-600 hover:underline">+94 71 5592 470</a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mr-4">
                        <MapPin className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Visit Us</h3>
                        <p className="text-gray-600">
                          SiyoMart <br />
                          207 Gonagala<br />
                          Bentota 80500<br />
                          Sri Lanka
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex items-start">
                      <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mr-4">
                        <Clock className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">Our Hours</h3>
                        <p className="text-gray-600 mb-1">Monday - Friday:</p>
                        <p className="text-gray-800 font-medium mb-2">9:00 AM - 6:00 PM</p>
                        <p className="text-gray-600 mb-1">Saturday:</p>
                        <p className="text-gray-800 font-medium mb-2">10:00 AM - 4:00 PM</p>
                        <p className="text-gray-600 mb-1">Sunday:</p>
                        <p className="text-gray-800 font-medium">Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="md:col-span-7 lg:col-span-8">
              <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">
                  Have questions or feedback? Fill out the form below and our team will get back to you within 24 hours.
                </p>
                
                {errorMessage && (
                  <div className="bg-red-50 border border-red-100 rounded-lg p-4 flex items-start mb-6">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700">{errorMessage}</p>
                  </div>
                )}
                
                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-6 flex items-start">
                    <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-800 mb-2">Thank You for Reaching Out!</h3>
                      <p className="text-green-700">
                        We've received your message and will respond to your inquiry as soon as possible.
                        Our team typically responds within 24 hours during business days.
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" id="contact-form">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          className={`w-full px-4 py-2 rounded-md border ${errors.name ? 'border-red-300 ring-red-300' : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500'} focus:outline-none focus:ring-2`}
                          placeholder="John Doe"
                          {...register('name', { required: 'Name is required' })}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          className={`w-full px-4 py-2 rounded-md border ${errors.email ? 'border-red-300 ring-red-300' : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500'} focus:outline-none focus:ring-2`}
                          placeholder="you@example.com"
                          {...register('email', { 
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address',
                            }
                          })}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        placeholder="+94 71 234 5678"
                        {...register('phone')}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="subject"
                        type="text"
                        className={`w-full px-4 py-2 rounded-md border ${errors.subject ? 'border-red-300 ring-red-300' : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500'} focus:outline-none focus:ring-2`}
                        placeholder="Product inquiry, seller application, etc."
                        {...register('subject', { required: 'Subject is required' })}
                      />
                      {errors.subject && (
                        <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-1">
                        Inquiry Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="inquiryType"
                        className={`w-full px-4 py-2 rounded-md border ${errors.inquiryType ? 'border-red-300 ring-red-300' : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500'} focus:outline-none focus:ring-2`}
                        {...register('inquiryType', { required: 'Please select an inquiry type' })}
                      >
                        <option value="">Select an option</option>
                        <option value="general">General Inquiry</option>
                        <option value="product">Product Question</option>
                        <option value="seller">Become a Seller</option>
                        <option value="order">Order Support</option>
                        <option value="shipping">Shipping Information</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.inquiryType && (
                        <p className="mt-1 text-sm text-red-600">{errors.inquiryType.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={6}
                        className={`w-full px-4 py-2 rounded-md border ${errors.message ? 'border-red-300 ring-red-300' : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500'} focus:outline-none focus:ring-2`}
                        placeholder="How can we help you? Please provide as much detail as possible."
                        {...register('message', { required: 'Please enter your message' })}
                      ></textarea>
                      {errors.message && (
                        <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-amber-600 text-white font-medium rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex items-center justify-center transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-12">Find Us</h2>
          <div className="rounded-lg overflow-hidden shadow-md border border-gray-200 h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31687.550287509875!2d79.84421624534075!3d6.926972390416954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2591b1eb7320d%3A0x48edd9e8a1eb16d4!2sColombo%2C%20Sri%20Lanka!5e0!3m2!1sen!2sus!4v1663616328674!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SiyoMart Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. 
                  For Sri Lankan customers, we also offer Cash on Delivery and support for local mobile payment systems.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2">How long does shipping take?</h3>
                <p className="text-gray-600">
                  Shipping times vary depending on your location. For Sri Lanka, delivery typically takes 2-4 business days. 
                  International shipping ranges from 7-21 business days, depending on the destination country and shipping method selected.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2">How can I become a seller on SiyoMart?</h3>
                <p className="text-gray-600">
                  We welcome Sri Lankan artisans and craftspeople to join our platform! To become a seller, 
                  click on the "Become a Seller" option in your account menu, complete the application form, 
                  and submit required verification documents. Our team will review your application within 3-5 business days.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg mb-2">What is your return policy?</h3>
                <p className="text-gray-600">
                  We offer a 30-day return policy for most products. If you're not satisfied with your purchase, 
                  you can request a return within 30 days of delivery. Please note that customized items and perishable 
                  goods may not be eligible for returns. See our Returns & Refunds page for complete details.
                </p>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4">Don't see your question here?</p>
              <a href="#contact-form" className="text-amber-600 font-medium hover:underline">
                Contact our support team for assistance
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
