import { useReducer, useState } from 'react';
import './App.css';

const initialState = [];

function todoReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        { id: Date.now(), text: action.payload, completed: false, isEditing: false },
        ...state,
      ];
    case 'TOGGLE_COMPLETE':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo
      );
    case 'DELETE_TODO':
      return state.filter(todo => todo.id !== action.payload);
    case 'START_EDIT':
      return state.map(todo =>
        todo.id === action.payload ? { ...todo, isEditing: true } : todo
      );
    case 'SAVE_EDIT':
      return state.map(todo =>
        todo.id === action.payload.id
          ? { ...todo, text: action.payload.text, isEditing: false }
          : todo
      );
    default:
      return state;
  }
}

function App() {
  const [todos, dispatch] = useReducer(todoReducer, initialState);
  const [newTodo, setNewTodo] = useState('');
  const [editText, setEditText] = useState({}); // Track input per todo ID

  const handleAdd = e => {
    e.preventDefault();
    if (newTodo.trim()) {
      dispatch({ type: 'ADD_TODO', payload: newTodo.trim() });
      setNewTodo('');
    }
  };

  const handleEditChange = (id, value) => {
    setEditText(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <form onSubmit={handleAdd}>
        <input
          value={newTodo}
          onChange={e => setNewTodo(e.target.value)}
          placeholder="Add a new task"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: 'TOGGLE_COMPLETE', payload: todo.id })}
            />

            {todo.isEditing ? (
              <>
                <input
                  type="text"
                  value={editText[todo.id] ?? todo.text}
                  onChange={e => handleEditChange(todo.id, e.target.value)}
                />
                <button
                  onClick={() =>
                    dispatch({
                      type: 'SAVE_EDIT',
                      payload: { id: todo.id, text: editText[todo.id] ?? todo.text },
                    })
                  }
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <span
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    marginLeft: '8px',
                    marginRight: 'auto',
                  }}
                >
                  {todo.text}
                </span>
                <button onClick={() => dispatch({ type: 'START_EDIT', payload: todo.id })}>
                  Edit
                </button>
                <button
                  onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
                  disabled={!todo.completed}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
