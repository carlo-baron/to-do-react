import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';

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

    const task = tasks.length > 0 ? (
    <ol>
        {tasks.map((task)=>{
            return (
                <li key={task._id}>
                    <p>{task.title}</p>
                    <button onClick={()=>navigate("/")}>Open</button>
                    <button onClick={()=>navigate("/")}>Edit</button>
                    <button onClick={()=>navigate("/")}>Delete</button>
                </li>
            );
        })}
    </ol>
    ) : (
        <p>No Task Yet</p>
    );
    return (
        <div>
            {task}
        </div>
    ); 
}
