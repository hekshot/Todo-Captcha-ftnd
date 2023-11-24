import React, { useState, useEffect } from "react";
import axios from "axios";
import "../TodoList.css";
import { useLocation } from "react-router-dom";

export default function Todo() {

  //const userId= 11;

  const location = useLocation();
  const userId  = location.state.userId;
  const [task, setTask] = useState("");
  const [existingTasks, setExistingTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState("");

  useEffect(() => {
    console.log("UserId:", userId);
    axios
      .get(`http://localhost:8080/users/${userId}`)
      .then((response) => {
        //setUser(response.data);
        setExistingTasks(response.data.todoList);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userId]);

  const handleAddTask = () => {
    if (task) {
      axios
        .post(`http://localhost:8080/users/${userId}/todos`, {
          tasks: task,
          completed: false,
        })
        .then((response) => {
          const newTask = response.data;
          setExistingTasks((prevTasks) => [...prevTasks, newTask]);
          window.location.reload();
          setTask("");
        })
        .catch((error) => {
          console.error("Error adding task:", error);
        });
    }
  };

  const handleDeleteTask = (taskId) => {
    axios
      .delete(`http://localhost:8080/users/${userId}/todos/${taskId}`)
      .then(() => {
        setExistingTasks(existingTasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  const handleEditTask = (taskId, taskText) => {
    setEditedTaskText(taskText);
    setEditingTask(taskId);
  };

  const handleSaveTask = (taskId, newTask, completed) => {
    axios
      .put(`http://localhost:8080/users/${userId}/todos/${taskId}`, {
        tasks: newTask,
        completed,
      })
      .then((response) => {
        setEditingTask(null);
        setExistingTasks(
          existingTasks.map((task) =>
            task.id === taskId ? { ...task, tasks: newTask, completed } : task
          )
        );
      })
      .catch((error) => {
        console.error("Error editing task:", error);
      });
  };

  const handleToggleCompleted = (taskId) => {
    const taskToUpdate = existingTasks.find((task) => task.id === taskId);
    const updatedCompleted = !taskToUpdate.completed;

    axios
      .put(`http://localhost:8080/users/${userId}/todos/${taskId}`, {
        tasks: taskToUpdate.tasks,
        completed: updatedCompleted,
      })
      .then((response) => {
        setEditingTask(null);
        setExistingTasks(
          existingTasks.map((task) =>
            task.id === taskId ? { ...task, completed: updatedCompleted } : task
          )
        );
      })
      .catch((error) => {
        console.error("Error updating task status:", error);
      });
  };

  return (
    <div className="todo-list-container">
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <button onClick={handleAddTask}>Add Task</button>
      </div>
      <ol className="task-list">
        {existingTasks.map((task) => (
          <li
            className={`task-item ${task.completed ? "completed" : ""}`}
            key={task.id}
          >
            {task.id === editingTask ? (
              <>
                <input
                  className="task-input"
                  type="text"
                  value={editedTaskText}
                  onChange={(e) => setEditedTaskText(e.target.value)}
                />
                <button
                  onClick={() =>
                    handleSaveTask(task.id, editedTaskText, task.completed)
                  }
                >
                  Save
                </button>
              </>
            ) : (
              <div>
                <span>{task.tasks}</span>
                <div className="task-buttons">
                  <button
                    onClick={() => handleEditTask(task.id, task.tasks)}
                    className="edit-button"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleCompleted(task.id)}
                    className="toggle-button"
                  >
                    {task.completed ? "Mark Uncompleted" : "Mark Completed"}
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
