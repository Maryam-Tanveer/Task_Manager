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
    <nav className="bg-white border-b border-gray-200 px-3 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center rounded-t-xl sm:rounded-t-2xl">

      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Mobile Menu Button */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-gray-700 p-1 hover:bg-gray-100 rounded-lg transition"
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
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

        <span className="text-lg sm:text-xl">📋</span>

        <h1 className="text-base sm:text-lg font-bold text-gray-800">
          Task Manager
        </h1>

      </div>

      {/* Right */}

      <div className="flex items-center gap-1.5 sm:gap-3">

        {/* Hide Greeting on Mobile */}

        <span className="hidden sm:block text-xs sm:text-sm text-gray-500 font-medium">
          Hi, {name}
        </span>

        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs sm:text-sm font-semibold uppercase flex-shrink-0">
          {name.charAt(0)}
        </div>

        {/* Logout Hidden on Mobile */}

        <button
          onClick={logout}
          className="hidden sm:block text-xs sm:text-sm text-gray-600 border border-gray-300 rounded-lg px-2.5 sm:px-3 py-1 sm:py-1.5 hover:bg-gray-50 transition-colors font-medium"
        >
          Logout
        </button>
        
        {/* Mobile Logout Button */}
        <button
          onClick={logout}
          className="sm:hidden text-gray-600 p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Logout"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
        </button>

      </div>

    </nav>
  )
}