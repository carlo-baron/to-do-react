import { useState } from 'react'

import './App.css'

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
    taskId: number;
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
    const [taskId, setTaskId] = useState<number>(1);
    const [currentMode, setCurrentMode] = useState<string>(HeaderModes.Normal);
    const [submitMode, setSubmitMode] = useState<string>(SubmitModes.Normal);
    const [editKey, setEditKey] = useState<number>(0);

    function submitForm(e: React.FormEvent<HTMLFormElement>): void{
        e.preventDefault();

        if(editKey !== 0){
            const taskIndex: number = tasks.findIndex(task => task.taskId === editKey); 
            const newTasks = [...tasks];
            newTasks[taskIndex].title = title;
            newTasks[taskIndex].content = content;
            setTasks(newTasks);
        }else{
            setTasks((prev) => [...prev, {taskId, title, content}]);       
            setTaskId(prevId => prevId + 1);
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

        const task = tasks.find(task => task.taskId === key);
        if(!task) return;
        setEditKey(key);
        setTitle(task.title);
        setContent(task.content);
    }

    function handleDelete(key: number): void{
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
                    <button onClick={()=>editTask(task.taskId)}>Edit</button>
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
