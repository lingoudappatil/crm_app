import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaTrash, FaEdit, FaPlus, FaUndo, FaMoon, FaSun } from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
 import './Todo.css';

const Todo = () => {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');
  const [editId, setEditId] = useState(null);
  const [category, setCategory] = useState('personal');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [deletedTodo, setDeletedTodo] = useState(null);
  const [theme, setTheme] = useState('light');

  // Local storage sync
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Add new todo
  const addTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTodo = {
      id: uuidv4(),
      text: input,
      completed: false,
      category,
      priority,
      dueDate,
      createdAt: new Date().toISOString(),
    };

    setTodos([newTodo, ...todos]);
    setInput('');
    setDueDate('');
  };

  // Delete todo with undo capability
  const deleteTodo = (id) => {
    const todoToDelete = todos.find(todo => todo.id === id);
    setDeletedTodo({ ...todoToDelete, deletedAt: Date.now() });
    setTodos(todos.filter(todo => todo.id !== id));
    
    setTimeout(() => {
      setDeletedTodo(null);
    }, 5000);
  };

  // Undo delete
  const undoDelete = () => {
    if (deletedTodo) {
      setTodos([deletedTodo, ...todos]);
      setDeletedTodo(null);
    }
  };

  // Toggle completion
  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Handle drag & drop
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  };

  // Filtered todos
  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompletion = showCompleted ? true : !todo.completed;
    return matchesSearch && matchesCompletion;
  });

  // Statistics
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const pendingTodos = totalTodos - completedTodos;

  // Theme toggle
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`todo-container ${theme}`}>
      <div className="header">
        <h1>Todo App</h1>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>
      </div>

      {/* Statistics */}
      <div className="stats">
        <div className="stat-item">
          <span>Total</span>
          <span>{totalTodos}</span>
        </div>
        <div className="stat-item">
          <span>Completed</span>
          <span>{completedTodos}</span>
        </div>
        <div className="stat-item">
          <span>Pending</span>
          <span>{pendingTodos}</span>
        </div>
      </div>

      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What needs to be done?"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="personal">Personal</option>
          <option value="work">Work</option>
          <option value="shopping">Shopping</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit" className="add-button">
          <FaPlus />
        </button>
      </form>

      {/* Controls */}
      <div className="controls">
        <input
          type="text"
          placeholder="Search todos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={showCompleted}
            onChange={() => setShowCompleted(!showCompleted)}
          />
          Show Completed
        </label>
      </div>

      {/* Undo Notification */}
      {deletedTodo && (
        <div className="undo-notification">
          Todo deleted
          <button onClick={undoDelete} className="undo-button">
            <FaUndo /> Undo
          </button>
        </div>
      )}

      {/* Todo List */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {filteredTodos.length === 0 ? (
                <li className="empty-state">No todos found. Add one above!</li>
              ) : (
                filteredTodos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`${todo.completed ? 'completed' : ''} priority-${todo.priority}`}
                      >
                        <div className="todo-content">
                          <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleComplete(todo.id)}
                          />
                          <div className="todo-info">
                            <span className="todo-text">{todo.text}</span>
                            <div className="todo-meta">
                              <span className={`category ${todo.category}`}>
                                {todo.category}
                              </span>
                              <span className="due-date">
                                {todo.dueDate && `Due: ${new Date(todo.dueDate).toLocaleDateString()}`}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="todo-actions">
                          <button onClick={() => deleteTodo(todo.id)}>
                            <FaTrash />
                          </button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Todo;