import React from "react";

export default function About() {
  const version = "1.0.0";

  return (
    <div className="my-5">
      <h2>About TaskMaster</h2>
      <p>
        TaskMaster is a professional task management application built with
        React. It helps you stay organized and productive by allowing you to:
      </p>
      <ul>
        <li>Add, edit, and delete tasks</li>
        <li>Mark tasks as completed or pending</li>
        <li>Search tasks quickly</li>
        <li>Filter tasks by status: all, completed, or pending</li>
      </ul>
      <p className="my-4">Key features of TaskMaster include:</p>
      <ul>
        <li>LocalStorage persistence for all tasks</li>
        <li>Toast notifications for task actions</li>
        <li>Priority badges (High/Medium/Low)</li>
        <li>Dark/Light mode toggle</li>
        <li>Drag & drop reordering of tasks</li>
        <li>Responsive design for all devices</li>
        <li>Clean, modern UI for enhanced productivity</li>
        <strong>Version = {version}</strong>
      </ul>
      <p>
        TaskMaster ensures a seamless workflow and keeps your daily tasks
        organized, visually appealing, and easy to manage.
      </p>
    </div>
  );
}
