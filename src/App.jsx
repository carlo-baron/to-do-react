import { useState } from 'react'
import './App.css'

function Form({title, content, setTitle, setContent, onSubmit}){
    return (
        <>
            <form onSubmit={onSubmit}> 
                <label htmlFor="title">Title: </label>
                <input type="text" name="title" value={title} onChange={(e)=>setTitle(e.target.value)} required/>
                <label htmlFor="content">Content: </label>
                <input type="text" name="content" value={content} onChange={(e)=>setContent(e.target.value)}required/>
                <input type="submit" value="submit" />
            </form>
        </>
    );
}

function App(){
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tasks, setTasks] = useState([]);
    const [taskId, setTaskId] = useState(0);

    function submitForm(e){
        e.preventDefault();
        setTasks((prev) => [...prev, {taskId, title, content}]);       
        setTaskId(prevId => prevId + 1);
        setTitle("");
        setContent("");
    }

    function handleDelete(key){
        const newTasks = tasks.filter(task => task.taskId !== key);
        setTasks(newTasks);
    }

    const task = tasks.length > 0 ? (
    <ol>
        {tasks.map((task)=>{
            const summary = task.title + ", " + task.content; 
            return (
                    <li key={task.taskId}>
                        <p>{summary}</p>
                        <button onClick={()=>handleDelete(task.taskId)}>Delete</button>
                    </li>
            );
        })}
    </ol>
    ) : (
        <p>No Task Yet</p>
    );


    return (
        <>
            <Form
                title={title}
                content={content}
                setTitle={setTitle} 
                setContent={setContent}
                onSubmit={submitForm}
            />
            {task}
        </>
    );
}

export default App; 
