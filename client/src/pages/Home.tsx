import styles from '../assets/Home.module.css' 
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';

const server: string = "http://localhost:5000";

type FormProps = {
    title: string;
    content: string;
    setTitle: (val: string)=> void;
    setContent: (val: string)=> void;
    editKey: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>)=> void;
    submitMode: string;
    onCancel: () => void;
};

type Task = {
    _id: string;
    title: string;
    content: string;
}

function Form({title, 
               content,
               setTitle, 
               setContent, 
               onSubmit, 
               submitMode,
               onCancel
              }: FormProps): React.ReactElement{
    return (
        <>
            <form onSubmit={onSubmit} className={styles.form}> 
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
                <input type="button" value="Cancel" onClick={onCancel}/>
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
        <h2 className={styles.header}>{mode}</h2>
    );
}

function Home(): React.ReactElement{
    const [title, setTitle] = useState<string>("");
    const [content, setContent] = useState<string>("");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [currentMode, setCurrentMode] = useState<string>(HeaderModes.Normal);
    const [submitMode, setSubmitMode] = useState<string>(SubmitModes.Normal);
    const [editKey, setEditKey] = useState<string>("");
    const navigate = useNavigate();
    const { taskId } = useParams();

    useEffect(() => {
        fetch(`${server}/api/tasks`)
            .then(res => res.json())
            .then(data => {
                setTasks(data);
            })
            .catch(err => console.error(err));

    }, []);

    useEffect(() => {
        if(taskId && tasks.length > 0){
            editTask(taskId);
        }
    }, [taskId, tasks]);

    function submitForm(e: React.FormEvent<HTMLFormElement>): void{
        e.preventDefault();

        if(editKey !== ""){
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

        resetFormState();
    }

    function resetFormState(){
        navigate('/');taskId
        setCurrentMode(HeaderModes.Normal);
        setSubmitMode(SubmitModes.Normal);
        setTitle("");
        setContent("");
        setEditKey("");
    }

    function editTask(key: string): void{
        setCurrentMode(HeaderModes.Edit);
        setSubmitMode(SubmitModes.Edit);

        const task = tasks.find(task => task._id === key);
        if(!task) return;
        setEditKey(key);
        setTitle(task.title);
        setContent(task.content);
    }

    function handleDelete(key: string): void{
        fetch(`${server}/api/tasks/${key}`, {
            method: "DELETE",
        })
        .then(() => setTasks(prev => prev.filter(task => task._id !== key)));
    }

    const task = tasks.length > 0 ? (
    <ol className={styles.ol}>
        {tasks.slice(0, 3).map((task)=>{
            return (
                <li key={task._id} className={styles.list}>
                    <p className={styles.item}>{task.title}</p>
                    <button onClick={()=>navigate(`/tasks/${task._id}`)}>Open</button>
                    <button onClick={()=>editTask(task._id)}>Edit</button>
                    <button onClick={()=>handleDelete(task._id)}>Delete</button>
                </li>
            );
        })}
        {tasks.length > 3 ? (<p className={styles.item}>...</p>) : (<p></p>)}
    </ol>
    ) : (
        <p>No Task Yet</p>
    );

    return (
        <div className={styles.main}>
            <Mode mode={currentMode}/>
            <Form
                title={title}
                content={content}
                setTitle={setTitle} 
                setContent={setContent}
                editKey={editKey}
                onSubmit={submitForm}
                submitMode={submitMode}
                onCancel={resetFormState}
            />
            <button onClick={() => navigate("/tasks")}>View All Tasks</button>
            {task}
        </div>
    );
}

export default Home; 
