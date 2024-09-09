import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

// Definir la interfaz del tipo de datos
type Task = {
    id: number;
    task: string;
    user_id: string;
    created_at: string;
};

// Definir la interfaz para el estado global
interface TaskState {
    tasks: Task[];
    fetchTasks: () => Promise<void>;
    addTask: (task: string) => Promise<void>;
    deleteTask: (id: number) => Promise<void>;
    editTask: (id: number, newTask: string) => Promise<void>;
}

// Crear el store de Zustand
export const useTaskStore = create<TaskState>((set) => ({
    tasks: [],

    fetchTasks: async () => {
        const { data, error } = await supabase.from('todos').select('*');

        if (error) {
            console.error('Error fetching tasks:', error);
            return;
        }

        set({ tasks: data || [] });
    },

    addTask: async (task: string) => {
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData.user) {
            console.error('Error fetching user:', userError);
            return;
        }

        const { data, error } = await supabase
            .from('todos')
            .insert([{ task, user_id: userData.user.id }]);

        if (error) {
            console.error('Error adding task:', error);
            return;
        }

        set((state) => ({ tasks: [...state.tasks, ...(data || [])] }));
    },

    deleteTask: async (id: number) => {
        const { error } = await supabase.from('todos').delete().eq('id', id);

        if (error) {
            console.error('Error deleting task:', error);
            return;
        }

        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
        }));
    },

    editTask: async (id: number, newTask: string) => {
        const { error } = await supabase.from('todos').update({ task: newTask }).eq('id', id);

        if (error) {
            console.error('Error editing task:', error);
            return;
        }

        set((state) => ({
            tasks: state.tasks.map((task) => (task.id === id ? { ...task, task: newTask } : task)),
        }));
    },
}));
