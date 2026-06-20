import { useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import TaskCard from '../components/TaskCard'
import TaskForm from '../components/TaskForm'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editTask, setEditTask] = useState(null)
  const [sidebarActive, setSidebarActive] = useState('dashboard')
  const navigate = useNavigate()

  const fetchTasks = useCallback(async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {}
      const { data } = await api.get('/tasks', { params })
      setTasks(data)
    } catch {
      navigate('/login')
    }
  }, [filter, navigate])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleDelete = async (id) => {
    await api.delete(`/tasks/${id}`)
    fetchTasks()
  }

  const handleStatusToggle = async (task) => {
    const next = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' }
    await api.put(`/tasks/${task._id}`, { status: next[task.status] })
    fetchTasks()
  }

  // Derived counts
  const counts = useMemo(() => {
    const today = new Date().toDateString()
    return {
      all: tasks.length,
      todo: tasks.filter((t) => t.status === 'todo').length,
      'in-progress': tasks.filter((t) => t.status === 'in-progress').length,
      done: tasks.filter((t) => t.status === 'done').length,
      dueToday: tasks.filter(
        (t) => t.dueDate && new Date(t.dueDate).toDateString() === today
      ).length,
    }
  }, [tasks])

  // Filter tasks for display
  const displayTasks = useMemo(() => {
    let filtered = tasks
    if (sidebarActive === 'in-progress') {
      filtered = filtered.filter((t) => t.status === 'in-progress')
    } else if (sidebarActive === 'completed') {
      filtered = filtered.filter((t) => t.status === 'done')
    } else if (sidebarActive === 'due-today') {
      const today = new Date().toDateString()
      filtered = filtered.filter(
        (t) => t.dueDate && new Date(t.dueDate).toDateString() === today
      )
    } else {
      // dashboard - use filter tabs
      if (filter === 'todo') filtered = filtered.filter((t) => t.status === 'todo')
      else if (filter === 'in-progress')
        filtered = filtered.filter((t) => t.status === 'in-progress')
      else if (filter === 'done') filtered = filtered.filter((t) => t.status === 'done')
    }
    if (priorityFilter) {
      filtered = filtered.filter((t) => t.priority === priorityFilter)
    }
    return filtered
  }, [tasks, filter, sidebarActive, priorityFilter])

  // Group tasks by status for display
  const groupedTasks = useMemo(() => {
    const groups = { todo: [], 'in-progress': [], done: [] }
    displayTasks.forEach((t) => {
      if (groups[t.status]) groups[t.status].push(t)
    })
    return groups
  }, [displayTasks])

  const handleSidebarClick = (item) => {
    setSidebarActive(item)
    if (item === 'dashboard') setFilter('all')
    else if (item === 'in-progress') setFilter('all')
    else if (item === 'completed') setFilter('all')
    else if (item === 'due-today') setFilter('all')
  }

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'todo', label: 'Todo' },
    { key: 'in-progress', label: 'In Progress' },
    { key: 'done', label: 'Done' },
  ]

  const sidebarMenu = [
    {
      key: 'dashboard',
      label: 'Dashboard',
      count: counts.all,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
    },
    {
      key: 'in-progress',
      label: 'In Progress',
      count: counts['in-progress'],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      key: 'completed',
      label: 'Completed',
      count: counts.done,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      key: 'due-today',
      label: 'Due Today',
      count: counts.dueToday,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      ),
    },
  ]

  const priorityItems = [
    { key: 'high', label: 'High', color: 'text-red-500', dotColor: 'bg-red-500' },
    { key: 'medium', label: 'Medium', color: 'text-yellow-500', dotColor: 'bg-yellow-500' },
    { key: 'low', label: 'Low', color: 'text-green-500', dotColor: 'bg-green-500' },
  ]

  const statusGroupLabels = {
    todo: 'TODO',
    'in-progress': 'IN PROGRESS',
    done: 'COMPLETED',
  }

  return (
    <div className="min-h-screen bg-[#faf8f4] p-4 md:p-8">
      {/* Outer dashed card container */}
      <div className="max-w-7xl mx-auto border-2 border-dashed border-gray-300 rounded-2xl bg-white min-h-[calc(100vh-4rem)] flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Body: Sidebar + Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* ====== LEFT SIDEBAR ====== */}
          <aside className="w-60 border-r border-gray-200 p-5 flex flex-col shrink-0">
            {/* MENU Section */}
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              Menu
            </p>
            <nav className="space-y-1 mb-6">
              {sidebarMenu.map((item) => {
                const isActive = sidebarActive === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() => handleSidebarClick(item.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                    }`}
                  >
                    {/* Active left indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-indigo-600 rounded-r-full" />
                    )}
                    <span className={isActive ? 'text-indigo-600' : 'text-gray-400'}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-left">{item.label}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {item.count}
                    </span>
                  </button>
                )
              })}
            </nav>

            {/* PRIORITY Section */}
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">
              Priority
            </p>
            <nav className="space-y-1">
              {priorityItems.map((item) => {
                const isActive = priorityFilter === item.key
                return (
                  <button
                    key={item.key}
                    onClick={() =>
                      setPriorityFilter(isActive ? null : item.key)
                    }
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gray-100 text-gray-800'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`w-4 h-4 ${item.color}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M3 6a3 3 0 013-3h1.172a3 3 0 012.12.879l.83.828A1 1 0 0010.828 5H14a3 3 0 013 3v1H3V6z" />
                      <path
                        fillRule="evenodd"
                        d="M3 9h14v5a3 3 0 01-3 3H6a3 3 0 01-3-3V9zm5 3a1 1 0 00-1 1v1a1 1 0 102 0v-1a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && (
                      <span className={`w-2 h-2 rounded-full ${item.dotColor}`} />
                    )}
                  </button>
                )
              })}
            </nav>
          </aside>

          {/* ====== MAIN CONTENT ====== */}
          <main className="flex-1 p-6 overflow-y-auto">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-800">
                {sidebarActive === 'dashboard'
                  ? 'All Tasks'
                  : sidebarActive === 'in-progress'
                  ? 'In Progress'
                  : sidebarActive === 'completed'
                  ? 'Completed'
                  : 'Due Today'}
              </h2>
              <button
                onClick={() => {
                  setEditTask(null)
                  setShowForm(true)
                }}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Task
              </button>
            </div>

            {/* Filter Tabs */}
            {sidebarActive === 'dashboard' && (
              <div className="flex items-center gap-2 mb-5">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filter === tab.key
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span className="text-xs text-gray-400 font-medium uppercase">Total Tasks</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{counts.all}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-yellow-500" />
                  <span className="text-xs text-gray-400 font-medium uppercase">In Progress</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{counts['in-progress']}</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-400 font-medium uppercase">Completed</span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{counts.done}</p>
              </div>
            </div>

            {/* Task Groups */}
            {displayTasks.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">📝</div>
                <p className="text-gray-400 text-sm">No tasks found. Create one!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedTasks).map(
                  ([status, statusTasks]) =>
                    statusTasks.length > 0 && (
                      <div key={status}>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                          {statusGroupLabels[status]}
                        </p>
                        <div className="space-y-3">
                          {statusTasks.map((task) => (
                            <TaskCard
                              key={task._id}
                              task={task}
                              onDelete={handleDelete}
                              onToggle={handleStatusToggle}
                              onEdit={(t) => {
                                setEditTask(t)
                                setShowForm(true)
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editTask}
          onClose={() => setShowForm(false)}
          onSave={() => {
            setShowForm(false)
            fetchTasks()
          }}
        />
      )}
    </div>
  )
}