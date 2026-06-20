import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const name = localStorage.getItem('name') || 'User'

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center rounded-t-2xl">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl">📋</span>
        <h1 className="text-lg font-bold text-gray-800">Task Manager</h1>
      </div>

      {/* Right: User info + Logout */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-500 font-medium">Hi, {name}</span>
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold uppercase">
          {name.charAt(0)}
        </div>
        <button
          onClick={logout}
          className="text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}