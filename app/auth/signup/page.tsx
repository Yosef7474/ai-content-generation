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
    <div className="grid gap-2">
      <input
        type="text"
        name="name"
        value={data.name}
        onChange={handleChange}
        placeholder="Name"
        className="p-2 border border-gray-300 rounded-md"
      />

      <input
        type="email"
        name="email"
        value={data.email}
        onChange={handleChange}
        placeholder="Email"
        className="p-2 border border-gray-300 rounded-md"
      />

      <input
        type="password"
        name="password"
        value={data.password}
        onChange={handleChange}
        placeholder="Password"
        className="p-2 border border-gray-300 rounded-md"
      />

      <button onClick={signup} className="bg-blue-600 text-white px-4 py-2 rounded-md">
        Sign up
      </button>

      <span>
        Already have an account?{' '}
        <Link
          href="/login"
          style={{ color: 'blue', textDecoration: 'underline', fontWeight: 'bold' }}
        >
          Login
        </Link>
      </span>
    </div>
  )
}

export default SignUp
