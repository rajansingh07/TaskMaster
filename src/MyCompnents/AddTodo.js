import React, { useState } from "react";

export default function AddTodo({ addTodo }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("Low");

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Title cannot be blank");
      return;
    }
    addTodo(title, desc, priority);
    setTitle("");
    setDesc("");
    setPriority("Low");
  };

  return (
    <div className="container my-3">
      <h4>Add a Todo</h4>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label className="form-label">Todo Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
            placeholder="Enter title"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description </label>
          <input
            type="text"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="form-control"
            placeholder="Enter description"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="form-select"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Todo
        </button>
      </form>
    </div>
  );
}
