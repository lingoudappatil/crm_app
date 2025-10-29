import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FaTrash, FaEdit, FaSearch, FaFilter, FaSort } from 'react-icons/fa';
import './Todo.css';

const ViewTodo = () => {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem('todos');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('date');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setTodos(items);
  };

  const toggleComplete = (id) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Filter and search logic
  const getFilteredAndSortedTodos = () => {
    let filteredTodos = todos;

    // Apply status filter
    if (filter !== 'all') {
      filteredTodos = filteredTodos.filter(todo => 
        filter === 'completed' ? todo.completed : !todo.completed
      );
    }

    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTodos = filteredTodos.filter(todo =>
        todo.text.toLowerCase().includes(searchLower) ||
        todo.category.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    return filteredTodos.sort((a, b) => {
      switch (sort) {
        case 'priority':
          return a.priority.localeCompare(b.priority);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date':
          return new Date(b.dueDate) - new Date(a.dueDate);
        default:
          return 0;
      }
    });
  };

  const filteredTodos = getFilteredAndSortedTodos();

  // Stats calculation
  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    pending: todos.filter(todo => !todo.completed).length
  };

  return (
    <div className="todo-container">
      <div className="todo-stats">
        <div className="stat-item">
          <span className="stat-label">Total</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{stats.completed}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{stats.pending}</span>
        </div>
      </div>

      <div className="todo-filters">
        <div className="filter-group">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="search-group">
          <input
            type="text"
            placeholder="Search todos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="sort-group">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="sort-select"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="category">Sort by Category</option>
          </select>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {filteredTodos.length === 0 ? (
                <li className="empty-state">No todos found</li>
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
                              {todo.dueDate && (
                                <span className="due-date">
                                  Due: {new Date(todo.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="todo-actions">
                          <button 
                            className="delete-btn"
                            onClick={() => deleteTodo(todo.id)}
                          >
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

export default ViewTodo;