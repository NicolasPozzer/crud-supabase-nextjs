"use client";
import { useEffect, useState } from 'react';
import { useTaskStore } from '@/lib/store/useTaskStore';

export default function Todos() {
    const tasks = useTaskStore((state) => state.tasks);
    const fetchTasks = useTaskStore((state) => state.fetchTasks);
    const addTask = useTaskStore((state) => state.addTask);
    const deleteTask = useTaskStore((state) => state.deleteTask);
    const editTask = useTaskStore((state) => state.editTask);

    const [newTask, setNewTask] = useState<string>('');
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editTaskValue, setEditTaskValue] = useState<string>('');

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleAddTask = async () => {
        if (newTask.trim()) {
            await addTask(newTask);
            setNewTask('');
            fetchTasks(); //recargar luego de agregar una tarea
        }
    };

    const handleEditTask = async (id: number) => {
        if (editTaskValue.trim()) {
            await editTask(id, editTaskValue);
            setEditingTaskId(null);
            setEditTaskValue('');
        }
    };

    const startEditingTask = (taskId: number, taskValue: string) => {
        setEditingTaskId(taskId);
        setEditTaskValue(taskValue);
    };

    return (
        <div>
            <h1>Your Tasks</h1>
            <div className="flex space-x-2 mb-4">
                <input
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    placeholder="New task"
                    className="border p-2"
                />
                <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 py-2 rounded">Add Task</button>
            </div>

            <ul className="p-10">
                {tasks.map((task) => (
                    <li className="flex items-center space-x-4 mb-2" key={task.id}>
                        {editingTaskId === task.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editTaskValue}
                                    onChange={(e) => setEditTaskValue(e.target.value)}
                                    placeholder="Edit task"
                                    className="border p-2"
                                />
                                <button onClick={() => handleEditTask(task.id)} className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
                                <button onClick={() => setEditingTaskId(null)} className="bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
                            </>
                        ) : (
                            <div className="flex w-full items-center justify-between">
                                <span>{task.task}</span>
                                <div className="flex space-x-2">
                                    <button onClick={() => startEditingTask(task.id, task.task)} className="bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
                                    <button onClick={() => deleteTask(task.id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
