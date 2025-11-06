import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import Header from "./MyCompnents/Header";
import Footer from "./MyCompnents/Footer";
import Todos from "./MyCompnents/Todos";
import AddTodo from "./MyCompnents/AddTodo";
import About from "./MyCompnents/About";

function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);
  }, []);

  const addTodo = (title, desc, priority = "Low") => {
    const sno = todos.length > 0 ? todos[todos.length - 1].sno + 1 : 1;
    const newTodo = {
      sno,
      title,
      desc,
      priority,
      completed: false,
      date: new Date().toLocaleString(),
    };
    setTodos([...todos, newTodo]);
    toast.success("Todo added successfully!");
  };

  const onDelete = (todo) => {
    setTodos(todos.filter((e) => e.sno !== todo.sno));
    toast.error("Todo deleted!");
  };

  const onComplete = (todo) => {
    setTodos(
      todos.map((e) =>
        e.sno === todo.sno ? { ...e, completed: !e.completed } : e
      )
    );
    toast.info(
      todo.completed ? "Marked as pending!" : "Task marked as completed!"
    );
  };

  const onEdit = (sno, newTitle, newDesc, newPriority) => {
    setTodos(
      todos.map((todo) =>
        todo.sno === sno
          ? { ...todo, title: newTitle, desc: newDesc, priority: newPriority }
          : todo
      )
    );
    toast.success("Todo updated!");
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
    toast.warning("All completed todos cleared!");
  };

  const exportTodos = () => {
    const dataStr = JSON.stringify(todos, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "todos_backup.json";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Todos exported!");
  };

  const importTodos = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          setTodos(imported);
          toast.success("Todos imported successfully!");
        } else {
          toast.error("Invalid JSON file!");
        }
      } catch {
        toast.error("Failed to import!");
      }
    };
    reader.readAsText(file);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  const searchedTodos = filteredTodos.filter(
    (todo) =>
      todo.title.toLowerCase().includes(search.toLowerCase()) ||
      todo.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      <Header />
      <div className="container my-3">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div className="row mb-3">
                  <div className="col-12 col-md-6 mb-2 mb-md-0">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search todos..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="col-12 col-md-6 d-flex flex-wrap justify-content-start gap-2">
                    <button
                      className={`btn btn-outline-primary ${
                        filter === "all" ? "active" : ""
                      }`}
                      onClick={() => setFilter("all")}
                    >
                      All
                    </button>
                    <button
                      className={`btn btn-outline-success ${
                        filter === "completed" ? "active" : ""
                      }`}
                      onClick={() => setFilter("completed")}
                    >
                      Completed
                    </button>
                    <button
                      className={`btn btn-outline-warning ${
                        filter === "pending" ? "active" : ""
                      }`}
                      onClick={() => setFilter("pending")}
                    >
                      Pending
                    </button>
                    <button className="btn btn-danger" onClick={clearCompleted}>
                      Clear Completed
                    </button>
                    <button className="btn btn-secondary" onClick={exportTodos}>
                      Export JSON
                    </button>
                    <label className="btn btn-secondary mb-0">
                      Import JSON
                      <input
                        type="file"
                        accept="application/json"
                        onChange={importTodos}
                        hidden
                      />
                    </label>
                  </div>
                </div>
                <motion.div layout>
                  <Todos
                    todos={searchedTodos}
                    onDelete={onDelete}
                    onComplete={onComplete}
                    onEdit={onEdit}
                  />
                </motion.div>
              </>
            }
          />
          <Route path="/add-todo" element={<AddTodo addTodo={addTodo} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
      <Footer />
    </div>
  );
}

export default App;
