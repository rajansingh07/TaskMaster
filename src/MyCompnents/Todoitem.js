import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Todoitem({ todo, onDelete, onComplete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(todo.title);
  const [newDesc, setNewDesc] = useState(todo.desc);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!todo) return null;

  const todoContent = (
    <>
      <h4
        className="ms-5"
        style={{ textDecoration: todo.completed ? "line-through" : "none" }}
      >
        {todo.title}
        {todo.priority && (
          <span
            className={`badge ms-2 ${
              todo.priority === "High"
                ? "bg-danger"
                : todo.priority === "Medium"
                ? "bg-warning text-dark"
                : "bg-primary"
            }`}
          >
            {todo.priority}
          </span>
        )}
      </h4>
      <p className="ms-5">{todo.desc}</p>
      {todo.date && (
        <small className="text-muted ms-5">Added: {todo.date}</small>
      )}
      <br />
      <button
        className="btn btn-sm btn-success ms-5 mt-2"
        onClick={() => onComplete(todo)}
        disabled={todo.completed}
      >
        {todo.completed ? "Completed ✅" : "Mark as Completed"}
      </button>
      <button
        className="btn btn-sm btn-danger ms-3 mt-2"
        onClick={() => onDelete(todo)}
      >
        Delete
      </button>
      <button
        className="btn btn-sm btn-warning ms-3 mt-2"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>
      <hr />
    </>
  );

  const editingContent = (
    <div className="ms-5">
      <input
        type="text"
        className="form-control mb-2"
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
      />
      <input
        type="text"
        className="form-control mb-2"
        value={newDesc}
        onChange={(e) => setNewDesc(e.target.value)}
      />
      <button
        className="btn btn-sm btn-success me-2"
        onClick={() => {
          onEdit(todo.sno, newTitle, newDesc);
          setIsEditing(false);
        }}
      >
        Save
      </button>
      <button
        className="btn btn-sm btn-secondary"
        onClick={() => setIsEditing(false)}
      >
        Cancel
      </button>
    </div>
  );

  return isLargeScreen ? (
    <motion.div
      className="my-3"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {isEditing ? editingContent : todoContent}
    </motion.div>
  ) : (
    <div className="my-3">{isEditing ? editingContent : todoContent}</div>
  );
}
