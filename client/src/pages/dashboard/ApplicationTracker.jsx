import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { Plus, MoreHorizontal, Calendar, DollarSign, Trash2 } from 'lucide-react'
import { dummyApplications } from '../../utils/dummyData'
import toast from 'react-hot-toast'
import clsx from 'clsx'

const COLUMNS = [
  { id: 'applied', label: 'Applied', color: 'bg-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20', count_color: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400' },
  { id: 'interview', label: 'Interview', color: 'bg-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20', count_color: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400' },
  { id: 'offer', label: 'Offer', color: 'bg-green-400', bg: 'bg-green-50 dark:bg-green-900/20', count_color: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400' },
  { id: 'rejected', label: 'Rejected', color: 'bg-red-400', bg: 'bg-red-50 dark:bg-red-900/20', count_color: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400' },
]

export default function ApplicationTracker() {
  const [board, setBoard] = useState(dummyApplications)
  const [addingTo, setAddingTo] = useState(null)
  const [newCard, setNewCard] = useState({ role: '', company: '', salary: '' })

  const onDragEnd = (result) => {
    const { source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const sourceCol = [...board[source.droppableId]]
    const destCol = source.droppableId === destination.droppableId
      ? sourceCol
      : [...board[destination.droppableId]]

    const [moved] = sourceCol.splice(source.index, 1)
    destCol.splice(destination.index, 0, moved)

    setBoard(prev => ({
      ...prev,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: source.droppableId === destination.droppableId ? destCol : destCol,
    }))

    if (source.droppableId !== destination.droppableId) {
      const destLabel = COLUMNS.find(c => c.id === destination.droppableId)?.label
      toast.success(`Moved to ${destLabel}`)
    }
  }

  const addCard = (colId) => {
    if (!newCard.role || !newCard.company) { toast.error('Enter role and company'); return }
    const card = {
      id: `a${Date.now()}`,
      role: newCard.role,
      company: newCard.company,
      salary: newCard.salary || 'N/A',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      logo: newCard.company.charAt(0).toUpperCase(),
      logoColor: '#6366f1',
    }
    setBoard(prev => ({ ...prev, [colId]: [card, ...prev[colId]] }))
    setNewCard({ role: '', company: '', salary: '' })
    setAddingTo(null)
    toast.success('Application added!')
  }

  const removeCard = (colId, cardId) => {
    setBoard(prev => ({ ...prev, [colId]: prev[colId].filter(c => c.id !== cardId) }))
    toast.success('Removed')
  }

  const totalApps = Object.values(board).flat().length

  return (
    <div className="space-y-5 animate-fade-in h-full">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-700 text-gray-900 dark:text-white">Application Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{totalApps} total applications · Drag cards to update status</p>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 pb-6">
          {COLUMNS.map(col => (
            <div key={col.id} className="flex flex-col bg-gray-50/80 dark:bg-gray-800/50 rounded-xl p-3 space-y-3 min-h-96">
              {/* Column header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                  <span className="font-medium text-sm text-gray-700 dark:text-gray-300">{col.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${col.count_color}`}>
                    {board[col.id]?.length || 0}
                  </span>
                </div>
                <button onClick={() => setAddingTo(addingTo === col.id ? null : col.id)}
                  className="w-6 h-6 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors">
                  <Plus size={14} />
                </button>
              </div>

              {/* Add card form */}
              {addingTo === col.id && (
                <div className="card p-3 space-y-2 animate-slide-up">
                  <input className="input text-xs py-1.5" placeholder="Role title"
                    value={newCard.role} onChange={e => setNewCard({ ...newCard, role: e.target.value })} />
                  <input className="input text-xs py-1.5" placeholder="Company"
                    value={newCard.company} onChange={e => setNewCard({ ...newCard, company: e.target.value })} />
                  <input className="input text-xs py-1.5" placeholder="Salary (optional)"
                    value={newCard.salary} onChange={e => setNewCard({ ...newCard, salary: e.target.value })} />
                  <div className="flex gap-2">
                    <button onClick={() => addCard(col.id)} className="btn-primary text-xs px-3 py-1.5">Add</button>
                    <button onClick={() => setAddingTo(null)} className="btn-secondary text-xs px-3 py-1.5">Cancel</button>
                  </div>
                </div>
              )}

              {/* Cards */}
              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={clsx('flex-1 space-y-2 min-h-20 rounded-lg transition-colors',
                      snapshot.isDraggingOver && 'bg-brand-50/50 dark:bg-brand-900/10')}
                  >
                    {board[col.id]?.map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={clsx(
                              'card p-3 space-y-2.5 cursor-grab active:cursor-grabbing',
                              snapshot.isDragging && 'shadow-card-hover rotate-1'
                            )}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                  style={{ backgroundColor: card.logoColor }}>
                                  {card.logo}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 truncate">{card.role}</p>
                                  <p className="text-xs text-gray-400 truncate">{card.company}</p>
                                </div>
                              </div>
                              <button onClick={() => removeCard(col.id, card.id)}
                                className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 ml-1">
                                <Trash2 size={13} />
                              </button>
                            </div>

                            <div className="flex items-center gap-3 text-xs text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar size={11} /> {card.date}
                              </span>
                              {card.salary !== 'N/A' && (
                                <span className="flex items-center gap-1">
                                  <DollarSign size={11} /> {card.salary.replace('$', '').replace('k', 'K')}
                                </span>
                              )}
                            </div>

                            {card.interviewDate && (
                              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-md px-2 py-1">
                                <p className="text-xs text-purple-600 dark:text-purple-400">📅 Interview: {card.interviewDate}</p>
                              </div>
                            )}
                            {card.offerExpiry && (
                              <div className="bg-green-50 dark:bg-green-900/20 rounded-md px-2 py-1">
                                <p className="text-xs text-green-600 dark:text-green-400">⏰ Offer expires: {card.offerExpiry}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    {board[col.id]?.length === 0 && !snapshot.isDraggingOver && (
                      <div className="flex items-center justify-center h-16 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
                        <p className="text-xs text-gray-300 dark:text-gray-600">Drop here</p>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
