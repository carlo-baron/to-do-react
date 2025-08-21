import { Routes, Route } from 'react-router';
import './assets/App.css'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import TaskView from './pages/TaskView'


export default function App(){
    return(
        <Routes>
            <Route path="/">
                <Route index element={<Home />} />
                <Route path="edit/:taskId" element={<Home />} />

            </Route>
            <Route path="tasks">
                <Route index element={<Tasks />} />
                <Route path=":taskId" element={<TaskView />} />
            </Route>
        </Routes>
    );
}
