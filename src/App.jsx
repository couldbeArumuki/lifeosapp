import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Habits from './pages/Habits';
import JapaneseLearning from './pages/JapaneseLearning';
import StudyLog from './pages/StudyLog';
import Trackers from './pages/Trackers';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import PublicProfile from './pages/PublicProfile';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<DashboardLayout><Dashboard /></DashboardLayout>} path="/" />
          <Route element={<DashboardLayout><Tasks /></DashboardLayout>} path="/tasks" />
          <Route element={<DashboardLayout><Habits /></DashboardLayout>} path="/habits" />
          <Route element={<DashboardLayout><JapaneseLearning /></DashboardLayout>} path="/japanese-learning" />
          <Route element={<DashboardLayout><StudyLog /></DashboardLayout>} path="/study-log" />
          <Route element={<DashboardLayout><Trackers /></DashboardLayout>} path="/trackers" />
          <Route element={<DashboardLayout><Goals /></DashboardLayout>} path="/goals" />
          <Route element={<DashboardLayout><Analytics /></DashboardLayout>} path="/analytics" />
          <Route element={<DashboardLayout><PublicProfile /></DashboardLayout>} path="/public" />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
