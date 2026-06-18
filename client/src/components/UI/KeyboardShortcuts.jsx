import { useState } from 'react'
import { Keyboard, X } from 'lucide-react'

const SHORTCUTS = [
  {
    category: 'Editor',
    items: [
      { keys: ['Ctrl', 'S'], description: 'Save version snapshot' },
      { keys: ['Ctrl', '/'], description: 'Toggle comments' },
      { keys: ['Ctrl', 'Z'], description: 'Undo' },
      { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
      { keys: ['Ctrl', 'F'], description: 'Find in file' },
      { keys: ['Alt', '↑/↓'], description: 'Move line up/down' },
      { keys: ['Ctrl', 'D'], description: 'Select next occurrence' },
    ],
  },
  {
    category: 'Navigation',
    items: [
      { keys: ['Ctrl', '`'], description: 'Toggle output panel' },
      { keys: ['Esc'], description: 'Close modals/panels' },
    ],
  },
]

const KeyboardShortcuts = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-gray-600 hover:text-gray-400 transition-colors text-xs px-2 py-1 rounded"
        title="Keyboard shortcuts"
      >
        <Keyboard size={12} />
        <span className="hidden sm:block">Shortcuts</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Keyboard size={18} className="text-blue-400" />
                <h2 className="text-white font-semibold">Keyboard Shortcuts</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-5">
              {SHORTCUTS.map((section) => (
                <div key={section.category}>
                  <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    {section.category}
                  </h3>
                  <div className="space-y-2">
                    {section.items.map((item) => (
                      <div
                        key={item.description}
                        className="flex items-center justify-between py-1.5"
                      >
                        <div className="flex items-center gap-1">
                          {item.keys.map((key, i) => (
                            <span key={i}>
                              <kbd className="bg-gray-800 border border-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded font-mono">
                                {key}
                              </kbd>
                              {i < item.keys.length - 1 && (
                                <span className="text-gray-600 text-xs mx-0.5">+</span>
                              )}
                            </span>
                          ))}
                        </div>
                        
                        <span className="text-gray-400 text-sm">
                          {item.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-gray-600 text-xs mt-5 text-center">
              Mac users: use ⌘ instead of Ctrl
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default KeyboardShortcuts