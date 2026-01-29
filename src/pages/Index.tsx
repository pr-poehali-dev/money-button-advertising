import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'home' | 'profile' | 'achievements' | 'withdraw'>('home');
  const [balance, setBalance] = useState(1250.75);
  const [clicks, setClicks] = useState(0);
  const [level, setLevel] = useState(5);
  const [xp, setXp] = useState(350);
  const maxXp = 500;
  const [showAdDialog, setShowAdDialog] = useState(false);
  const [adTimer, setAdTimer] = useState(0);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adsWatched, setAdsWatched] = useState(0);
  const [adCooldown, setAdCooldown] = useState(0);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [selectedCardType, setSelectedCardType] = useState<'visa' | 'mir' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [saveCard, setSaveCard] = useState(true);
  const [savedCards, setSavedCards] = useState<Array<{id: string, type: 'visa' | 'mir', number: string, holder: string, lastUsed?: string}>>([]);
  const [selectedSavedCard, setSelectedSavedCard] = useState<string | null>(null);
  const [showManageCards, setShowManageCards] = useState(false);

  const adRewards = [
    { duration: 5, reward: 15, title: 'Короткая реклама', desc: '5 секунд' },
    { duration: 15, reward: 50, title: 'Средняя реклама', desc: '15 секунд' },
    { duration: 30, reward: 120, title: 'Длинная реклама', desc: '30 секунд' },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWatchingAd && adTimer > 0) {
      interval = setInterval(() => {
        setAdTimer(prev => prev - 1);
      }, 1000);
    } else if (isWatchingAd && adTimer === 0) {
      setIsWatchingAd(false);
    }
    return () => clearInterval(interval);
  }, [isWatchingAd, adTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (adCooldown > 0) {
      interval = setInterval(() => {
        setAdCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [adCooldown]);

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

  const handleWatchAd = (duration: number, reward: number) => {
    if (adCooldown > 0) {
      toast({
        title: '⏳ Подожди немного',
        description: `Следующая реклама через ${adCooldown} сек`,
        variant: 'destructive'
      });
      return;
    }
    setAdTimer(duration);
    setIsWatchingAd(true);
    setShowAdDialog(false);

    setTimeout(() => {
      setBalance(prev => parseFloat((prev + reward).toFixed(2)));
      setAdsWatched(prev => prev + 1);
      setXp(prev => {
        const newXp = prev + 25;
        if (newXp >= maxXp) {
          setLevel(l => l + 1);
          return newXp - maxXp;
        }
        return newXp;
      });
      setAdCooldown(60);
      toast({
        title: '💰 Награда получена!',
        description: `+${reward}₽ за просмотр рекламы`,
      });
    }, duration * 1000);
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setCardNumber(formatted);
    }
  };

  const handleWithdrawSubmit = () => {
    const amount = parseFloat(withdrawAmount);
    let finalCardNumber = cardNumber;
    let finalCardHolder = cardHolder;
    let finalCardType = selectedCardType;

    if (selectedSavedCard) {
      const card = savedCards.find(c => c.id === selectedSavedCard);
      if (card) {
        finalCardNumber = card.number;
        finalCardHolder = card.holder;
        finalCardType = card.type;
      }
    }

    if (!finalCardNumber || finalCardNumber.replace(/\s/g, '').length !== 16) {
      toast({
        title: '❌ Ошибка',
        description: 'Введите корректный номер карты (16 цифр)',
        variant: 'destructive'
      });
      return;
    }
    if (!finalCardHolder || finalCardHolder.length < 3) {
      toast({
        title: '❌ Ошибка',
        description: 'Введите имя держателя карты',
        variant: 'destructive'
      });
      return;
    }
    if (!amount || amount < 100 || amount > balance) {
      toast({
        title: '❌ Ошибка',
        description: 'Сумма должна быть от 100₽ до доступного баланса',
        variant: 'destructive'
      });
      return;
    }

    const commission = finalCardType === 'mir' ? 0.015 : 0.02;
    const finalAmount = amount * (1 - commission);
    
    if (saveCard && !selectedSavedCard && finalCardNumber && finalCardHolder) {
      const newCard = {
        id: Date.now().toString(),
        type: finalCardType!,
        number: finalCardNumber,
        holder: finalCardHolder,
        lastUsed: new Date().toISOString()
      };
      setSavedCards(prev => [...prev, newCard]);
    } else if (selectedSavedCard) {
      setSavedCards(prev => prev.map(card => 
        card.id === selectedSavedCard 
          ? { ...card, lastUsed: new Date().toISOString() }
          : card
      ));
    }
    
    setBalance(prev => prev - amount);
    setShowWithdrawDialog(false);
    setCardNumber('');
    setCardHolder('');
    setWithdrawAmount('');
    setSelectedCardType(null);
    setSelectedSavedCard(null);
    setSaveCard(true);
    
    toast({
      title: '✅ Заявка создана!',
      description: `Выплата ${finalAmount.toFixed(2)}₽ на карту *${finalCardNumber.slice(-4)} в обработке`,
    });
  };

  const openWithdrawDialog = (type: 'visa' | 'mir') => {
    setSelectedCardType(type);
    setShowWithdrawDialog(true);
  };

  const handleSelectSavedCard = (cardId: string) => {
    setSelectedSavedCard(cardId);
    const card = savedCards.find(c => c.id === cardId);
    if (card) {
      setCardNumber(card.number);
      setCardHolder(card.holder);
    }
  };

  const handleDeleteCard = (cardId: string) => {
    setSavedCards(prev => prev.filter(c => c.id !== cardId));
    if (selectedSavedCard === cardId) {
      setSelectedSavedCard(null);
      setCardNumber('');
      setCardHolder('');
    }
    toast({
      title: '🗑️ Карта удалена',
      description: 'Карта успешно удалена из профиля',
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
    withdrawals: 3,
    adsWatched: adsWatched + 15
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

          <Button
            onClick={() => setShowAdDialog(true)}
            disabled={adCooldown > 0 || isWatchingAd}
            className="w-full mb-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-6 text-lg relative overflow-hidden"
          >
            {isWatchingAd ? (
              <>
                <Icon name="Timer" className="mr-2" size={24} />
                Просмотр рекламы... {adTimer}с
              </>
            ) : adCooldown > 0 ? (
              <>
                <Icon name="Clock" className="mr-2" size={24} />
                Подожди {adCooldown}с
              </>
            ) : (
              <>
                <Icon name="Play" className="mr-2" size={24} />
                📺 Смотреть рекламу
              </>
            )}
          </Button>

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

          <Card className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border-green-500/30 p-4 mt-6">
            <div className="flex items-center gap-3">
              <Icon name="Tv" className="text-green-400" size={32} />
              <div className="flex-1">
                <p className="font-semibold text-sm">Реклама просмотрена</p>
                <p className="text-xs text-purple-300">Всего: {adsWatched} раз</p>
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/50">
                +{adsWatched * 50}₽
              </Badge>
            </div>
          </Card>
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
            <Card className="bg-purple-900/30 border-purple-500/30 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="Tv" className="text-green-400" size={24} />
                  <div>
                    <p className="text-sm text-purple-300">Реклам просмотрено</p>
                    <p className="text-xl font-bold">{stats.adsWatched} раз</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {savedCards.length > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Мои карты</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowManageCards(true)}
                  className="bg-purple-900/30 border-purple-500/50 text-purple-200 hover:bg-purple-800/40"
                >
                  <Icon name="Settings" size={16} className="mr-1" />
                  Управление
                </Button>
              </div>
              <div className="grid gap-3">
                {savedCards.slice(0, 2).map((card) => (
                  <Card key={card.id} className="bg-purple-900/30 border-purple-500/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        card.type === 'mir' 
                          ? 'bg-gradient-to-br from-green-600 to-blue-600' 
                          : 'bg-blue-600'
                      }`}>
                        <Icon name="CreditCard" size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{card.type === 'mir' ? 'МИР' : 'Visa/MC'} •••• {card.number.slice(-4)}</p>
                        <p className="text-xs text-purple-300">{card.holder}</p>
                      </div>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/50 text-xs">
                        Сохранена
                      </Badge>
                    </div>
                  </Card>
                ))}
                {savedCards.length > 2 && (
                  <p className="text-center text-sm text-purple-400">
                    +{savedCards.length - 2} карт
                  </p>
                )}
              </div>
            </div>
          )}
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
            <Card 
              className="bg-purple-900/30 border-purple-500/30 p-4 hover:bg-purple-800/40 transition-all cursor-pointer"
              onClick={() => balance >= 100 && openWithdrawDialog('visa')}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Icon name="CreditCard" size={24} />
                </div>
                <div>
                  <p className="font-semibold">Visa / Mastercard</p>
                  <p className="text-xs text-purple-300">Комиссия 2%</p>
                </div>
                <Icon name="ChevronRight" className="ml-auto text-purple-400" size={20} />
              </div>
            </Card>

            <Card 
              className="bg-purple-900/30 border-purple-500/30 p-4 hover:bg-purple-800/40 transition-all cursor-pointer"
              onClick={() => balance >= 100 && openWithdrawDialog('mir')}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-600 to-blue-600 flex items-center justify-center">
                  <Icon name="CreditCard" size={24} />
                </div>
                <div>
                  <p className="font-semibold">МИР</p>
                  <p className="text-xs text-purple-300">Комиссия 1.5%</p>
                </div>
                <Icon name="ChevronRight" className="ml-auto text-purple-400" size={20} />
              </div>
            </Card>
          </div>

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

      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="bg-gradient-to-br from-purple-900 to-game-dark border-purple-500/50 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-game-purple to-game-pink bg-clip-text text-transparent">
              💳 Вывод средств
            </DialogTitle>
            <DialogDescription className="text-purple-300 text-center">
              {selectedCardType === 'mir' ? 'Карта МИР (комиссия 1.5%)' : 'Visa/Mastercard (комиссия 2%)'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {savedCards.length > 0 && (
              <div>
                <Label className="text-purple-200 mb-2 block">
                  Сохраненные карты
                </Label>
                <div className="grid gap-2 mb-3">
                  {savedCards.filter(c => c.type === selectedCardType).map((card) => (
                    <Card
                      key={card.id}
                      className={`p-3 cursor-pointer transition-all ${
                        selectedSavedCard === card.id
                          ? 'bg-purple-700/50 border-purple-400'
                          : 'bg-purple-900/30 border-purple-500/30 hover:bg-purple-800/40'
                      }`}
                      onClick={() => handleSelectSavedCard(card.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon 
                            name={card.type === 'mir' ? 'CreditCard' : 'CreditCard'} 
                            className={card.type === 'mir' ? 'text-green-400' : 'text-blue-400'} 
                            size={20} 
                          />
                          <div>
                            <p className="font-semibold text-sm">•••• {card.number.slice(-4)}</p>
                            <p className="text-xs text-purple-300">{card.holder}</p>
                          </div>
                        </div>
                        {selectedSavedCard === card.id && (
                          <Icon name="Check" className="text-green-400" size={20} />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedSavedCard(null);
                    setCardNumber('');
                    setCardHolder('');
                  }}
                  className="w-full bg-purple-900/30 border-purple-500/50 text-purple-200 hover:bg-purple-800/40 mb-3"
                >
                  + Использовать новую карту
                </Button>
              </div>
            )}
            
            {!selectedSavedCard && (
              <>
                <div>
                  <Label htmlFor="cardNumber" className="text-purple-200 mb-2 block">
                    Номер карты
                  </Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="bg-purple-900/30 border-purple-500/50 text-white placeholder:text-purple-400"
                    maxLength={19}
                  />
                </div>
                <div>
                  <Label htmlFor="cardHolder" className="text-purple-200 mb-2 block">
                    Имя держателя карты
                  </Label>
                  <Input
                    id="cardHolder"
                    placeholder="IVAN IVANOV"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                    className="bg-purple-900/30 border-purple-500/50 text-white placeholder:text-purple-400"
                  />
                </div>
                <div className="flex items-center space-x-2 bg-purple-900/20 p-3 rounded-lg">
                  <input
                    type="checkbox"
                    id="saveCard"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="w-4 h-4 rounded border-purple-500 bg-purple-900/30 text-purple-600 focus:ring-purple-500"
                  />
                  <Label htmlFor="saveCard" className="text-purple-200 text-sm cursor-pointer">
                    💾 Сохранить карту для быстрых выводов
                  </Label>
                </div>
              </>
            )}
            <div>
              <Label htmlFor="amount" className="text-purple-200 mb-2 block">
                Сумма вывода
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="100"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="bg-purple-900/30 border-purple-500/50 text-white placeholder:text-purple-400"
                min={100}
                max={balance}
              />
              <p className="text-xs text-purple-400 mt-1">
                Доступно: {balance.toFixed(2)}₽ | Мин: 100₽
              </p>
            </div>
            {withdrawAmount && parseFloat(withdrawAmount) >= 100 && (
              <Card className="bg-blue-900/30 border-blue-500/30 p-3">
                <div className="flex justify-between text-sm">
                  <span className="text-purple-300">Комиссия:</span>
                  <span className="text-white">
                    {(parseFloat(withdrawAmount) * (selectedCardType === 'mir' ? 0.015 : 0.02)).toFixed(2)}₽
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-purple-300 font-semibold">Вы получите:</span>
                  <span className="text-green-400 font-bold">
                    {(parseFloat(withdrawAmount) * (selectedCardType === 'mir' ? 0.985 : 0.98)).toFixed(2)}₽
                  </span>
                </div>
              </Card>
            )}
            <Button
              onClick={handleWithdrawSubmit}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-6"
            >
              <Icon name="Send" className="mr-2" size={20} />
              Отправить заявку на вывод
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAdDialog} onOpenChange={setShowAdDialog}>
        <DialogContent className="bg-gradient-to-br from-purple-900 to-game-dark border-purple-500/50 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-game-purple to-game-pink bg-clip-text text-transparent">
              📺 Выбери рекламу
            </DialogTitle>
            <DialogDescription className="text-purple-300 text-center">
              Смотри рекламу и получай награды!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            {adRewards.map((ad, index) => (
              <Card 
                key={index}
                className="bg-purple-900/30 border-purple-500/30 p-4 hover:bg-purple-800/40 transition-all cursor-pointer"
                onClick={() => handleWatchAd(ad.duration, ad.reward)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                      <Icon name="Play" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold">{ad.title}</p>
                      <p className="text-xs text-purple-300">{ad.desc}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-yellow-400">+{ad.reward}₽</p>
                    <p className="text-xs text-green-400">+25 XP</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          <div className="mt-4 p-3 bg-blue-900/30 border border-blue-500/30 rounded-lg">
            <p className="text-xs text-blue-300 text-center">
              ℹ️ После просмотра — перерыв 60 секунд
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showManageCards} onOpenChange={setShowManageCards}>
        <DialogContent className="bg-gradient-to-br from-purple-900 to-game-dark border-purple-500/50 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-game-purple to-game-pink bg-clip-text text-transparent">
              💳 Управление картами
            </DialogTitle>
            <DialogDescription className="text-purple-300 text-center">
              Всего сохранено: {savedCards.length} {savedCards.length === 1 ? 'карта' : 'карт'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 mt-4 max-h-96 overflow-y-auto">
            {savedCards.length === 0 ? (
              <div className="text-center py-8">
                <Icon name="CreditCard" className="mx-auto mb-3 text-purple-400" size={48} />
                <p className="text-purple-300">Нет сохраненных карт</p>
                <p className="text-sm text-purple-400 mt-2">
                  Добавьте карту при выводе средств
                </p>
              </div>
            ) : (
              savedCards.map((card) => (
                <Card key={card.id} className="bg-purple-900/30 border-purple-500/30 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        card.type === 'mir' 
                          ? 'bg-gradient-to-br from-green-600 to-blue-600' 
                          : 'bg-blue-600'
                      }`}>
                        <Icon name="CreditCard" size={20} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {card.type === 'mir' ? 'МИР' : 'Visa/MC'} •••• {card.number.slice(-4)}
                        </p>
                        <p className="text-xs text-purple-300">{card.holder}</p>
                        {card.lastUsed && (
                          <p className="text-xs text-purple-400 mt-1">
                            Последний вывод: {new Date(card.lastUsed).toLocaleDateString('ru-RU')}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCard(card.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Icon name="Trash2" size={18} />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {isWatchingAd && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center animate-pulse">
              <Icon name="Play" size={64} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Реклама</h2>
            <p className="text-purple-300 mb-4">Смотри до конца для награды</p>
            <div className="text-6xl font-bold bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-transparent animate-bounce">
              {adTimer}
            </div>
            <p className="text-purple-400 text-sm mt-4">секунд до награды</p>
            <Progress value={((30 - adTimer) / 30) * 100} className="h-2 mt-6 w-64 mx-auto" />
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