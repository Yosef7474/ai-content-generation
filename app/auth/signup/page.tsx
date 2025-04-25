'use client'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SignUp = () => {
  const router = useRouter()
  const [data, setData] = useState({
    email: '',
    password: '',
    name: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const signup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { email, password, name } = data
    if (!email || !password || !name) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim()
      })

      if (signUpError) throw signUpError

      const userId = signUpData.user?.id
      if (userId) {
        const { error: insertError } = await supabase
          .from('users')
          .insert([{ id: userId, name: name.trim(), email: email.trim() }])

        if (insertError) throw insertError
        
        router.push('/dashboard')
      }
    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Create Account
          </h1>
          <p className="text-gray-400">Join our AI Content Studio</p>
        </div>

        {/* Signup Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-8 shadow-2xl">
          <form onSubmit={signup} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={data.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
                placeholder="john@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={data.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition duration-200"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg hover:shadow-blue-500/20'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>

            <div className="text-center pt-4">
              <p className="text-gray-400">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>

        {/* Decorative elements */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-blue-900/10 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-64 h-64 rounded-full bg-purple-900/10 blur-3xl"></div>
        </div>
      </div>
    </div>
  )
}

export default SignUp