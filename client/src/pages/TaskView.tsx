import { useParams } from 'react-router'
import { useEffect, useState } from 'react'

const server: string = "http://localhost:5000";

type Task = {
    _id: string;
    title: string;
    content: string;
}

export default function TaskView(){
    const { taskId } = useParams();
    const [task, setTask] = useState<Task>();

    useEffect(() => {
        fetch(`${server}/api/tasks/${taskId}`)
            .then(res => res.json())
            .then(data => setTask(data))
            .catch(error => console.error(error));
    }, [taskId]);

    if(!task) return <h1>Task not found.</h1>

    return (
        <>
            <h1>{task.title}</h1>
            <p>{task.content}</p>
        </>
    ); 
}
