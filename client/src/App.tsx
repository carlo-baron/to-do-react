import { Routes, Route } from 'react-router';
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import TaskView from './pages/TaskView'


export default function App(){
    return(
        <Routes>
            <Route index element={<Home />} />
            <Route path="tasks">
                <Route index element={<Tasks />} />
                <Route path=":taskId" element={<TaskView />} />
            </Route>
        </Routes>
    );
}
