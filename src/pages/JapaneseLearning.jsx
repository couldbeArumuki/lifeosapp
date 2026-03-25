import { useState } from 'react';
import { Plus, Star, BookOpen, TrendingUp } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { getData, initializeData } from '../utils/localStorage';
import { allMockData } from '../data/mockData';

const JapaneseLearning = () => {
  const [data] = useState(() => { initializeData(allMockData); return getData('japanese', null); });
  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-text-dark dark:text-text-light">Japanese Learning</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">JLPT {data.currentLevel} Journey</p>
        </div>
        <Button variant="primary"><Plus size={16}/> Add Vocab</Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'JLPT Level', value: data.currentLevel, icon: Star, color: 'text-primary' },
          { label: 'Total Vocab', value: data.totalVocab, icon: BookOpen, color: 'text-secondary' },
          { label: 'Total Kanji', value: data.totalKanji, icon: TrendingUp, color: 'text-accent' },
          { label: 'Weekly Goal', value: `${data.weeklyProgress}/${data.weeklyGoal}`, icon: TrendingUp, color: 'text-tertiary' },
        ].map(({ label, value, color }) => (
          <Card key={label}>
            <p className="text-xs text-gray-400">{label}</p>
            <p className={`text-2xl font-bold font-mono mt-1 ${color}`}>{value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <h3 className="font-heading font-semibold mb-4 text-text-dark dark:text-text-light">Vocabulary</h3>
          <div className="space-y-3">
            {data.vocabulary.map(v => (
              <div key={v.id} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-white/5">
                <div>
                  <p className="font-mono text-lg text-text-dark dark:text-text-light">{v.word}</p>
                  <p className="text-xs text-gray-400">{v.reading} — {v.meaning}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge color="blue">{v.jlptLevel}</Badge>
                  {v.learned && <Badge color="green">✓</Badge>}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-heading font-semibold mb-4 text-text-dark dark:text-text-light">Kanji</h3>
          <div className="grid grid-cols-3 gap-3">
            {data.kanji.map(k => (
              <div key={k.id} className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 text-center">
                <p className="font-mono text-3xl text-text-dark dark:text-text-light">{k.character}</p>
                <p className="text-xs text-gray-400 mt-1">{k.meaning}</p>
                <Badge color="purple" className="mt-1">{k.jlptLevel}</Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JapaneseLearning;
