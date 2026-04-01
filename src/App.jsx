import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import DashboardLayout from './layouts/DashboardLayout';
import LoadingSpinner from './components/LoadingSpinner';
import ClickEffect from './components/ClickEffect';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Habits = lazy(() => import('./pages/Habits'));
const JapaneseLearning = lazy(() => import('./pages/JapaneseLearning'));
const StudyLog = lazy(() => import('./pages/StudyLog'));
const Trackers = lazy(() => import('./pages/Trackers'));
const Goals = lazy(() => import('./pages/Goals'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Music = lazy(() => import('./pages/Music'));
const MYJapanPlans = lazy(() => import('./pages/MYJapanPlans'));
const Recap = lazy(() => import('./pages/Recap'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <LoadingSpinner />
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <ClickEffect />
      <BrowserRouter basename="/lifeosapp">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route element={<DashboardLayout><Dashboard /></DashboardLayout>} path="/" />
            <Route element={<DashboardLayout><Tasks /></DashboardLayout>} path="/tasks" />
            <Route element={<DashboardLayout><Habits /></DashboardLayout>} path="/habits" />
            <Route element={<DashboardLayout><JapaneseLearning /></DashboardLayout>} path="/japanese-learning" />
            <Route element={<DashboardLayout><StudyLog /></DashboardLayout>} path="/study-log" />
            <Route element={<DashboardLayout><Trackers /></DashboardLayout>} path="/trackers" />
            <Route element={<DashboardLayout><Goals /></DashboardLayout>} path="/goals" />
            <Route element={<DashboardLayout><Analytics /></DashboardLayout>} path="/analytics" />
            <Route element={<DashboardLayout><Music /></DashboardLayout>} path="/music" />
            <Route element={<DashboardLayout><MYJapanPlans /></DashboardLayout>} path="/myjapan-plans" />
            <Route element={<Recap />} path="/recap" />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
