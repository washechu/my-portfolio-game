import React, { useState, useEffect } from 'react';
import './App.css';

function StartScreen({ onStart }) {
  // Добавляем состояние для анимации
  const [isAnimated, setIsAnimated] = useState(false);

  // Адаптивные размеры стартового экрана
  const windowWidth = typeof window !== 'undefined' ? window.innerWidth : 1400;
  let headerFontSize, textFontSize, buttonFontSize, buttonPadding, gap, playerImgMaxWidth;
  if (windowWidth >= 1500) {
    headerFontSize = '2.5rem';
    textFontSize = '1.3rem';
    buttonFontSize = '1.3rem';
    buttonPadding = '1.2rem 2.2rem';
    gap = '2.5rem';
    playerImgMaxWidth = '520px';
  } else {
    headerFontSize = '1.875rem';
    textFontSize = '0.9rem';
    buttonFontSize = '0.9rem';
    buttonPadding = '0.75rem 1.5rem';
    gap = '1.5rem';
    playerImgMaxWidth = '400px';
  }

  // Эффект для анимации
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimated(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Эффект для ререндера при изменении размера окна
  useEffect(() => {
    function handleResize() {
      // Просто форсируем ререндер
      setIsAnimated(a => a);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#FCFAFA',
      display: 'grid',
      gridTemplateColumns: 'repeat(8, 1fr)',
      gridTemplateRows: 'repeat(8, 1fr)',
      fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
    }}>
      {/* Изображение игрока */}
      <div style={{
        gridColumn: '3 / 5',
        gridRow: '4',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <img 
          src={isAnimated ? "/me_start_down.png" : "/me_start.png"} 
          alt="Главный герой" 
          style={{
            width: '100%',
            maxWidth: playerImgMaxWidth,
            height: 'auto',
            transition: 'opacity 0.3s',
          }}
        />
      </div>

      {/* Текст */}
      <div style={{
        gridColumn: '5 / 7',
        gridRow: '4',
        display: 'flex',
        flexDirection: 'column',
        gap: gap,
        textAlign: 'left',
        justifyContent: 'center',
      }}>
        <h1 style={{
          fontSize: headerFontSize,
          fontWeight: 900,
          margin: 0,
          lineHeight: 1.4,
          whiteSpace: 'nowrap',
        }}>
          Привет, я Никита
        </h1>
        <p style={{
          fontSize: textFontSize,
          lineHeight: 1.8,
          margin: 0,
        }}>
          Это мое портфолио aka небольшая игра,<br />
          я расскажу о своих кейсах<br />
          в роли <span style={{whiteSpace:'nowrap'}}>проджект-менеджера.</span>
        </p>
        <button 
          onClick={onStart} 
          style={{ 
            fontSize: buttonFontSize,
            padding: buttonPadding,
            cursor: 'pointer',
            backgroundColor: '#1976d2',
            color: 'white',
            border: '3px solid #222',
            borderRadius: '6px',
            boxShadow: '0 1.5px 0 #222',
            fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
            width: 'fit-content',
            transition: 'transform 0.1s',
          }}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
        Начать
      </button>
      {/* Иконки-ссылки под кнопкой */}
      <div style={{display:'flex',gap:32,marginTop:44,alignItems:'flex-start'}}>
        <a href="/resume_fin.pdf" target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'flex-start',textDecoration:'none'}}>
          <img src="/hh.png" alt="Скачать резюме" style={{width:38,height:38,border:'3px solid #222',borderRadius:6,background:'#fff'}} />
        </a>
        <a href="https://t.me/washe_chuvachestvo" target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'flex-start',textDecoration:'none'}}>
          <img src="/tg.png" alt="Telegram" style={{width:38,height:38,border:'3px solid #222',borderRadius:6,background:'#fff'}} />
        </a>
        <a href="https://washechuvachestvo.notion.site/11f172e21500808782edf8cb8ab43cab" target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'flex-start',textDecoration:'none'}}>
          <img src="/me.png" alt="Notion" style={{width:38,height:38,border:'3px solid #222',borderRadius:6,background:'#fff'}} />
        </a>
      </div>
      </div>
    </div>
  );
}

