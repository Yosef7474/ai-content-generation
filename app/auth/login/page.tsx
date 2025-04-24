'use client'


import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { use, useState } from 'react'

const Login =  () => {

    const [data, setData] = useState({
        email: '',
        password: ''
    })
 
       const login = async () => {
      try {
        
const { data: dataUser, error } = await createClient()
           .auth
           .signInWithPassword({
    email: data.email,
    password: data.password,
  })
  


      if(dataUser) {
        window.location.href = '/dashboard'
      }
        } catch (error) {
            console.log(error)
        }
    } 
       

    const handleChange = (e: any)=> {
        const { name, value } = e.target
        setData((prev: any) => ({ 
            ...prev, 
            [name]: value 
        }))
    }

    

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-100">
  <div className="text-center mb-8">
    <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back</h1>
    <p className="text-gray-500">Sign in to your account</p>
  </div>

  <div className="space-y-6">
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
        Email
      </label>
      <input
        type="email"
        name="email"
        id="email"
        value={data?.email}
        onChange={handleChange}
        placeholder="your@email.com"
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition duration-200"
      />
    </div>

    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
        Password
      </label>
      <input
        type="password"
        name="password"
        id="password"
        value={data?.password}
        onChange={handleChange}
        placeholder="••••••••"
        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition duration-200"
      />
    </div>

    <button
      type="submit"
      onClick={login}
      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
    >
      Sign In
    </button>

    <div className="text-center pt-4">
      <p className="text-gray-600">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="text-blue-600 font-semibold hover:text-blue-800 transition duration-200 hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  </div>
</div>
  )
}

export default Login