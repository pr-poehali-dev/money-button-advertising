import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'achievements' | 'withdraw'>('home');
  const [balance, setBalance] = useState(1250.75);
  const [clicks, setClicks] = useState(0);
  const [level, setLevel] = useState(5);
  const [xp, setXp] = useState(350);
  const maxXp = 500;

  const handleEarnClick = () => {
    const earnAmount = Math.random() * 5 + 1;
    setBalance(prev => parseFloat((prev + earnAmount).toFixed(2)));
    setClicks(prev => prev + 1);
    setXp(prev => {
      const newXp = prev + 10;
      if (newXp >= maxXp) {
        setLevel(l => l + 1);
        return newXp - maxXp;
      }
      return newXp;
    });
  };

  const achievements = [
    { id: 1, title: 'Новичок', icon: 'Award', desc: 'Заработано 100₽', unlocked: true },
    { id: 2, title: 'Трудяга', icon: 'Zap', desc: '100 кликов', unlocked: true },
    { id: 3, title: 'Профи', icon: 'Trophy', desc: 'Достигнут 5 уровень', unlocked: true },
    { id: 4, title: 'Миллионер', icon: 'Crown', desc: 'Заработано 10000₽', unlocked: false },
    { id: 5, title: 'Легенда', icon: 'Star', desc: 'Достигнут 50 уровень', unlocked: false },
  ];

  const stats = {
    totalEarned: balance + 3450.25,
    totalClicks: clicks + 847,
    daysActive: 12,
    withdrawals: 3
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-game-dark via-purple-900 to-game-dark text-white pb-20">
      {activeTab === 'home' && (
        <div className="container max-w-md mx-auto px-4 py-8 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-game-purple to-game-pink bg-clip-text text-transparent">
              EarnGame
            </h1>
            <p className="text-purple-300">Зарабатывай играя!</p>
          </div>

          <Card className="bg-gradient-to-br from-purple-800/40 to-pink-800/40 border-purple-500/50 backdrop-blur-sm p-6 mb-6">
            <div className="text-center">
              <p className="text-purple-200 text-sm mb-2">Твой баланс</p>
              <p className="text-5xl font-bold mb-1 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
                {balance.toFixed(2)}₽
              </p>
              <p className="text-purple-300 text-xs">+{clicks} кликов сегодня</p>
            </div>
          </Card>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Icon name="Trophy" className="text-yellow-400" size={20} />
                <span className="font-semibold">Уровень {level}</span>
              </div>
              <span className="text-sm text-purple-300">{xp}/{maxXp} XP</span>
            </div>
            <Progress value={(xp / maxXp) * 100} className="h-3 bg-purple-900/50" />
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={handleEarnClick}
              className="relative w-48 h-48 rounded-full bg-gradient-to-br from-game-purple via-game-pink to-game-orange shadow-2xl shadow-purple-500/50 hover:shadow-purple-500/80 transition-all duration-300 hover:scale-105 active:scale-95 animate-pulse"
            >
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <Icon name="Coins" size={64} className="text-yellow-300 drop-shadow-lg animate-bounce" />
              </div>
            </button>
          </div>

          <p className="text-center text-purple-300 text-sm mb-4">Нажми и заработай!</p>

          <div className="grid grid-cols-3 gap-3">
            <Card className="bg-purple-900/30 border-purple-500/30 p-3 text-center">
              <Icon name="TrendingUp" className="mx-auto mb-1 text-green-400" size={20} />
              <p className="text-xs text-purple-300">За сегодня</p>
              <p className="font-bold text-sm">+{(clicks * 2.5).toFixed(0)}₽</p>
            </Card>
            <Card className="bg-purple-900/30 border-purple-500/30 p-3 text-center">
              <Icon name="Calendar" className="mx-auto mb-1 text-blue-400" size={20} />
              <p className="text-xs text-purple-300">Дней активен</p>
              <p className="font-bold text-sm">{stats.daysActive}</p>
            </Card>
            <Card className="bg-purple-900/30 border-purple-500/30 p-3 text-center">
              <Icon name="Award" className="mx-auto mb-1 text-yellow-400" size={20} />
              <p className="text-xs text-purple-300">Достижений</p>
              <p className="font-bold text-sm">3/5</p>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="container max-w-md mx-auto px-4 py-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-center">Профиль</h2>
          
          <Card className="bg-gradient-to-br from-purple-800/40 to-pink-800/40 border-purple-500/50 backdrop-blur-sm p-6 mb-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-game-purple to-game-pink flex items-center justify-center text-3xl font-bold">
                {level}
              </div>
              <div>
                <h3 className="text-xl font-bold">Игрок #{Math.floor(Math.random() * 10000)}</h3>
                <p className="text-purple-300">Уровень {level}</p>
                <div className="flex gap-2 mt-1">
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">⭐ Активный</Badge>
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50">🔥 Профи</Badge>
                </div>
              </div>
            </div>
            <Progress value={(xp / maxXp) * 100} className="h-2 mb-1" />
            <p className="text-xs text-purple-300 text-right">{xp}/{maxXp} XP до уровня {level + 1}</p>
          </Card>

          <h3 className="text-xl font-semibold mb-4">Статистика</h3>
          <div className="grid gap-3 mb-6">
            <Card className="bg-purple-900/30 border-purple-500/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="Wallet" className="text-green-400" size={24} />
                  <div>
                    <p className="text-sm text-purple-300">Всего заработано</p>
                    <p className="text-xl font-bold">{stats.totalEarned.toFixed(2)}₽</p>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="bg-purple-900/30 border-purple-500/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="MousePointerClick" className="text-blue-400" size={24} />
                  <div>
                    <p className="text-sm text-purple-300">Всего кликов</p>
                    <p className="text-xl font-bold">{stats.totalClicks}</p>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="bg-purple-900/30 border-purple-500/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="CreditCard" className="text-purple-400" size={24} />
                  <div>
                    <p className="text-sm text-purple-300">Выведено средств</p>
                    <p className="text-xl font-bold">{stats.withdrawals} раза</p>
                  </div>
                </div>
              </div>
            </Card>
            <Card className="bg-purple-900/30 border-purple-500/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="Calendar" className="text-orange-400" size={24} />
                  <div>
                    <p className="text-sm text-purple-300">Дней активности</p>
                    <p className="text-xl font-bold">{stats.daysActive} дней</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="container max-w-md mx-auto px-4 py-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-center">Достижения</h2>
          
          <div className="grid gap-4">
            {achievements.map((achievement) => (
              <Card 
                key={achievement.id}
                className={`p-4 transition-all duration-300 ${
                  achievement.unlocked
                    ? 'bg-gradient-to-r from-purple-800/40 to-pink-800/40 border-purple-500/50'
                    : 'bg-gray-800/30 border-gray-700/30 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-yellow-400 to-orange-500'
                      : 'bg-gray-700'
                  }`}>
                    <Icon 
                      name={achievement.icon as any} 
                      size={32} 
                      className={achievement.unlocked ? 'text-white' : 'text-gray-500'}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{achievement.title}</h3>
                    <p className="text-sm text-purple-300">{achievement.desc}</p>
                    {achievement.unlocked && (
                      <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-500/50">
                        ✓ Получено
                      </Badge>
                    )}
                    {!achievement.unlocked && (
                      <Badge className="mt-2 bg-gray-600/20 text-gray-400 border-gray-600/50">
                        🔒 Заблокировано
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'withdraw' && (
        <div className="container max-w-md mx-auto px-4 py-8 animate-fade-in">
          <h2 className="text-3xl font-bold mb-6 text-center">Вывод средств</h2>
          
          <Card className="bg-gradient-to-br from-purple-800/40 to-pink-800/40 border-purple-500/50 backdrop-blur-sm p-6 mb-6">
            <p className="text-purple-200 text-sm mb-2">Доступно для вывода</p>
            <p className="text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent">
              {balance.toFixed(2)}₽
            </p>
            <p className="text-xs text-purple-300">Минимальная сумма вывода: 100₽</p>
          </Card>

          <h3 className="text-lg font-semibold mb-4">Выберите способ вывода</h3>

          <div className="grid gap-3 mb-6">
            <Card className="bg-purple-900/30 border-purple-500/30 p-4 hover:bg-purple-800/40 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Icon name="CreditCard" size={24} />
                </div>
                <div>
                  <p className="font-semibold">Visa / Mastercard</p>
                  <p className="text-xs text-purple-300">Комиссия 2%</p>
                </div>
              </div>
            </Card>

            <Card className="bg-purple-900/30 border-purple-500/30 p-4 hover:bg-purple-800/40 transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                  <Icon name="CreditCard" size={24} />
                </div>
                <div>
                  <p className="font-semibold">МИР</p>
                  <p className="text-xs text-purple-300">Комиссия 1.5%</p>
                </div>
              </div>
            </Card>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-game-purple to-game-pink hover:from-purple-600 hover:to-pink-600 text-white font-bold py-6 text-lg"
            disabled={balance < 100}
          >
            {balance < 100 ? '🔒 Недостаточно средств' : '💰 Вывести средства'}
          </Button>

          {balance < 100 && (
            <p className="text-center text-sm text-purple-400 mt-3">
              Заработайте еще {(100 - balance).toFixed(2)}₽ для вывода
            </p>
          )}

          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">История выводов</h3>
            <div className="grid gap-3">
              <Card className="bg-purple-900/30 border-purple-500/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">Visa •••• 4532</p>
                    <p className="text-xs text-purple-300">15 янв 2026, 14:32</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">+1500₽</p>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-xs">
                      Выполнено
                    </Badge>
                  </div>
                </div>
              </Card>
              <Card className="bg-purple-900/30 border-purple-500/30 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">МИР •••• 2201</p>
                    <p className="text-xs text-purple-300">08 янв 2026, 09:15</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">+850₽</p>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/50 text-xs">
                      Выполнено
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-game-dark to-purple-900/95 backdrop-blur-lg border-t border-purple-500/30 px-4 py-3">
        <div className="container max-w-md mx-auto flex justify-around items-center">
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'home' ? 'text-game-purple scale-110' : 'text-purple-300 hover:text-white'
            }`}
          >
            <Icon name="Home" size={24} />
            <span className="text-xs font-medium">Главная</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'profile' ? 'text-game-purple scale-110' : 'text-purple-300 hover:text-white'
            }`}
          >
            <Icon name="User" size={24} />
            <span className="text-xs font-medium">Профиль</span>
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'achievements' ? 'text-game-purple scale-110' : 'text-purple-300 hover:text-white'
            }`}
          >
            <Icon name="Trophy" size={24} />
            <span className="text-xs font-medium">Награды</span>
          </button>
          <button
            onClick={() => setActiveTab('withdraw')}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeTab === 'withdraw' ? 'text-game-purple scale-110' : 'text-purple-300 hover:text-white'
            }`}
          >
            <Icon name="Wallet" size={24} />
            <span className="text-xs font-medium">Вывод</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
