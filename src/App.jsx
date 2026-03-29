import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Habits from './pages/Habits';
import JapaneseLearning from './pages/JapaneseLearning';
import StudyLog from './pages/StudyLog';
import MYTrace from './pages/MYTrace';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import TodoList from './pages/TodoList';
import Music from './pages/Music';
import PublicProfile from './pages/PublicProfile';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/lifeosapp">
        <Routes>
          <Route element={<DashboardLayout><Dashboard /></DashboardLayout>} path="/" />
          <Route element={<DashboardLayout><Tasks /></DashboardLayout>} path="/tasks" />
          <Route element={<DashboardLayout><Habits /></DashboardLayout>} path="/habits" />
          <Route element={<DashboardLayout><JapaneseLearning /></DashboardLayout>} path="/japanese-learning" />
          <Route element={<DashboardLayout><StudyLog /></DashboardLayout>} path="/study-log" />
          <Route element={<DashboardLayout><MYTrace /></DashboardLayout>} path="/mytrace" />
          <Route element={<DashboardLayout><Goals /></DashboardLayout>} path="/goals" />
          <Route element={<DashboardLayout><Analytics /></DashboardLayout>} path="/analytics" />
          <Route element={<DashboardLayout><TodoList /></DashboardLayout>} path="/todo" />
          <Route element={<DashboardLayout><Music /></DashboardLayout>} path="/music" />
          <Route element={<PublicProfile />} path="/public" />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
