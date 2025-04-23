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
        window.location.href = '/'
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
    <div className='grid'>
        
            <input 
            type="email" 
            name="email" 
            id="email" 
            value={data?.email} 
            onChange={handleChange} 
            placeholder="Email" 
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            
            <input 
            type="password" 
            name="password" 
            id="password" 
            value={data?.password} 
            onChange={handleChange} 
            placeholder="Password" 
            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />


            
            <button 
            type="submit"
            onClick={login}
            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-200"
            >
            login
            </button>


            Don't have account? <Link href="/signup" style={{ color: 'blue', textDecoration: 'underline', fontWeight: 'bold' }}> Sign Up</Link>
        </div>
  )
}

export default Login