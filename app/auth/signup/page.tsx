'use client'

import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import React, { useState } from 'react'

const SignUp = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
    name: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const signup = async () => {
    const supabase = createClient()

    const email = data.email.trim()
    const password = data.password.trim()
    const name = data.name.trim()

    if (!email || !password || !name) {
      alert('All fields are required.')
      return
    }

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) {
      console.error('Signup error:', signUpError.message)
      alert('Signup failed: ' + signUpError.message)
      return
    }

    const userId = signUpData?.user?.id

    if (userId) {
      const { error: insertError } = await supabase
        .from('users')
        .insert([
          { id: userId, name: name, email: email },
          // Add more objects here if you want to insert multiple rows
        ])


      if (insertError) {
        console.error('Error saving name:', insertError.message)
        alert('Signup successful, but failed to save name.')
        
      } else {
        alert('Signup successful! You can now log in.')
        // Redirect to login page or perform any other action
        window.location.href = '/login'

      }
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg">
  <h2 className="text-3xl font-bold text-gray-800 mb-1">Join us today</h2>
  <p className="text-gray-500 mb-6">Start your journey with our platform</p>

  <div className="space-y-4">
    <div>
      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
        Name
      </label>
      <input
        type="text"
        id="name"
        name="name"
        value={data.name}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition duration-200"
        placeholder="John Doe"
      />
    </div>

    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        type="email"
        id="email"
        name="email"
        value={data.email}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition duration-200"
        placeholder="john@example.com"
      />
    </div>

    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
        Password
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={data.password}
        onChange={handleChange}
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition duration-200"
        placeholder="••••••••"
      />
    </div>

    <button
      onClick={signup}
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 transform hover:-translate-y-0.5"
    >
      Create Account
    </button>

    <div className="text-center pt-4">
      <p className="text-gray-600">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-blue-600 font-semibold hover:text-blue-800 transition duration-200"
        >
          Sign in
        </Link>
      </p>
    </div>
  </div>
</div>
  )
}

export default SignUp