function Game() {
  const columns = 20;
  const rows = 12;
  const minRow = 2 * 1; // теперь 2-я строка (аналогично прежнему ограничению)
  const maxRow = 2 * 5; // теперь 10-я строка (аналогично прежнему ограничению)
  const minCol = 1;
  const maxCol = 20;

  // Стартовая позиция: правый нижний угол
  const [cell, setCell] = useState({ col: 14, row: 9 });
  const [direction, setDirection] = useState('front');
  // Добавляем состояние для отслеживания первого движения
  const [hasMoved, setHasMoved] = useState(false);

  // Состояние для активного NPC ('pasha', 'polina', null)
  const [activeNpc, setActiveNpc] = useState(null);

  // Флаги завершения для каждого NPC
  const [completedPasha, setCompletedPasha] = useState(false);
  const [completedPolina, setCompletedPolina] = useState(false);
  const [completedHrLena, setCompletedHrLena] = useState(false);
  const [completedLexa, setCompletedLexa] = useState(false);

  // --- Финальный NPC: Пицца (объявления выше всех вычислений) ---
  const pizzaColStart = 10;
  const pizzaColEnd = 11;
  const pizzaRow = 6;
  const [completedPizza, setCompletedPizza] = useState(false);
  const [isPizzaAnimated, setIsPizzaAnimated] = useState(false);
  // Пицца появляется, если все NPC завершены и пицца ещё не завершена
  const isPizzaVisible = completedPasha && completedPolina && completedHrLena && completedLexa && !completedPizza;
  // Проверка: игрок рядом с Пиццей
  const isNearPizza = isPizzaVisible && (
    (cell.row === pizzaRow + 1 && (cell.col === pizzaColStart || cell.col === pizzaColEnd)) ||
    (cell.row === pizzaRow - 1 && (cell.col === pizzaColStart || cell.col === pizzaColEnd)) ||
    (cell.col === pizzaColStart - 1 && cell.row === pizzaRow) ||
    (cell.col === pizzaColEnd + 1 && cell.row === pizzaRow)
  );
  // Диалог для Пиццы
  const moneyDialogPairs = [
    {
      npc: {
        name: 'Денежка',
        avatar: '/pizza_down.png',
        text: 'Поздравляю! Сегодня ты закрыл четыре проекта и заслужил зарплату.',
        color: 'white',
      },
      player: {
        name: 'Проджект Никита',
        avatar: '/me_avatar.png',
        text: 'Надеюсь, ты большая и вкусная.',
        color: '#d4f7d4',
      },
    },
  ];

  // Массив для порядка завершения NPC
  const [completedOrder, setCompletedOrder] = useState([]); // массив строк: 'pasha', 'polina', 'hrlena', 'lexa'

  // Диалоговые реплики теперь идут парами: [{npc: {...}, player: {...}}]
  const dialogPairs = [
    {
      npc: {
        name: 'Продакт Паша',
        avatar: '/bold_pm_avatar.png',
        text: 'Хочу знать, почему так долго деливерим фичи! Мы или рабы дедлайнов, или...',
        color: 'white',
      },
      player: {
        name: 'Проджект Никита',
        avatar: '/me_avatar.png',
        text: 'Выдох. А теперь рассказывай по порядку.',
        color: '#d4f7d4',
      },
    },
    {
      npc: {
        name: 'Продакт Паша',
        avatar: '/bold_pm_avatar.png',
        text: 'Беклог разрастается, команда в запаре, а я не могу понять, где затык...',
        color: 'white',
      },
      player: {
        name: 'Проджект Никита',
        avatar: '/me_avatar.png',
        text: 'Нужны метрики TTM. Будем трекать этапы и превращать "кажется" в "точно знаю".',
        color: '#d4f7d4',
      },
    },
  ];

  // Диалоговые реплики для Полины
  const polinaDialogPairs = [
    {
      npc: {
        name: 'Тимлид Полина',
        avatar: '/blond_avatar.png',
        text: 'Я не понимаю, кто у меня что делает. У каждого продукта — своя форма отчётности.',
        color: 'white',
      },
      player: {
        name: 'Проджект Никита',
        avatar: '/me_avatar.png',
        text: 'Хм, звучит весело… Если ты любишь хаос.',
        color: '#d4f7d4',
      },
    },
    {
      npc: {
        name: 'Тимлид Полина',
        avatar: '/blond_avatar.png',
        text: 'У кого-то Conflu, у кого-то слайды...Один продакт пишет свои апдейты в телеге.',
        color: 'white',
      },
      player: {
        name: 'Проджект Никита',
        avatar: '/me_avatar.png',
        text: 'Слушай, давай соберём всех под один процесс. Я уже делал такое.',
        color: '#d4f7d4',
      },
    },
  ];

  // Диалоговые реплики для Лены
  const hrLenaDialogPairs = [
    {
      npc: {
        name: 'HR Лена',
        avatar: '/hr_avatar.png',
        text: 'Никитос, беда. Базовый онбординг вообще не закрывает вопросы о продукте',
        color: 'white',
      },
      player: {
        name: 'Проджект Никита',
        avatar: '/me_avatar.png',
        text: 'Ага, классика: «спроси у коллег» как онбординг.',
        color: '#d4f7d4',
      },
    },
    {
      npc: {
        name: 'HR Лена',
        avatar: '/hr_avatar.png',
        text: 'Нет описания процессов, кто за что отвечает, как работает продукт под капотом...',
        color: 'white',
      },
      player: {
        name: 'Проджект Никита',
        avatar: '/me_avatar.png',
        text: 'Сделаем обучающий курс и причешем Wiki с инфо о продукте и структуре команд?',
        color: '#d4f7d4',
      },
    },
  ];

  // Диалоговые реплики для Лехи
  const lexaDialogPairs = [
    {
      npc: {
        name: 'Разработчик Леха',
        avatar: '/coder_avatar.png',
        text: 'Опять приоритеты меняются на лету. Вчера одно важное, сегодня другое, завтра забудут оба...',
        color: 'white',
      },
      player: {
        name: 'Проджект Никита',
        avatar: '/me_avatar.png',
        text: 'Опять круглый стол и кто громче — тот и прав?',
        color: '#d4f7d4',
      },
    },
    {
      npc: {
        name: 'Разработчик Леха',
        avatar: '/coder_avatar.png',
        text: 'Да! Каждый бизнес-стрим тянет одеяло. Мы как будто за всех решаем, что важнее.',
        color: 'white',
      },
      player: {
        name: 'Проджект Никита',
        avatar: '/me_avatar.png',
        text: 'Давай снимем эту ответственность с ИТ? Нужны прозрачные принципы приоритезации...',
        color: '#d4f7d4',
      },
    },
  ];

  // Координаты NPC Полины (крайний левый столбец, та же строка, что и Паша)
  const polinaColStart = 2;
  const polinaColEnd = 3;
  const polinaRow = 3;
  // Проверка: игрок рядом с NPC (снизу, слева, справа)
  const isNearNpc = (
    // Снизу
    (cell.row === 4 && (cell.col === 10 || cell.col === 11)) ||
    // Слева
    ((cell.row === 2 || cell.row === 3) && cell.col === 9) ||
    // Справа
    ((cell.row === 2 || cell.row === 3) && cell.col === 12)
  );
  // Проверка: игрок рядом с Полиной (снизу, слева, справа)
  const isNearPolina = (
    // Снизу
    (cell.row === polinaRow + 1 && (cell.col === polinaColStart || cell.col === polinaColEnd)) ||
    // Слева
    (cell.row === polinaRow && cell.col === polinaColStart - 1) ||
    // Справа
    (cell.row === polinaRow && cell.col === polinaColEnd + 1)
  );
  // Координаты NPC Лены (HR): на один столбец вправо
  const hrLenaColStart = 17;
  const hrLenaColEnd = 18;
  const hrLenaRow = 3;
  // Проверка: игрок рядом с Леной (снизу, слева, справа)
  const isNearHrLena = (
    // Снизу
    (cell.row === hrLenaRow + 1 && (cell.col === hrLenaColStart || cell.col === hrLenaColEnd)) ||
    // Слева
    (cell.row === hrLenaRow && cell.col === hrLenaColStart - 1) ||
    // Справа
    (cell.row === hrLenaRow && cell.col === hrLenaColEnd + 1)
  );
  // Координаты Лехи (7-10 строки, 4-7 столбцы)
  const lexaColStart = 4;
  const lexaColEnd = 7;
  const lexaRowStart = 7;
  const lexaRowEnd = 10;
  // Проверка: игрок рядом с Лехой (с любой стороны вокруг всех 9 клеток)
  const isNearLexa = (
    // Снизу
    ((cell.row === lexaRowEnd + 1) && (cell.col >= lexaColStart && cell.col <= lexaColEnd)) ||
    // Сверху
    ((cell.row === lexaRowStart - 1) && (cell.col >= lexaColStart && cell.col <= lexaColEnd)) ||
    // Слева
    ((cell.col === lexaColStart - 1) && (cell.row >= lexaRowStart && cell.row <= lexaRowEnd)) ||
    // Справа
    ((cell.col === lexaColEnd + 1) && (cell.row >= lexaRowStart && cell.row <= lexaRowEnd))
  );
  // Показываем баббл, если игрок рядом с NPC (событие синхронизировано с isNearNpc)
  const dialogActive =
    (isNearNpc && !completedPasha) ||
    (isNearPolina && !completedPolina) ||
    (isNearHrLena && !completedHrLena) ||
    (isNearLexa && !completedLexa) ||
    isNearPizza;

  // Охранное поле: только клетки, которые занимает NPC
  function isBlockedCell(col, row) {
    // Паша занимает столбцы 10 и 11, строки 2 и 3
    const isPasha = !completedPasha && (col === 10 || col === 11) && (row === 2 || row === 3);
    // Полина занимает столбцы 2 и 3, строку 3
    const isPolina = !completedPolina && (col === 2 || col === 3) && row === 3;
    // Лена занимает столбцы 17 и 18, строку 3
    const isHrLena = !completedHrLena && (col === 17 || col === 18) && row === 3;
    // Лёха занимает столбцы 4, 5, 6, 7, строки 7, 8, 9, 10
    const isLexa = !completedLexa && (col >= lexaColStart && col <= lexaColEnd) && (row >= lexaRowStart && row <= lexaRowEnd);
    // Охранное поле сверху
    const isLexaTopGuard = !completedLexa && (col >= lexaColStart && col <= lexaColEnd) && (row === lexaRowStart - 1);
    // Пицца занимает одну клетку в центре
    const isPizza = isPizzaVisible && !completedPizza && col === pizzaColStart && row === pizzaRow;
    return isPasha || isPolina || isHrLena || isLexa || isLexaTopGuard || isPizza;
  }

  // Выбор массива реплик в зависимости от активного NPC
  let activeDialogPairs = dialogPairs;
  if (activeNpc === 'polina') activeDialogPairs = polinaDialogPairs;
  if (activeNpc === 'hrlena') activeDialogPairs = hrLenaDialogPairs;
  if (activeNpc === 'lexa') activeDialogPairs = lexaDialogPairs;
  if (activeNpc === 'pizza') activeDialogPairs = moneyDialogPairs;

  const [dialogPairStep, setDialogPairStep] = useState(0);
  const [showPlayerReply, setShowPlayerReply] = useState(false);
  const [showProjectCard, setShowProjectCard] = useState(false);

  // Состояние для завершённых проектов (4 проекта)
  const [completedProjects, setCompletedProjects] = useState([false, false, false, false]);

  // Иконки для каунтера проектов
  const allIcons = {
    pasha: '/icon_project_ttm.png',
    polina: '/icon_project_backlog.png',
    hrlena: '/icon_project_onb.png',
    lexa: '/icon_project_it.png',
  };
  // Формируем массив для каунтера: сначала завершённые в порядке completedOrder, затем пустые
  const counterIcons = Array(4).fill(null).map((_, i) => completedOrder[i] ? allIcons[completedOrder[i]] : null);

  // Состояние для ширины окна (адаптивность)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Адаптивные размеры для бабблов
  let bubbleFontSize, bubblePadding, bubbleGap, bubbleMinWidth, bubbleMaxWidth, bubbleWidth, bubbleIconSize, bubbleNameFontSize, bubbleMinHeight;
  if (windowWidth < 1000) {
    bubbleFontSize = '0.55rem';
    bubblePadding = '0.3em 0.5em';
    bubbleGap = 4;
    bubbleMinWidth = undefined;
    bubbleMaxWidth = '90vw';
    bubbleWidth = 'auto';
    bubbleIconSize = 24;
    bubbleNameFontSize = '0.55rem';
    bubbleMinHeight = undefined;
  } else if (windowWidth >= 1000 && windowWidth <= 1500) {
    bubbleFontSize = '0.8rem';
    bubblePadding = '0.8em 1.2em';
    bubbleGap = 14;
    bubbleMinWidth = 180;
    bubbleMaxWidth = 340;
    bubbleWidth = '100%';
    bubbleIconSize = 32;
    bubbleNameFontSize = '0.8rem';
    bubbleMinHeight = '3.5em';
  } else {
    bubbleFontSize = '1rem';
    bubblePadding = '1.1em 1.7em';
    bubbleGap = 20;
    bubbleMinWidth = 220;
    bubbleMaxWidth = 420;
    bubbleWidth = '100%';
    bubbleIconSize = 32;
    bubbleNameFontSize = '1rem';
    bubbleMinHeight = '3.5em';
  }

  // Адаптивные размеры для подсказок
  let hintFontSize, hintBottom, hintPadding, hintMaxWidth;
  if (windowWidth < 1000) {
    hintFontSize = '0.7rem';
    hintBottom = 10;
    hintPadding = '0.2em 0.4em';
    hintMaxWidth = '90vw';
  } else if (windowWidth >= 1000 && windowWidth <= 1500) {
    hintFontSize = '1.05rem';
    hintBottom = 42;
    hintPadding = undefined;
    hintMaxWidth = undefined;
  } else {
    hintFontSize = '1.25rem';
    hintBottom = 60;
    hintPadding = undefined;
    hintMaxWidth = undefined;
  }

  // Адаптивные размеры для спрайтов и каунтеров
  let COUNTER_ICON_SIZE;
  let playerWidth, playerMaxWidth, playerMinWidth;
  let npcWidth, npcMaxWidth, npcMinWidth;
  let lexaWidth, lexaMaxWidth, lexaMinWidth;
  if (windowWidth < 1000) {
    COUNTER_ICON_SIZE = 81; // было 54
    playerWidth = '18vw'; playerMaxWidth = 96; playerMinWidth = 40;
    npcWidth = '20vw'; npcMaxWidth = 110; npcMinWidth = 44;
    lexaWidth = '30vw'; lexaMaxWidth = 165; lexaMinWidth = 66;
  } else if (windowWidth >= 1000 && windowWidth <= 1500) {
    COUNTER_ICON_SIZE = 120; // было 80
    playerWidth = '12vw'; playerMaxWidth = 120; playerMinWidth = 56;
    npcWidth = '14vw'; npcMaxWidth = 150; npcMinWidth = 64;
    lexaWidth = '20vw'; lexaMaxWidth = 220; lexaMinWidth = 96;
  } else {
    COUNTER_ICON_SIZE = 210; // было 140
    playerWidth = '9vw'; playerMaxWidth = undefined; playerMinWidth = 64;
    npcWidth = '11vw'; npcMaxWidth = undefined; npcMinWidth = 72;
    lexaWidth = '16vw'; lexaMaxWidth = undefined; lexaMinWidth = 108;
  }

  // Анимация NPC до прохождения квеста
  const [isPashaAnimated, setIsPashaAnimated] = useState(false);
  const [isPolinaAnimated, setIsPolinaAnimated] = useState(false);
  const [isHrLenaAnimated, setIsHrLenaAnimated] = useState(false);
  const [isLexaAnimated, setIsLexaAnimated] = useState(false);

  // Эффекты для анимации NPC
  useEffect(() => {
    if (!completedPasha && !isNearNpc) {
      setIsPashaAnimated(true);
      const interval = setInterval(() => setIsPashaAnimated(a => !a), 1000);
      return () => clearInterval(interval);
    } else {
      setIsPashaAnimated(false);
    }
  }, [completedPasha, isNearNpc]);

  useEffect(() => {
    if (!completedPolina && !isNearPolina) {
      setIsPolinaAnimated(true);
      const interval = setInterval(() => setIsPolinaAnimated(a => !a), 1000);
      return () => clearInterval(interval);
    } else {
      setIsPolinaAnimated(false);
    }
  }, [completedPolina, isNearPolina]);

  useEffect(() => {
    if (!completedHrLena && !isNearHrLena) {
      setIsHrLenaAnimated(true);
      const interval = setInterval(() => setIsHrLenaAnimated(a => !a), 1000);
      return () => clearInterval(interval);
    } else {
      setIsHrLenaAnimated(false);
    }
  }, [completedHrLena, isNearHrLena]);

  useEffect(() => {
    if (!completedLexa && !isNearLexa) {
      setIsLexaAnimated(true);
      const interval = setInterval(() => setIsLexaAnimated(a => !a), 1000);
      return () => clearInterval(interval);
    } else {
      setIsLexaAnimated(false);
    }
  }, [completedLexa, isNearLexa]);

  // Анимация Пиццы (аналогично другим NPC)
  useEffect(() => {
    if (isPizzaVisible && !isNearPizza && !completedPizza) {
      setIsPizzaAnimated(true);
      const interval = setInterval(() => setIsPizzaAnimated(a => !a), 1000);
      return () => clearInterval(interval);
    } else {
      setIsPizzaAnimated(false);
    }
  }, [isPizzaVisible, isNearPizza, completedPizza]);

  useEffect(() => {
    function handleKeyDown(e) {
      setCell(pos => {
        let { col, row } = pos;
        let newDirection = direction;
        let nextCol = col;
        let nextRow = row;
        if (e.key === 'ArrowUp') {
          if (row > minRow) nextRow -= 1;
          newDirection = 'back';
        } else if (e.key === 'ArrowDown') {
          if (row < maxRow) nextRow += 1;
          newDirection = 'front';
        } else if (e.key === 'ArrowLeft') {
          if (col > minCol) nextCol -= 1;
          newDirection = 'left';
        } else if (e.key === 'ArrowRight') {
          if (col < maxCol) nextCol += 1;
          newDirection = 'right';
        }
        // Проверяем, не входит ли следующая клетка в охранное поле
        if (!isBlockedCell(nextCol, nextRow)) {
          setDirection(newDirection);
          // Отмечаем, что игрок начал двигаться
          setHasMoved(true);
          return { col: nextCol, row: nextRow };
        } else {
          setDirection(newDirection);
          return { col, row };
        }
      });
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const spriteMap = {
    front: '/me_front.png',
    back: '/me_back.png',
    left: '/me_left.png',
    right: '/me_right.png',
  };

  // Игрок всегда отображается своим обычным спрайтом
  const playerSprite = spriteMap[direction];

  // Вычисляем позицию персонажа в процентах по сетке
  const left = ((cell.col - 0.5) / columns) * 100;
  const top = ((cell.row - 0.5) / rows) * 100;

  // Обработка пробела для диалога-пар
  useEffect(() => {
    if (!dialogActive) {
      setDialogPairStep(0);
      setShowPlayerReply(false);
      setShowProjectCard(false);
      setActiveNpc(null);
      return;
    }
    function handleSpace(e) {
      if (e.code === 'Space') {
        if (!showPlayerReply) {
          // Запоминаем, с каким NPC начат диалог
          if (isNearPolina) setActiveNpc('polina');
          else if (isNearHrLena) setActiveNpc('hrlena');
          else if (isNearLexa) setActiveNpc('lexa');
          else if (isNearPizza) setActiveNpc('pizza');
          else if (isNearNpc) setActiveNpc('pasha');
          setShowPlayerReply(true);
        } else if (dialogPairStep < activeDialogPairs.length - 1) {
          setDialogPairStep(s => s + 1);
        } else if (!showProjectCard) {
          setShowProjectCard(true);
        } else {
          // Для Пиццы не закрываем карточку через пробел
          if (activeNpc === 'pizza') return;
          // Отмечаем завершённого NPC
          if (activeNpc === 'pasha') setCompletedPasha(true);
          if (activeNpc === 'polina') setCompletedPolina(true);
          if (activeNpc === 'hrlena') setCompletedHrLena(true);
          if (activeNpc === 'lexa') setCompletedLexa(true);
          if (activeNpc === 'pizza') setCompletedPizza(true);
          // Добавляем в порядок завершения, если ещё не добавлен
          setCompletedOrder(prev => prev.includes(activeNpc) ? prev : [...prev, activeNpc]);
          setCompletedProjects(prev => {
            const idx = prev.findIndex(x => !x);
            if (idx === -1) return prev;
            const next = [...prev];
            next[idx] = true;
            return next;
          });
          setDialogPairStep(0);
          setShowPlayerReply(false);
          setShowProjectCard(false);
          setActiveNpc(null);
        }
      }
    }
    window.addEventListener('keydown', handleSpace);
    return () => window.removeEventListener('keydown', handleSpace);
  }, [dialogActive, showPlayerReply, dialogPairStep, showProjectCard, isNearNpc, isNearPolina, isNearHrLena, isNearLexa, activeDialogPairs.length]);

  // Добавляем CSS-анимацию для мигания баббла игрока
  const blinkKeyframes = `
  @keyframes playerBlink {
    0% { background: #1976d2; }
    100% { background: #fff; }
  }`;
  if (typeof document !== 'undefined' && !document.getElementById('player-blink-keyframes')) {
    const style = document.createElement('style');
    style.id = 'player-blink-keyframes';
    style.innerHTML = blinkKeyframes;
    document.head.appendChild(style);
  }

  // Карточка проекта для Паши
  const pashaProjectCard = (
    <>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          border: '2.5px solid #3566b0',
          borderBottom: '2.5px solid #222',
          borderRadius: '16px 16px 0 0',
          padding: '0 32px 32px 32px',
          minWidth: 420,
          maxWidth: 800,
          width: 'auto',
          minHeight: 320,
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
          fontSize: '1rem',
          textAlign: 'center',
          boxShadow: '0 4px 0 #222',
          overflow: 'hidden',
        }}
      >
        <div style={{
          background: 'linear-gradient(to bottom, #3a6ea5 0%, #2b5797 100%)',
          color: '#fff',
          padding: '10px 32px',
          paddingBottom: '12px',
          borderBottom: '2px solid #222',
          borderRadius: '12px 12px 0 0',
          width: '100%',
          fontWeight: 900,
          fontSize: '1.1rem',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span>Метрики Time To Market</span>
          <span style={{ display: 'flex', gap: 6, marginLeft: 16 }}>
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#ff5f56', border: '1.5px solid #222', display: 'inline-block' }} />
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#ffbd2e', border: '1.5px solid #222', display: 'inline-block' }} />
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#27c93f', border: '1.5px solid #222', display: 'inline-block' }} />
          </span>
        </div>
        <div style={{ height: 24 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1em', textAlign: 'left', width: '100%', marginTop: 0 }}>
          Задача
        </div>
        <div style={{ fontSize: '0.85rem', marginBottom: '1em', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
          Нужно было понять, где теряется время при выводе новых фичей и как ускорить релизы.
        </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1em', textAlign: 'left', width: '100%', marginTop: '24px' }}>
          Решение
        </div>
        <div style={{ fontSize: '0.85rem', marginBottom: '1em', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
          Внедрил метрики Time To Market, автоматизировал сбор данных, построил дешборд и провёл ретроспективу с командой.
        </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1em', textAlign: 'left', width: '100%', marginTop: '24px' }}>
          Результат
        </div>
        <div style={{ fontSize: '0.85rem', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
          Команда увидела реальные узкие места и ускорила релизы на 30%.
          </div>
        </div>
      </div>
      {/* Подсказка вне баббла */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 'calc(50% + 270px)',
          transform: 'translate(-50%, 0)',
          color: 'white',
          fontSize: '0.8rem',
          zIndex: 201,
          fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
          whiteSpace: 'nowrap',
          padding: 0,
          margin: 0,
        }}
      >
        Нажми Пробел, чтобы закрыть
      </div>
    </>
  );

  // Карточка проекта для Лены
  const hrLenaProjectCard = (
    <>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          border: '2.5px solid #3566b0',
          borderBottom: '2.5px solid #222',
          borderRadius: '16px 16px 0 0',
          padding: '0 32px 32px 32px',
          minWidth: 420,
          maxWidth: 800,
          width: 'auto',
          minHeight: 320,
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
          fontSize: '1rem',
          textAlign: 'center',
          boxShadow: '0 4px 0 #222',
          overflow: 'hidden',
        }}
      >
        <div style={{
          background: 'linear-gradient(to bottom, #3a6ea5 0%, #2b5797 100%)',
          color: '#fff',
          padding: '10px 32px',
          paddingBottom: '12px',
          borderBottom: '2px solid #222',
          borderRadius: '12px 12px 0 0',
          width: '100%',
          fontWeight: 900,
          fontSize: '1.1rem',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span>Онбординг новых сотрудников</span>
          <span style={{ display: 'flex', gap: 6, marginLeft: 16 }}>
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#ff5f56', border: '1.5px solid #222', display: 'inline-block' }} />
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#ffbd2e', border: '1.5px solid #222', display: 'inline-block' }} />
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#27c93f', border: '1.5px solid #222', display: 'inline-block' }} />
          </span>
        </div>
        <div style={{ height: 24 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1em', textAlign: 'left', width: '100%', marginTop: 0 }}>
          Задача
        </div>
        <div style={{ fontSize: '0.85rem', marginBottom: '1em', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
          У новых сотрудников не было нужной инфы: кто за что отвечает, как устроена структура и как работает сложный продукт
        </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1em', textAlign: 'left', width: '100%', marginTop: '24px' }}>
          Решение
        </div>
        <div style={{ fontSize: '0.85rem', marginBottom: '1em', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
          Я исследовал CJM нового сотрудника и проанализировал выводы. Решением стали обучающий курс, чек-лист и сводная страница в Confluence.
        </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1em', textAlign: 'left', width: '100%', marginTop: '24px' }}>
          Результат
        </div>
        <div style={{ fontSize: '0.85rem', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
          Выходные NPS-опросы подтверждают высокий уровень удовлетворенности процессом онбординга.
          </div>
        </div>
      </div>
      {/* Подсказка вне баббла */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 'calc(50% + 270px)',
          transform: 'translate(-50%, 0)',
          color: 'white',
          fontSize: '0.8rem',
          zIndex: 201,
          fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
          whiteSpace: 'nowrap',
          padding: 0,
          margin: 0,
        }}
      >
        Нажми Пробел, чтобы закрыть
      </div>
    </>
  );

  // Карточка проекта для Полины
  const polinaProjectCard = (
    <>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          border: '2.5px solid #3566b0',
          borderBottom: '2.5px solid #222',
          borderRadius: '16px 16px 0 0',
          padding: '0 32px 32px 32px',
          minWidth: 420,
          maxWidth: 800,
          width: 'auto',
          minHeight: 320,
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
          fontSize: '1rem',
          textAlign: 'center',
          boxShadow: '0 4px 0 #222',
          overflow: 'hidden',
        }}
      >
        <div style={{
          background: 'linear-gradient(to bottom, #3a6ea5 0%, #2b5797 100%)',
          color: '#fff',
          padding: '10px 32px',
          paddingBottom: '12px',
          borderBottom: '2px solid #222',
          borderRadius: '12px 12px 0 0',
          width: '100%',
          fontWeight: 900,
          fontSize: '1.1rem',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span>Операционный контроль в Jira</span>
          <span style={{ display: 'flex', gap: 6, marginLeft: 16 }}>
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#ff5f56', border: '1.5px solid #222', display: 'inline-block' }} />
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#ffbd2e', border: '1.5px solid #222', display: 'inline-block' }} />
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#27c93f', border: '1.5px solid #222', display: 'inline-block' }} />
          </span>
        </div>
        <div style={{ height: 24 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1em', textAlign: 'left', width: '100%', marginTop: 0 }}>
          Задача
        </div>
        <div style={{ fontSize: '0.85rem', marginBottom: '1em', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
            8 продуктовых команд —  разные подходы к статусам. Нужно было унифицировать процесс.
        </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1em', textAlign: 'left', width: '100%', marginTop: '24px' }}>
          Решение
        </div>
        <div style={{ fontSize: '0.85rem', marginBottom: '1em', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
            Провёл аудит, собрал требования, разработал флоу задач и шаблон отчёта, внедрил единый процесс и обучил команды.
        </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1em', textAlign: 'left', width: '100%', marginTop: '24px' }}>
          Результат
        </div>
        <div style={{ fontSize: '0.85rem', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
            Теперь у руководителя есть наглядный инструмент для контроля, а у команд — прозрачный и регулярный формат статусов.
          </div>
        </div>
      </div>
      {/* Подсказка вне баббла */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 'calc(50% + 270px)',
          transform: 'translate(-50%, 0)',
          color: 'white',
          fontSize: '0.8rem',
          zIndex: 201,
          fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
          whiteSpace: 'nowrap',
          padding: 0,
          margin: 0,
        }}
      >
        Нажми Пробел, чтобы закрыть
      </div>
    </>
  );

  // Карточка проекта для Лехи
  const lexaProjectCard = (
    <>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          border: '2.5px solid #3566b0', // XP blue
          borderBottom: '2.5px solid #222',
          borderRadius: '16px 16px 0 0', // только сверху
          padding: '0 32px 32px 32px',
          minWidth: 420,
          maxWidth: 800,
          width: 'auto',
          minHeight: 320,
          zIndex: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
          fontSize: '1rem',
          textAlign: 'center',
          boxShadow: '0 4px 0 #222',
          overflow: 'hidden',
        }}
      >
        {/* XP Title Bar */}
        <div style={{
          background: 'linear-gradient(to bottom, #3a6ea5 0%, #2b5797 100%)',
          color: '#fff',
          padding: '10px 32px',
          paddingBottom: '12px',
          borderBottom: '2px solid #222',
          borderRadius: '12px 12px 0 0',
          width: '100%',
          fontWeight: 900,
          fontSize: '1.1rem',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span>Анализ взаимодействия с ИТ</span>
          <span style={{ display: 'flex', gap: 6, marginLeft: 16 }}>
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#ff5f56', border: '1.5px solid #222', display: 'inline-block' }} />
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#ffbd2e', border: '1.5px solid #222', display: 'inline-block' }} />
            <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#27c93f', border: '1.5px solid #222', display: 'inline-block' }} />
          </span>
        </div>
        <div style={{ height: 24 }} />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1em', textAlign: 'left', width: '100%', marginTop: 0 }}>
          Задача
        </div>
        <div style={{ fontSize: '0.85rem', marginBottom: '1em', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
            ИТ лидировали встречу с приоритетами за круглым столом с заказчиками. Общих принципов приоритезации не было и всем было сложно договориться.
        </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1em', textAlign: 'left', width: '100%', marginTop: '24px' }}>
          Решение
        </div>
        <div style={{ fontSize: '0.85rem', marginBottom: '1em', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
            Провёл аудит взаимодействия, описал болевые точки и предложил единый принцип приоритезации, за который теперь отвечают бизнес-команды.
        </div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '1em', textAlign: 'left', width: '100%', marginTop: '24px' }}>
          Результат
        </div>
        <div style={{ fontSize: '0.85rem', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
            Процесс стал прозрачным: бизнес приносит уже согласованный бэклог, а ИТ фокусируется на задачах с понятным приоритетом.
          </div>
        </div>
      </div>
      {/* Подсказка вне баббла */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 'calc(50% + 270px)',
          transform: 'translate(-50%, 0)',
          color: 'white',
          fontSize: '0.8rem',
          zIndex: 201,
          fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
          whiteSpace: 'nowrap',
          padding: 0,
          margin: 0,
        }}
      >
        Нажми Пробел, чтобы закрыть
      </div>
    </>
  );

  // --- Внутри компонента Game, рядом с карточками других NPC ---
  const [pizzaQuizStep, setPizzaQuizStep] = useState(0); // 0: тест, 1: финальная карточка
  const [pizzaAnswers, setPizzaAnswers] = useState([null, null, null]);

  const pizzaQuizCard = (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        border: '2.5px solid #3566b0',
        borderBottom: '2.5px solid #222',
        borderRadius: '16px 16px 0 0',
        padding: '0 32px 32px 32px',
        minWidth: 420,
        maxWidth: 800,
        width: 'auto',
        minHeight: 320,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
        fontSize: '1rem',
        textAlign: 'center',
        boxShadow: '0 4px 0 #222',
        overflow: 'hidden',
      }}
    >
      <div style={{
        background: 'linear-gradient(to bottom, #3a6ea5 0%, #2b5797 100%)',
        color: '#fff',
        padding: '10px 32px',
        paddingBottom: '12px',
        borderBottom: '2px solid #222',
        borderRadius: '12px 12px 0 0',
        width: '100%',
        fontWeight: 900,
        fontSize: '1.1rem',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>Мини-тест для будущих коллег</span>
        <span style={{ display: 'flex', gap: 6, marginLeft: 16 }}>
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#ff5f56', border: '1.5px solid #222', display: 'inline-block' }} />
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#ffbd2e', border: '1.5px solid #222', display: 'inline-block' }} />
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#27c93f', border: '1.5px solid #222', display: 'inline-block' }} />
        </span>
      </div>
      <div style={{ height: 24 }} />
      <div style={{ width: '100%', marginBottom: '1.2em', textAlign: 'left', fontSize: '0.95rem', lineHeight: 1.7 }}>
        1. Подойдет ли вам парень, готовый <span style={{ color: '#1976d2', fontWeight: 700 }}>много и усердно</span> работать?
        <div style={{ marginTop: 8, marginBottom: 16, display: 'flex', gap: 24, alignItems: 'center', lineHeight: 2.1 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 700 }}>
            <input type="radio" name="pizza-q1" value="Да" checked={pizzaAnswers[0]==="Да"} onChange={() => setPizzaAnswers(a => ["Да", a[1], a[2]])} style={{ accentColor: '#1976d2', width: 18, height: 18 }} /> Да
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 700 }}>
            <input type="radio" name="pizza-q1" value="Нет" checked={pizzaAnswers[0]==="Нет"} onChange={() => setPizzaAnswers(a => ["Нет", a[1], a[2]])} style={{ accentColor: '#1976d2', width: 18, height: 18 }} /> Нет
          </label>
        </div>
        <div style={{ marginBottom: '1.2em' }} />
        2. Цените ли вы <span style={{ color: '#1976d2', fontWeight: 700 }}>исполнительность и самостоятельность</span>?
        <div style={{ marginTop: 8, marginBottom: 16, display: 'flex', gap: 24, alignItems: 'center', lineHeight: 2.1 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 700 }}>
            <input type="radio" name="pizza-q2" value="Да" checked={pizzaAnswers[1]==="Да"} onChange={() => setPizzaAnswers(a => [a[0], "Да", a[2]])} style={{ accentColor: '#1976d2', width: 18, height: 18 }} /> Да
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 700 }}>
            <input type="radio" name="pizza-q2" value="Нет" checked={pizzaAnswers[1]==="Нет"} onChange={() => setPizzaAnswers(a => [a[0], "Нет", a[2]])} style={{ accentColor: '#1976d2', width: 18, height: 18 }} /> Нет
          </label>
        </div>
        <div style={{ marginBottom: '1.2em' }} />
        3. Будут ли кстати в вашей команде острый бытовой <span style={{ color: '#1976d2', fontWeight: 700 }}>юмор и незашоренный ум</span>?
        <div style={{ marginTop: 8, marginBottom: 16, display: 'flex', gap: 24, alignItems: 'center', lineHeight: 2.1 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 700 }}>
            <input type="radio" name="pizza-q3" value="Да" checked={pizzaAnswers[2]==="Да"} onChange={() => setPizzaAnswers(a => [a[0], a[1], "Да"])} style={{ accentColor: '#1976d2', width: 18, height: 18 }} /> Да
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontWeight: 700 }}>
            <input type="radio" name="pizza-q3" value="Нет" checked={pizzaAnswers[2]==="Нет"} onChange={() => setPizzaAnswers(a => [a[0], a[1], "Нет"])} style={{ accentColor: '#1976d2', width: 18, height: 18 }} /> Нет
          </label>
        </div>
      </div>
      <button
        style={{ marginTop: 12, fontWeight: 900, fontSize: '1.1rem', borderRadius: 10, border: '2px solid #222', background: '#1976d2', color: '#fff', padding: '12px 36px', fontFamily: 'inherit', cursor: (pizzaAnswers[0]==='Да' && pizzaAnswers[1]==='Да' && pizzaAnswers[2]==='Да') ? 'pointer' : 'not-allowed', opacity: (pizzaAnswers[0]==='Да' && pizzaAnswers[1]==='Да' && pizzaAnswers[2]==='Да') ? 1 : 0.5 }}
        disabled={!(pizzaAnswers[0]==='Да' && pizzaAnswers[1]==='Да' && pizzaAnswers[2]==='Да')}
        onClick={() => setPizzaQuizStep(1)}
      >
        Ответить
      </button>
    </div>
  );

  const pizzaFinalCard = (
    <div
      style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        border: '2.5px solid #3566b0',
        borderBottom: '2.5px solid #222',
        borderRadius: '16px 16px 0 0',
        padding: '0 32px 32px 32px',
        minWidth: 420,
        maxWidth: 800,
        width: 'auto',
        minHeight: 320,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
        fontSize: '1rem',
        textAlign: 'center',
        boxShadow: '0 4px 0 #222',
        overflow: 'hidden',
      }}
    >
      <div style={{
        background: 'linear-gradient(to bottom, #3a6ea5 0%, #2b5797 100%)',
        color: '#fff',
        padding: '10px 32px',
        paddingBottom: '12px',
        borderBottom: '2px solid #222',
        borderRadius: '12px 12px 0 0',
        width: '100%',
        fontWeight: 900,
        fontSize: '1.1rem',
        textAlign: 'left',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>Спасибо за внимание!</span>
        <span style={{ display: 'flex', gap: 6, marginLeft: 16 }}>
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#ff5f56', border: '1.5px solid #222', display: 'inline-block' }} />
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#ffbd2e', border: '1.5px solid #222', display: 'inline-block' }} />
          <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#27c93f', border: '1.5px solid #222', display: 'inline-block' }} />
        </span>
      </div>
      <div style={{ height: 24 }} />
      <div style={{ fontSize: '0.95rem', color: '#222', marginBottom: '1.2em', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
        Сейчас я ищу возможности, где смогу применить свой опыт для создания полезных и работающих решений.
      </div>
      <div style={{ fontSize: '0.95rem', color: '#222', marginBottom: '1.2em', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
        Я умею придумывать, наводить порядок и делать это без лишнего шума. Предпочитаю работать тихо и профессионально, но с чувством юмора.
      </div>
      <div style={{ fontSize: '0.95rem', color: '#222', marginBottom: '1.2em', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>
        До встречи на собеседовании!
      </div>
      <div style={{ fontSize: '0.95rem', color: '#222', marginBottom: '1.2em', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>&nbsp;</div>
      <div style={{ fontSize: '0.95rem', color: '#222', marginBottom: '1.2em', textAlign: 'left', width: '100%', lineHeight: 1.7 }}>&nbsp;</div>
      <div style={{display:'flex',gap:32,flexWrap:'wrap',marginTop:16,justifyContent:'flex-start',alignItems:'flex-start',alignSelf:'flex-start',width:'100%'}}>
        <a href="/resume_fin.pdf" target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'flex-start',textDecoration:'none'}}>
          <img src="/hh.png" alt="Скачать резюме" style={{width:48,height:48,border:'3px solid #222',borderRadius:6,background:'#fff'}} />
        </a>
        <a href="https://t.me/washe_chuvachestvo" target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'flex-start',textDecoration:'none'}}>
          <img src="/tg.png" alt="Telegram" style={{width:48,height:48,border:'3px solid #222',borderRadius:6,background:'#fff'}} />
        </a>
        <a href="https://washechuvachestvo.notion.site/11f172e21500808782edf8cb8ab43cab" target="_blank" rel="noopener noreferrer" style={{display:'flex',alignItems:'flex-start',textDecoration:'none'}}>
          <img src="/me.png" alt="Еще раз!" style={{width:48,height:48,border:'3px solid #222',borderRadius:6,background:'#fff'}} />
        </a>
      </div>
    </div>
  );

  return (
    <div
      className="game-field"
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: 'url(/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        margin: 0,
        borderRadius: 0,
        boxShadow: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Затемнение поля при показе карточки */}
      {showProjectCard && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.55)',
          zIndex: 100,
        }} />
      )}
      <img
        src={playerSprite}
        alt="Персонаж"
        style={{
          position: 'absolute',
          left: `${left}%`,
          top: `${top}%`,
          width: playerWidth,
          ...(playerMaxWidth !== undefined ? { maxWidth: playerMaxWidth } : {}),
          minWidth: playerMinWidth,
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          zIndex: 3,
          pointerEvents: 'none',
        }}
      />
      {/* NPC: bold_pm */}
      {!completedPasha && (
      <img
          src={isNearNpc ? "/bold_pm_up.png" : isPashaAnimated ? "/bold_pm_up.png" : "/bold_pm.png"}
        alt="Коллега PM"
        style={{
          position: 'absolute',
          left: `${((10.5 - 0.5) / columns) * 100}%`,
          top: `${((3 - 1) / rows) * 100}%`,
          width: npcWidth,
          ...(npcMaxWidth !== undefined ? { maxWidth: npcMaxWidth } : {}),
          minWidth: npcMinWidth,
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          zIndex: 2, // NPC под игроком
          pointerEvents: 'none',
        }}
      />
      )}
      {/* NPC: blond_pm (Полина) */}
      {!completedPolina && (
      <img
          src={isNearPolina ? "/blond_down.png" : isPolinaAnimated ? "/blond_down.png" : "/blond.png"}
        alt="Тимлид Полина"
        style={{
          position: 'absolute',
          left: `${((polinaColStart + polinaColEnd) / 2 - 0.5) / columns * 100}%`,
          top: `${((polinaRow - 1) / rows) * 100}%`,
          width: npcWidth,
          ...(npcMaxWidth !== undefined ? { maxWidth: npcMaxWidth } : {}),
          minWidth: npcMinWidth,
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      )}
      {/* NPC: HR Лена */}
      {!completedHrLena && (
      <img
          src={isNearHrLena ? "/hr_stay.png" : isHrLenaAnimated ? "/hr_stay.png" : "/hr_drink.png"}
        alt="HR Лена"
        style={{
          position: 'absolute',
          left: `${((hrLenaColStart + hrLenaColEnd) / 2 - 0.5) / columns * 100}%`,
          top: `${((hrLenaRow - 1) / rows) * 100}%`,
          width: npcWidth,
          ...(npcMaxWidth !== undefined ? { maxWidth: npcMaxWidth } : {}),
          minWidth: npcMinWidth,
          height: 'auto',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      )}
      {/* NPC: Лёха */}
      {!completedLexa && (
        <img
          src={isNearLexa ? "/coder_active.png" : isLexaAnimated ? "/coder_active.png" : "/coder_stay.png"}
          alt="Разработчик Леха"
          style={{
            position: 'absolute',
            left: `${((lexaColStart + lexaColEnd) / 2 - 0.5) / columns * 100}%`,
            top: `${((lexaRowStart + lexaRowEnd) / 2 - 0.5) / rows * 100}%`,
            width: lexaWidth,
            ...(lexaMaxWidth !== undefined ? { maxWidth: lexaMaxWidth } : {}),
            minWidth: lexaMinWidth,
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        />
      )}
      {/* NPC: Пицца (финал) */}
      {isPizzaVisible && !completedPizza && (
        <img
          src={isNearPizza ? "/pizza_up.png" : isPizzaAnimated ? "/pizza_up.png" : "/pizza_down.png"}
          alt="Пицца"
          style={{
            position: 'absolute',
            left: `${((pizzaColStart + pizzaColEnd) / 2 - 0.5) / columns * 100}%`,
            top: `${((pizzaRow - 0.5) / rows) * 100}%`,
            width: npcWidth,
            ...(npcMaxWidth !== undefined ? { maxWidth: npcMaxWidth } : {}),
            minWidth: npcMinWidth,
            height: 'auto',
            transform: 'translate(-50%, -50%)',
            zIndex: 4,
            pointerEvents: 'none',
          }}
        />
      )}
      {/* Стартовый баббл */}
      {!hasMoved && !dialogActive && !showProjectCard && (
        <div
          style={{
            position: 'absolute',
            right: '2vw',
            bottom: '260px',
            zIndex: 31,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            minWidth: bubbleMinWidth,
            maxWidth: bubbleMaxWidth,
            width: bubbleWidth,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: bubbleGap, marginBottom: 4, alignSelf: 'flex-start' }}>
            <img src="/me_avatar.png" alt="Проджект Никита" style={{ width: bubbleIconSize, height: bubbleIconSize, borderRadius: 6, border: '2px solid #222', background: '#fff' }} />
            <span style={{ fontWeight: 900, fontSize: bubbleNameFontSize, fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace' }}>Проджект Никита</span>
          </div>
          <div
            style={{
              background: '#1976d2',
              border: '3px solid black',
              borderRadius: 8,
              boxShadow: '0 2px 0 #222',
              padding: bubblePadding,
              width: '100%',
              fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
              letterSpacing: '0.5px',
              lineHeight: 1.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              boxSizing: 'border-box',
              animation: 'playerBlink 1.2s steps(2, start) infinite',
            }}
          >
            <div
              style={{
                fontSize: bubbleFontSize,
                width: '100%',
                minHeight: bubbleMinHeight,
                textAlign: 'left',
                wordBreak: 'break-word',
              }}
            >
              Ох, новый день в любимом офисе. Пора за работу!
            </div>
          </div>
        </div>
      )}
      {/* Активационный баббл для всех NPC */}
      {!showProjectCard && !showPlayerReply && dialogPairStep === 0 && (
        (isNearNpc && !completedPasha) ||
        (isNearPolina && !completedPolina) ||
        (isNearHrLena && !completedHrLena) ||
        (isNearLexa && !completedLexa) ||
        isNearPizza
      ) && (
          <>
            <div
              style={{
                position: 'absolute',
                right: '1vw',
                bottom: '100px',
                zIndex: 31,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                minWidth: bubbleMinWidth,
                maxWidth: bubbleMaxWidth,
                width: bubbleWidth,
                gap: bubbleGap,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: bubbleGap, marginBottom: 12 }}>
                {isNearNpc && (
                  <>
                    <img src="/bold_pm_avatar.png" alt="Продакт Паша" style={{ width: bubbleIconSize, height: bubbleIconSize, borderRadius: 6, border: '2px solid #222', background: '#fff' }} />
                    <span style={{ fontWeight: 900, fontSize: bubbleNameFontSize, fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace' }}>Продакт Паша</span>
                  </>
                )}
                {isNearPolina && (
                  <>
                    <img src="/blond_avatar.png" alt="Тимлид Полина" style={{ width: bubbleIconSize, height: bubbleIconSize, borderRadius: 6, border: '2px solid #222', background: '#fff' }} />
                    <span style={{ fontWeight: 900, fontSize: bubbleNameFontSize, fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace' }}>Тимлид Полина</span>
                  </>
                )}
                {isNearHrLena && (
                  <>
                    <img src="/hr_avatar.png" alt="HR Лена" style={{ width: bubbleIconSize, height: bubbleIconSize, borderRadius: 6, border: '2px solid #222', background: '#fff' }} />
                    <span style={{ fontWeight: 900, fontSize: bubbleNameFontSize, fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace' }}>HR Лена</span>
                  </>
                )}
              {isNearLexa && (
                <>
                  <img src="/coder_avatar.png" alt="Разработчик Леха" style={{ width: bubbleIconSize, height: bubbleIconSize, borderRadius: 6, border: '2px solid #222', background: '#fff' }} />
                  <span style={{ fontWeight: 900, fontSize: bubbleNameFontSize, fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace' }}>Разработчик Леха</span>
                </>
              )}
              {isNearPizza && (
                <>
                  <img src="/pizza_down.png" alt="Денежка" style={{ width: bubbleIconSize, height: bubbleIconSize, borderRadius: 6, border: '2px solid #222', background: '#fff' }} />
                  <span style={{ fontWeight: 900, fontSize: bubbleNameFontSize, fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace' }}>Денежка</span>
                  </>
                )}
              </div>
              <div
                style={{
                  background: 'white',
                  border: '3px solid black',
                  borderRadius: 8,
                  boxShadow: '0 2px 0 #222',
                  padding: bubblePadding,
                  maxWidth: bubbleMaxWidth,
                  fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
                  letterSpacing: '0.5px',
                  lineHeight: 1.5,
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  boxSizing: 'border-box',
                  wordBreak: 'break-word',
                }}
              >
                <div style={{ fontSize: bubbleFontSize, width: '100%', wordBreak: 'break-word' }}>
                  {isNearNpc && 'Я потерял счет времени!'}
                  {isNearPolina && 'Непорядок в беклоге!'}
                  {isNearHrLena && 'Го онбординг!'}
                {isNearLexa && 'Опять летят метеориты!'}
                {isNearPizza && 'Денежка: Возьми меня!'}
                </div>
              </div>
            </div>
          {/* Подсказка под бабблом — всегда показывать, если виден активационный баббл */}
              <div
                style={{
                  position: 'absolute',
                  right: '2vw',
                  bottom: '42px',
                  color: '#1976d2',
                  fontWeight: 600,
                  fontSize: hintFontSize,
                  fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
                  zIndex: 31,
                  textShadow: '0 1px 2px #fff',
                }}
              >
            {isNearPizza ? 'Ом-ном-ном!' : 'Пробел, чтобы помочь'}
              </div>
          </>
      )}
      {/* Бабблы с репликами NPC и игрока */}
      {!showProjectCard && dialogActive && dialogPairStep >= 0 && showPlayerReply && activeNpc && (
        <>
          <div
            style={{
              position: 'absolute',
              right: '2vw',
              bottom: '100px',
              zIndex: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: bubbleGap,
              minWidth: bubbleMinWidth,
              maxWidth: bubbleMaxWidth,
              width: bubbleWidth,
            }}
          >
            {/* Имя и иконка NPC над бабблом */}
            <div style={{ display: 'flex', alignItems: 'center', gap: bubbleGap, marginBottom: 4, alignSelf: 'flex-start' }}>
              <img src={activeDialogPairs[dialogPairStep].npc.avatar} alt={activeDialogPairs[dialogPairStep].npc.name} style={{ width: bubbleIconSize, height: bubbleIconSize, borderRadius: 6, border: '2px solid #222', background: '#fff' }} />
              <span style={{ fontWeight: 900, fontSize: bubbleNameFontSize, fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace' }}>{activeDialogPairs[dialogPairStep].npc.name}</span>
            </div>
            {/* Баббл NPC */}
            <div
              style={{
                background: 'white',
                border: '3px solid black',
                borderRadius: 8,
                boxShadow: '0 2px 0 #222',
                padding: bubblePadding,
                width: '100%',
                fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
                letterSpacing: '0.5px',
                lineHeight: 1.5,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                marginBottom: showPlayerReply ? 18 : 0,
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontSize: bubbleFontSize,
                  width: '100%',
                  minHeight: bubbleMinHeight,
                  textAlign: 'left',
                  wordBreak: 'break-word',
                }}
              >
                {activeDialogPairs[dialogPairStep].npc.text}
              </div>
            </div>
            {/* Имя и иконка игрока над бабблом */}
            <div style={{ display: 'flex', alignItems: 'center', gap: bubbleGap, marginBottom: 4, alignSelf: 'flex-start' }}>
              <img src={activeDialogPairs[dialogPairStep].player.avatar} alt={activeDialogPairs[dialogPairStep].player.name} style={{ width: bubbleIconSize, height: bubbleIconSize, borderRadius: 6, border: '2px solid #222', background: '#fff' }} />
              <span style={{ fontWeight: 900, fontSize: bubbleNameFontSize, fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace' }}>{activeDialogPairs[dialogPairStep].player.name}</span>
                </div>
                <div
                  style={{
                    background: '#1976d2',
                    border: '3px solid black',
                    borderRadius: 8,
                    boxShadow: '0 2px 0 #222',
                padding: bubblePadding,
                    width: '100%',
                    fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
                    letterSpacing: '0.5px',
                    lineHeight: 1.5,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    boxSizing: 'border-box',
                    animation: 'playerBlink 1.2s steps(2, start) infinite',
                  }}
                >
                  <div
                    style={{
                  fontSize: bubbleFontSize,
                      width: '100%',
                  minHeight: bubbleMinHeight,
                      textAlign: 'left',
                      wordBreak: 'break-word',
                    }}
                  >
                    {activeDialogPairs[dialogPairStep].player.text}
                  </div>
                </div>
          </div>
          {/* Статичная подсказка для диалога */}
            <div
              style={{
                position: 'absolute',
                right: '2vw',
                bottom: '42px',
                color: '#1976d2',
                fontWeight: 600,
                fontSize: hintFontSize,
                fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
                zIndex: 31,
                textShadow: '0 1px 2px #fff',
              }}
            >
            Пробел, чтобы ответить
            </div>
        </>
      )}
      {/* Карточка проекта */}
      {showProjectCard && (
        <>
          {activeNpc === 'pasha' && !completedPasha ? pashaProjectCard :
           activeNpc === 'hrlena' && !completedHrLena ? hrLenaProjectCard :
           activeNpc === 'polina' && !completedPolina ? polinaProjectCard :
           activeNpc === 'lexa' && !completedLexa ? lexaProjectCard :
           activeNpc === 'pizza' && !completedPizza ? (
            <>
              {activeNpc === 'pizza' && !completedPizza ? (
                pizzaQuizStep === 0 ? pizzaQuizCard : pizzaFinalCard
              ) : null}
            </>
          ) : null}
        </>
      )}
      {/* Иконки-каунтеры завершённых проектов */}
      {!showProjectCard && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 12,
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'row',
            gap: 24,
            zIndex: 300,
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          {counterIcons.map((icon, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
              <img
                src={icon ? icon : '/icon_project_default.png'}
                alt={`Проект ${i + 1}`}
                style={{
                  width: COUNTER_ICON_SIZE,
                  height: COUNTER_ICON_SIZE,
                  ...(COUNTER_ICON_SIZE < 140 ? { maxWidth: COUNTER_ICON_SIZE } : {}),
                  opacity: icon ? 1 : 0.35,
                  filter: icon ? 'none' : 'grayscale(1)',
                  transition: 'opacity 0.3s',
                }}
              />
            </div>
          ))}
        </div>
      )}
      {/* Подсказка по управлению стрелками */}
      {!isNearNpc && !isNearPolina && !isNearHrLena && !isNearLexa && !isNearPizza && (
        <div
          style={{
            position: 'absolute',
            right: '2vw',
            bottom: '42px',
            color: '#1976d2',
            fontWeight: 600,
            fontSize: hintFontSize,
            fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
            zIndex: 31,
            textShadow: '0 1px 2px #fff',
            pointerEvents: 'none',
            userSelect: 'none',
            letterSpacing: '0.5px',
            lineHeight: 1.5,
          }}
        >
          {isPizzaVisible ? 'Забери денежку!' : 'Управляй стрелками!'}
        </div>
      )}
    </div>
  );
}

function App() {
  const [started, setStarted] = useState(false);
  // Состояние для ширины окна (адаптивность)
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  // Состояние для анимации картинки в заглушке
  const [isAnimated, setIsAnimated] = useState(false);
  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimated(prev => !prev);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (windowWidth < 1200) {
    // Адаптивные размеры для заглушки
    let headerFontSize, textFontSize, buttonFontSize, buttonPadding, gap, playerImgMaxWidth, maxWidth;
    if (windowWidth < 700) {
      headerFontSize = '1rem';
      textFontSize = '0.6rem';
      buttonFontSize = '0.7rem';
      buttonPadding = '0.4rem 0.7rem';
      gap = '0.5rem';
      playerImgMaxWidth = '90px';
      maxWidth = '92vw';
    } else if (windowWidth < 1000) {
      headerFontSize = '1.3rem';
      textFontSize = '0.8rem';
      buttonFontSize = '0.9rem';
      buttonPadding = '0.6rem 1.2rem';
      gap = '1rem';
      playerImgMaxWidth = '140px';
      maxWidth = '80vw';
    } else if (windowWidth < 1500) {
      headerFontSize = '1.7rem';
      textFontSize = '0.95rem';
      buttonFontSize = '1.1rem';
      buttonPadding = '0.8rem 1.7rem';
      gap = '1.5rem';
      playerImgMaxWidth = '220px';
      maxWidth = '60vw';
    } else {
      headerFontSize = '2.2rem';
      textFontSize = '1.2rem';
      buttonFontSize = '1.4rem';
      buttonPadding = '1.2rem 2.2rem';
      gap = '2.5rem';
      playerImgMaxWidth = '320px';
      maxWidth = '40vw';
    }
    const isMobileStub = windowWidth < 700;
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#FCFAFA',
        display: isMobileStub ? 'flex' : 'grid',
        flexDirection: isMobileStub ? 'column' : undefined,
        alignItems: 'center',
        justifyContent: 'center',
        justifyItems: isMobileStub ? undefined : 'center',
        gridTemplateColumns: isMobileStub ? undefined : 'repeat(8, 1fr)',
        gridTemplateRows: isMobileStub ? undefined : 'repeat(8, 1fr)',
        fontFamily: '"Press Start 2P", "VT323", "Courier New", monospace',
      }}>
        {/* Изображение игрока */}
        <div style={{
          gridColumn: isMobileStub ? undefined : '3 / 5',
          gridRow: isMobileStub ? undefined : '4',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: isMobileStub ? gap : 0,
        }}>
          <img
            src={isAnimated ? "/me_start_down.png" : "/me_start.png"}
            alt="Главный герой"
            style={{
              width: '100%',
              maxWidth: playerImgMaxWidth,
              height: 'auto',
              transition: 'opacity 0.3s',
            }}
          />
        </div>
        {/* Текст и кнопка */}
        <div style={{
          gridColumn: isMobileStub ? undefined : '6 / 8',
          gridRow: isMobileStub ? undefined : '4',
          display: 'flex',
          flexDirection: 'column',
          gap: gap,
          alignItems: isMobileStub ? 'center' : 'flex-start',
          justifyContent: 'center',
          textAlign: isMobileStub ? 'center' : 'left',
          maxWidth: maxWidth,
        }}>
          <h1 style={{
            fontSize: headerFontSize,
            fontWeight: 900,
            margin: 0,
            lineHeight: 1.3,
            whiteSpace: isMobileStub ? 'normal' : 'nowrap',
            textAlign: isMobileStub ? 'center' : 'left',
            maxWidth: maxWidth,
          }}>
            Упс, только десктоп!
          </h1>
          <p style={{
            fontSize: textFontSize,
            lineHeight: 1.6,
            margin: 0,
            maxWidth: maxWidth,
            marginTop: isMobileStub ? gap : 0,
          }}>
            Откройте на большом экране или скачайте резюме просто так
          </p>
          <a href="/resume_fin.pdf" target="_blank" rel="noopener noreferrer" style={{
            color: '#1976d2',
            textDecoration: 'underline',
            fontWeight: 700,
            fontSize: buttonFontSize,
            padding: buttonPadding,
            border: '2px solid #1976d2',
            borderRadius: 8,
            background: '#fff',
            boxShadow: '0 2px 0 #1976d2',
            marginTop: isMobileStub ? gap : 8,
            width: 'fit-content',
            display: 'inline-block',
            whiteSpace: 'nowrap',
            maxWidth: maxWidth,
          }}>Скачать резюме</a>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {started ? <Game /> : <StartScreen onStart={() => setStarted(true)} />}
    </div>
  );
}

export default App;
