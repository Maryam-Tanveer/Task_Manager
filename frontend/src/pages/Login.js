import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const { data } = await api.post('/auth/login', form)





      // Save token
      localStorage.setItem('token', data.token)

      // Save user name
      
      localStorage.setItem('name', data.data.name)

      // Save complete user
      localStorage.setItem('user', JSON.stringify(data.data))





      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] flex items-center justify-center px-3 sm:px-4 py-6">
      <div className="w-full max-w-md bg-white border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl p-6 sm:p-10">

        {/* Header */}
        <div className="text-center mb-5 sm:mb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-xl sm:text-2xl">📋</span>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
              Task Manager
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Welcome back! Please login.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 text-xs sm:text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 sm:px-4 py-2 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Email
            </label>

            <input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Password
            </label>

            <input
              type="password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
              placeholder="••••••••"
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          <button
            type="submit"
            className="w-full border border-gray-400 rounded-lg py-2 sm:py-2.5 text-sm font-medium text-gray-800 hover:bg-gray-50 transition cursor-pointer active:bg-gray-100"
          >
            Login
          </button>

        </form>

        <p className="text-center text-xs sm:text-sm text-gray-500 mt-5 sm:mt-6">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}