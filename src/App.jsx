import { useState } from 'react'
import './App.css'

function Form({title, 
               content,
               setTitle, 
               setContent, 
               editKey,
               onSubmit, 
               submitMode
              }){
    return (
        <>
            <form onSubmit={onSubmit}> 
                <input type="number" value={editKey} hidden/>
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
};

const SubmitModes = {
    Normal: "Submit",
    Edit: "Edit" 
}

function Mode({mode}){
    return (
        <h2>{mode}</h2>
    );
}

function App(){
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [tasks, setTasks] = useState([]);
    const [taskId, setTaskId] = useState(1);
    const [currentMode, setCurrentMode] = useState(HeaderModes.Normal);
    const [submitMode, setSubmitMode] = useState(SubmitModes.Normal);
    const [editKey, setEditKey] = useState(0);

    function submitForm(e){
        e.preventDefault();

        if(editKey !== 0){
            const taskIndex = tasks.findIndex(task => task.taskId === editKey); 
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

    function editTask(key){
        setCurrentMode(HeaderModes.Edit);
        setSubmitMode(SubmitModes.Edit);

        const task = tasks.filter(task => task.taskId === key);
        setEditKey(key);
        setTitle(task[0].title);
        setContent(task[0].content);
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
