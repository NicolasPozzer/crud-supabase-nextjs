"use client"
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/store/useStore';

export default function Todos() {
    const { tasks, fetchTasks, addTask, deleteTask } = useStore();
    const [newTask, setNewTask] = useState<string>('');

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    const handleAddTask = async () => {
        if (newTask.trim()) {
            await addTask(newTask);
            setNewTask('');
            await fetchTasks(); // Recargar luego de agregar
        }
    };


    const handleDeleteTask = async (id: number) => {
        await deleteTask(id);
    };

    return (
        <div>
            <h1>Your Tasks</h1>
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="New task"
            />
            <button onClick={handleAddTask}>Add Task</button>

            <ul className='p-10'>
                {tasks.map((task) => (
                    <li className='flex'
                        key={task.id}>

                        <div className='mx-auto'>
                            {task.task}
                        </div>
                        <button
                            onClick={() => handleDeleteTask(task.id)}>Delete
                        </button>


                    </li>
                ))}
            </ul>
        </div>
    );
}
