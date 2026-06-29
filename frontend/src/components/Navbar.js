import { useNavigate } from 'react-router-dom'

export default function Navbar({ setSidebarOpen }) {
  const navigate = useNavigate()
  const name = localStorage.getItem('name') || 'User'

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex justify-between items-center rounded-t-2xl">

      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-7 h-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <span className="text-xl">📋</span>

        <h1 className="text-lg font-bold text-gray-800">
          Task Manager
        </h1>

      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        {/* Hide Greeting on Mobile */}

        <span className="hidden sm:block text-sm text-gray-500 font-medium">
          Hi, {name}
        </span>

        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold uppercase">
          {name.charAt(0)}
        </div>

        {/* Logout Hidden on Mobile */}

        <button
          onClick={logout}
          className="hidden sm:block text-sm text-gray-600 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors font-medium"
        >
          Logout
        </button>

      </div>

    </nav>
  )
}