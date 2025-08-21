import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import homeStyles from '../assets/Home.module.css'

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
    <ol className={homeStyles.ol}>
        {tasks.map((task)=>{
            return (
                <li className={homeStyles.list} key={task._id}>
                    <p className={homeStyles.item}>{task.title}</p>
                    <button onClick={()=>navigate(`/tasks/${task._id}`)}>Open</button>
                    <button onClick={()=>navigate(`/edit/${task._id}`)}>Edit</button>
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
