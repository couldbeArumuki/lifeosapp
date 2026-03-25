import { useState } from 'react';
import Card from '../components/Card';
import { getData, initializeData } from '../utils/localStorage';
import { allMockData, mockWeeklyData } from '../data/mockData';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#6B9BD1', '#B19CD9', '#7EC8A3', '#F4A6C1'];

const Analytics = () => {
  const [studyLog] = useState(() => { initializeData(allMockData); return getData('studyLog', []); });
  const [moodLog] = useState(() => getData('moodLog', []));
  const [sleepLog] = useState(() => getData('sleepLog', []));

  const subjectData = studyLog.reduce((acc, s) => {
    const found = acc.find(a => a.name === s.subject);
    if (found) found.value += s.duration;
    else acc.push({ name: s.subject, value: s.duration });
    return acc;
  }, []);

  const sleepData = sleepLog.slice().reverse().map(s => ({ date: s.date.slice(5), hours: s.duration, quality: s.quality }));
  const moodData = moodLog.slice().reverse().map(m => ({ date: m.date.slice(5), intensity: m.intensity }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Your progress at a glance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-heading font-semibold mb-4 text-text-dark dark:text-text-light">Study by Subject</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={subjectData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {subjectData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip formatter={v => `${v} min`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-heading font-semibold mb-4 text-text-dark dark:text-text-light">Sleep Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sleepData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="hours" stroke="#6B9BD1" strokeWidth={2} dot={{ fill: '#6B9BD1', r: 3 }} />
              <Line type="monotone" dataKey="quality" stroke="#B19CD9" strokeWidth={2} dot={{ fill: '#B19CD9', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-heading font-semibold mb-4 text-text-dark dark:text-text-light">Mood Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={moodData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 5]} />
              <Tooltip />
              <Bar dataKey="intensity" fill="#7EC8A3" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-heading font-semibold mb-4 text-text-dark dark:text-text-light">Weekly Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockWeeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="study" fill="#6B9BD1" radius={[4, 4, 0, 0]} name="Study (h)" />
              <Bar dataKey="tasks" fill="#B19CD9" radius={[4, 4, 0, 0]} name="Tasks" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
