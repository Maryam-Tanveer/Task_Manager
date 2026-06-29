const priorityColor = {
  low: 'bg-green-100 text-green-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700',
}

const statusColor = {
  todo: 'bg-gray-100 text-gray-600',
  'in-progress': 'bg-yellow-100 text-yellow-700',
  done: 'bg-green-100 text-green-700',
}

const statusLabel = {
  todo: 'Todo',
  'in-progress': 'In Progress',
  done: 'Done',
}

const priorityLabel = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
}

export default function TaskCard({ task, onDelete, onToggle, onEdit }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">

      {/* Title + Buttons */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3">

        <div className="flex-1 min-w-0">
          <h3
            className={`text-sm sm:text-base font-semibold italic break-words ${
              task.status === 'done'
                ? 'line-through text-gray-400'
                : 'text-gray-800'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-gray-500 leading-relaxed break-words\">
              {task.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1.5 self-end sm:self-start shrink-0">

          <button
            onClick={() => onEdit(task)}
            className=\"w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-indigo-50 hover:text-indigo-600 transition active:bg-indigo-100\"
            title=\"Edit\"
          >
            <svg
              xmlns=\"http://www.w3.org/2000/svg\"
              className=\"w-4 h-4\"
              viewBox=\"0 0 20 20\"
              fill=\"currentColor\"
            >
              <path d=\"M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z\" />
            </svg>
          </button>

          <button
            onClick={() => onDelete(task._id)}
            className=\"w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-red-50 hover:text-red-600 transition active:bg-red-100\"
            title=\"Delete\"
          >
            <svg
              xmlns=\"http://www.w3.org/2000/svg\"
              className=\"w-4 h-4\"
              viewBox=\"0 0 20 20\"
              fill=\"currentColor\"
            >
              <path
                fillRule=\"evenodd\"
                d=\"M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z\"
                clipRule=\"evenodd\"
              />
            </svg>
          </button>

        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-1.5 sm:gap-2">

        {/* Status */}
        <span
          onClick={() => onToggle(task)}
          className={`cursor-pointer text-[11px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium hover:opacity-80 transition active:opacity-70 ${statusColor[task.status]}`}
        >
          {statusLabel[task.status]}
        </span>

        {/* Priority */}
        <span
          className={`text-[11px] sm:text-xs px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium ${priorityColor[task.priority]}`}
        >
          {priorityLabel[task.priority]}
        </span>

        {/* Date */}
        {task.dueDate && (
          <span className="w-full sm:w-auto sm:ml-auto flex items-center gap-1 text-[10px] sm:text-xs text-gray-400">

            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 sm:w-4 sm:h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                clipRule="evenodd"
              />
            </svg>

            {new Date(task.dueDate).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        )}

      </div>

    </div>
  )
}