import React from "react";
import Todoitem from "../MyCompnents/Todoitem";

const Todos = ({ todos, onDelete, onComplete, onEdit }) => {
  return (
    <div className="Container">
      <h3 className="text-center my-3">Todos List</h3>
      {todos.length === 0 ? (
        <p className="text-center my-3">No todos available</p>
      ) : (
        todos.map((todo) => (
          <Todoitem
            key={todo.sno}
            todo={todo}
            onDelete={onDelete}
            onComplete={onComplete}
            onEdit={onEdit}
          />
        ))
      )}
    </div>
  );
};

export default Todos;
