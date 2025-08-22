import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import homeStyles from '../assets/Home.module.css'
import { TaskList } from './Home';

const server: string = "http://localhost:5000";

type Task = {
    _id: number;
    title: string;
    content: string;
}

export default function Tasks(){
    const [tasks, setTasks] = useState<Task[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${server}/api/tasks`)
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error(err));
    }, []);

    function onEdit(key: string){
        navigate(`/edit/${key}`);
    }

    function onDelete(key: string){
        fetch(`${server}/api/tasks/${key}`, {
            method: 'DELETE'
        }).then(() =>
            setTasks((prev) => prev.filter((task) => task._id !== key))
        );
    }

    return (
        <div>
            <TaskList
                tasks={tasks}
                onEdit={onEdit}
                onDelete={onDelete}
                navigate={navigate}
                limit={tasks.length}
            />
        </div>
    ); 
}
