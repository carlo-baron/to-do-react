import { useState } from 'react';
import { useEffect } from 'react';
import './App.css'

const server: string = "http://localhost:5000";

type FormProps = {
    title: string;
    content: string;
    setTitle: (val: string)=> void;
    setContent: (val: string)=> void;
    editKey: number;
    onSubmit: (e: React.FormEvent<HTMLFormElement>)=> void;
    submitMode: string;
};

type Task = {
    _id: number;
    title: string;
    content: string;
}

function Form({title, 
               content,
               setTitle, 
               setContent, 
               onSubmit, 
               submitMode
              }: FormProps): React.ReactElement{
    return (
        <>
            <form onSubmit={onSubmit}> 
                <label htmlFor="title">Title: </label>
                <input type="text"
                       name="title"
                       value={title}
                       onChange={(e)=>setTitle(e.target.value)} required/>
                <label htmlFor="content">Content: </label>
                <input type="text"
                       name="content"
                       value={content}
                       onChange={(e)=>setContent(e.target.value)}required/>
                <input type="submit" value={submitMode} />
            </form>
        </>
    );
}

//enums
const HeaderModes = {
    Normal: 'Add Task',
    Edit: 'Edit Task'
} as const;

const SubmitModes = {
    Normal: "Submit",
    Edit: "Edit" 
} as const;

function Mode({mode}: {mode: string}): React.ReactElement{
    return (
        <h2>{mode}</h2>
    );
}

function App(): React.ReactElement{
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentMode, setCurrentMode] = useState<string>(HeaderModes.Normal);
    const [submitMode, setSubmitMode] = useState<string>(SubmitModes.Normal);
    const [editKey, setEditKey] = useState<number>(0);

    useEffect(() => {
        fetch(`${server}/api/tasks`)
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error(err));
    }, []);

    function submitForm(e: React.FormEvent<HTMLFormElement>): void{
        e.preventDefault();

        if(editKey !== 0){
            fetch(`${server}/api/tasks/${editKey}`,{
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, content})
            })
            .then(res => res.json())
            .then(updatedTask => {
                setTasks(prev => prev.map(task => task._id === updatedTask._id ? updatedTask : task));
            });
        }else{
            fetch(`${server}/api/tasks`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({title, content})
            })
            .then(res => res.json()
            .then(createdTask => {
                setTasks((prev) => [...prev, createdTask]);       
            }));
        }

        setCurrentMode(HeaderModes.Normal);
        setSubmitMode(SubmitModes.Normal);
        setTitle("");
        setContent("");
        setEditKey(0);
    }

    function editTask(key: number): void{
        setCurrentMode(HeaderModes.Edit);
        setSubmitMode(SubmitModes.Edit);

        const task = tasks.find(task => task._id === key);
        if(!task) return;
        setEditKey(key);
        setTitle(task.title);
        setContent(task.content);
    }

    function handleDelete(key: number): void{
        fetch(`${server}/api/tasks/${key}`, {
            method: "DELETE",
        })
        .then(() => setTasks(prev => prev.filter(task => task._id !== key)));
    }

    const task = tasks.length > 0 ? (
    <ol>
        {tasks.map((task)=>{
            const summary = task.title + ", " + task.content; 
            return (
                <li key={task._id}>
                    <p>{summary}</p>
                    <button onClick={()=>editTask(task._id)}>Edit</button>
                    <button onClick={()=>handleDelete(task._id)}>Delete</button>
                </li>
            );
        })}
    </ol>
    ) : (
        <p>No Task Yet</p>
    );

    return (
        <>
            <Mode mode={currentMode}/>
            <Form
                title={title}
                content={content}
                setTitle={setTitle} 
                setContent={setContent}
                editKey={editKey}
                onSubmit={submitForm}
                submitMode={submitMode}
            />
            {task}
        </>
    );
}

export default App; 
