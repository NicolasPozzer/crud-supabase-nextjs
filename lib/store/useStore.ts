import { create } from 'zustand';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

// Definir la interfaz del tipo de datos
type Task = {
    id: number;
    task: string;
    user_id: string;
    created_at: string;
}

// Definir la interfaz para el estado global
interface TaskState {
    tasks: Task[];
    fetchTasks: () => Promise<void>;
    addTask: (task: string) => Promise<void>;
    deleteTask: (id: number) => Promise<void>;
}

// Crear el store de Zustand
export const useStore = create<TaskState>((set) => ({
    tasks: [],

    fetchTasks: async () => {
        const { data, error } = await supabase
            .from('todos')
            .select('*');

        if (error) {
            console.error('Error fetching tasks:', error);
            return;
        }

        set({ tasks: data || [] });
    },

    addTask: async (task: string) => {
        // Obtener el usuario autenticado
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData.user) {
            console.error('Error fetching user:', userError);
            return;
        }

        // Insertar la tarea con el user_id del usuario autenticado
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
        const { error } = await supabase
            .from('todos')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting task:', error);
            return;
        }

        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
        }));
    },
}));
