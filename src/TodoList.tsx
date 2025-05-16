import React, { useState, useEffect } from 'react';

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    setInput('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEdit = (id: number, text: string) => {
    setEditId(id);
    setEditText(text);
  };

  const saveEdit = (id: number) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, text: editText } : task));
    setEditId(null);
    setEditText('');
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white/90 rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">✅</span>
          <h2 className="text-2xl font-extrabold text-blue-700 tracking-tight">To-Do List</h2>
        </div>
        <div className="flex gap-2 mb-6">
          <input
            className="border border-blue-300 p-2 flex-1 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-blue-50"
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add a new task"
          />
          <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-5 py-2 rounded-lg font-semibold shadow hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-60" onClick={addTask}>Add</button>
        </div>
        <ul>
          {tasks.map(task => (
            <li key={task.id} className="flex items-center justify-between mb-2 p-2 rounded-lg hover:bg-blue-50 transition">
              <span className={`flex-1 ${task.completed ? 'line-through text-gray-400' : ''}`}
                title={task.completed ? 'Completed' : 'Incomplete'}>
                {editId === task.id ? (
                  <>
                    <input
                      className="border p-1 rounded mr-2"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      placeholder="Edit task"
                      title="Edit task"
                    />
                    <button className="text-green-600 mr-2" onClick={() => saveEdit(task.id)} title="Save"><span role="img" aria-label="Save">💾</span></button>
                    <button className="text-gray-500" onClick={() => setEditId(null)} title="Cancel"><span role="img" aria-label="Cancel">❌</span></button>
                  </>
                ) : (
                  <>
                    <span>{task.text}</span>
                    <button className="ml-2 text-yellow-500" onClick={() => startEdit(task.id, task.text)} title="Edit"><span role="img" aria-label="Edit">✏️</span></button>
                    <button className="ml-2 text-green-500" onClick={() => toggleTask(task.id)} title="Complete/Incomplete"><span role="img" aria-label="Complete">{task.completed ? '✅' : '⬜'}</span></button>
                  </>
                )}
              </span>
              <button className="ml-2 text-red-500" onClick={() => deleteTask(task.id)} title="Delete"><span role="img" aria-label="Delete">🗑️</span></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoList;
