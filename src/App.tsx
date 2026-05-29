import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Play, Square, RotateCcw, Clock, Zap } from 'lucide-react';

const RADIUS = 135;
const CIRC = 848;

export default function App() {
  const [duration, setDuration] = useState(900); // 15 minutes in seconds
  const [timeRemaining, setTimeRemaining] = useState(900);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (timeRemaining === 0) {
        setIsRunning(false);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeRemaining]);

  const toggleTimer = () => {
    if (timeRemaining <= 0) return;
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(duration);
  };

  const adjustMinutes = (amount: number) => {
    if (isRunning) return;
    const newDuration = Math.max(0, duration + amount * 60);
    setDuration(newDuration);
    setTimeRemaining(newDuration);
  };

  const adjustSeconds = (amount: number) => {
    if (isRunning) return;
    const newDuration = Math.max(0, duration + amount);
    setDuration(newDuration);
    setTimeRemaining(newDuration);
  };

  const setQuickTime = (seconds: number) => {
    if (isRunning) return;
    setDuration(seconds);
    setTimeRemaining(seconds);
  };

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const progressPct = timeRemaining / duration;
  const strokeDashoffset = CIRC * (1 - (isNaN(progressPct) ? 1 : progressPct));

  // Calculate coordinates for the star position indicator at the leading edge of the arc progress
  const progressAngle = (isNaN(progressPct) ? 1 : progressPct) * 2 * Math.PI;
  const starX = 150 + RADIUS * Math.cos(progressAngle);
  const starY = 150 + RADIUS * Math.sin(progressAngle);

  return (
    <div className="flex flex-col h-screen bg-[#EDF4FF] font-sans overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center h-[120px] px-10 shrink-0">
        <button className="flex items-center text-[52px] font-semibold text-[#333] cursor-pointer">
          <ChevronLeft className="w-[52px] h-[52px] mr-3" />
          타이머
        </button>
        <button className="px-8 py-3.5 border border-[#E0E7F1] rounded-[20px] bg-white text-[36px] font-semibold text-[#666] cursor-pointer hover:bg-gray-50 active:scale-95 transition-transform">
          닫기
        </button>
      </header>

      {/* Main Card */}
      <motion.div 
        id="main-card"
        className={`flex-1 mx-5 mb-4 bg-white rounded-[32px] shadow-[0_8px_24px_rgba(0,0,0,0.04)] flex flex-col items-center px-6 py-6 relative justify-between gap-4 min-h-0 overflow-hidden ${isRunning ? 'animate-card-breathing' : ''} ${timeRemaining === 0 ? 'ring-4 ring-blue-400 ring-offset-4' : ''}`}
      >
        {/* Time Display */}
        <div className={`text-[132px] font-extrabold tracking-[-3px] leading-none mt-2 shrink-0 select-none transition-colors duration-350 ${
          isRunning 
            ? 'bg-gradient-to-br from-[#1A75FF] to-[#0056FF] bg-clip-text text-transparent' 
            : 'text-[#555555]'
        }`}>
          {formatTime(timeRemaining)}
        </div>

        {/* Timer Circle Container */}
        <div className="relative w-[575px] h-[575px] flex justify-center items-center shrink-0">
          {/* Speech Bubble */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={isRunning ? 'focus' : 'idle'}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className={`absolute top-[100px] bg-white px-8 py-3.5 rounded-[24px] text-center text-[24px] leading-[1.3] z-[3] border whitespace-nowrap transition-all duration-300 after:content-[''] after:absolute after:bottom-[-6px] after:left-1/2 after:-translate-x-1/2 after:border-l-[6px] after:border-l-transparent after:border-r-[6px] after:border-r-transparent after:border-t-[6px] ${
                isRunning 
                  ? 'bg-[#EDF4FF] border-[rgba(0,108,255,0.3)] shadow-[0_8px_24px_rgba(0,108,255,0.16)] text-[#0056FF] after:border-t-[#EDF4FF] animate-bubble-breathing font-extrabold' 
                  : 'bg-white border-[#F1F5F9] shadow-[0_8px_24px_rgba(0,0,0,0.03)] text-[#94A3B8] after:border-t-white font-medium'
              }`}
            >
              {isRunning ? (
                <>집중하는 당신!!<br />정말 멋져요! ✨</>
              ) : (
                <>다같이<br />시작해볼까요?</>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Background Decoration Stars */}
          <motion.div
            className="absolute top-[-2%] right-[-2%] z-[1]"
            animate={{
              y: [0, -6, 0],
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <svg viewBox="0 0 24 24" className="w-[52px] h-[52px] drop-shadow-[0_4px_10px_rgba(59,130,246,0.06)]">
              <path 
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                fill="#D0E3FF" 
                stroke="#D0E3FF" 
                strokeWidth="2.5" 
                strokeLinejoin="round" 
                strokeLinecap="round" 
              />
            </svg>
          </motion.div>

          <motion.div
            className="absolute bottom-[10%] left-[-4%] z-[1]"
            animate={{
              y: [0, 8, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          >
            <svg viewBox="0 0 24 24" className="w-[44px] h-[44px] drop-shadow-[0_4px_10px_rgba(234,179,8,0.06)]">
              <path 
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                fill="#FEF08A" 
                stroke="#FEF08A" 
                strokeWidth="2.5" 
                strokeLinejoin="round" 
                strokeLinecap="round" 
              />
            </svg>
          </motion.div>

          <motion.div
            className="absolute top-[18%] left-[-5%] z-[1]"
            animate={{
              y: [0, -6, 0],
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          >
            <svg viewBox="0 0 24 24" className="w-[32px] h-[32px] drop-shadow-[0_4px_8px_rgba(244,63,94,0.05)]">
              <path 
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" 
                fill="#FCE7F3" 
                stroke="#FCE7F3" 
                strokeWidth="2.5" 
                strokeLinejoin="round" 
                strokeLinecap="round" 
              />
            </svg>
          </motion.div>
 
          <svg className="w-full h-full -rotate-90" viewBox="0 0 300 300">
            <defs>
              <linearGradient id="timer-grad-active" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0056FF" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id="timer-grad-idle" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E2E8F0" />
                <stop offset="100%" stopColor="#F1F5F9" />
              </linearGradient>
              <filter id="star-shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.2" />
              </filter>
            </defs>
            <circle className="fill-none stroke-[#F0F4F9] stroke-[14]" cx="150" cy="150" r={RADIUS} />
            <motion.circle 
              className="fill-none transition-[stroke-dashoffset] duration-300 ease-linear"
              stroke={isRunning ? "url(#timer-grad-active)" : "url(#timer-grad-idle)"}
              strokeWidth="14"
              cx="150" cy="150" r={RADIUS}
              strokeLinecap="round"
              strokeDasharray={CIRC}
              animate={{ strokeDashoffset }}
            />
            
            {/* Star position indicator */}
            <g 
              transform={`translate(${starX}, ${starY}) rotate(90) scale(1.3)`} 
              className="transition-transform duration-300 ease-linear"
              filter="url(#star-shadow)"
            >
              {/* Star white background outline */}
              <path 
                d="M 0,-7 L 1.8,-1.8 L 7,-1.8 L 3,1 L 4.5,6 L 0,3 L -4.5,6 L -3,1 L -7,-1.8 L -1.8,-1.8 Z"
                fill="white"
                stroke="white"
                strokeWidth="5.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Star inner colored shape */}
              <path 
                d="M 0,-7 L 1.8,-1.8 L 7,-1.8 L 3,1 L 4.5,6 L 0,3 L -4.5,6 L -3,1 L -7,-1.8 L -1.8,-1.8 Z"
                fill={isRunning ? "#0056FF" : "#CBD5E1"}
                stroke={isRunning ? "#0056FF" : "#CBD5E1"}
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </g>
          </svg>

          {/* Character */}
          <div className="absolute left-1/2 top-[64%] -translate-x-1/2 -translate-y-1/2 z-[2] w-[420px] h-[420px]">
             <motion.img
               src="/image222.png"
               alt="Focus Bear"
               className="w-full h-full object-contain"
               animate={isRunning ? {
                 y: [0, -6, 0],
                 scale: [1, 1.02, 1]
               } : {}}
               transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             />
          </div>
        </div>

        {/* Settings Panel */}
        <div className="w-full flex flex-col gap-6 shrink min-h-0 overflow-y-auto">
          {/* Preset Custom Settings */}
          <div className="bg-[#F9FBFE] border border-[#EEF2F7] rounded-[32px] py-8 px-8 shrink-0">
            <div className="flex items-center text-[35px] font-extrabold mb-5 text-[#666]">
              <Clock className="w-8 h-8 mr-2.5 text-[#0056FF]" />
              시간 설정
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center bg-white rounded-[24px] p-3 border border-[#EBEFF5] h-[110px]">
                <button onClick={() => adjustMinutes(-1)} className="flex-none w-[72px] h-[72px] flex items-center justify-center text-[48px] text-[#0056FF] font-bold cursor-pointer hover:bg-blue-50 active:scale-90 rounded-xl transition-transform">−</button>
                <span className="flex-1 text-center font-bold text-[42px]">{Math.floor(duration / 60)}</span>
                <span className="text-[26px] text-[#666] mr-2 font-bold">분</span>
                <button onClick={() => adjustMinutes(1)} className="flex-none w-[72px] h-[72px] flex items-center justify-center text-[48px] text-[#0056FF] font-bold cursor-pointer hover:bg-blue-50 active:scale-90 rounded-xl transition-transform">+</button>
              </div>
              <div className="flex items-center bg-white rounded-[24px] p-3 border border-[#EBEFF5] h-[110px]">
                <button onClick={() => adjustSeconds(-1)} className="flex-none w-[72px] h-[72px] flex items-center justify-center text-[48px] text-[#0056FF] font-bold cursor-pointer hover:bg-blue-50 active:scale-90 rounded-xl transition-transform">−</button>
                <span className="flex-1 text-center font-bold text-[42px]">{String(duration % 60).padStart(2, '0')}</span>
                <span className="text-[26px] text-[#666] mr-2 font-bold">초</span>
                <button onClick={() => adjustSeconds(1)} className="flex-none w-[72px] h-[72px] flex items-center justify-center text-[48px] text-[#0056FF] font-bold cursor-pointer hover:bg-blue-50 active:scale-90 rounded-xl transition-transform">+</button>
              </div>
            </div>
          </div>

          {/* Quick Choice Preset */}
          <div className="bg-[#F9FBFE] border border-[#EEF2F7] rounded-[32px] py-8 px-8 shrink-0">
            <div className="flex items-center text-[35px] font-extrabold mb-5 text-[#666]">
              <Zap className="w-8 h-8 mr-2.5 text-[#0056FF]" />
              빠른 시간 선택
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[60, 180, 300, 600, 900, 1200, 1500, 1800].map((s) => (
                <button
                   key={s}
                   onClick={() => setQuickTime(s)}
                   className={`py-6 text-[33px] rounded-[16px] border transition-all cursor-pointer hover:bg-blue-50/50 ${duration === s ? 'bg-gradient-to-br from-[#1A75FF] to-[#0056FF] text-white border-transparent font-extrabold shadow-sm' : 'bg-white border-[#E9F0F8] text-[#666]'}`}
                >
                  {s / 60}분
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom Action */}
      <div className="grid grid-cols-[1fr_1.5fr] gap-[20px] mx-5 mb-5 shrink-0">
        <button 
          onClick={resetTimer}
          className="flex flex-row items-center justify-center bg-white rounded-[32px] px-8 text-[#666] shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-[#F0F4F8] transition-all active:scale-[0.96] h-[240px] cursor-pointer hover:bg-gray-50"
        >
          <RotateCcw className="w-[52px] h-[52px] mr-5 text-[#666]" />
          <span className="text-[52px] font-medium">초기화</span>
        </button>
        <button 
          onClick={toggleTimer}
          className={`flex flex-row items-center justify-center rounded-[32px] px-8 text-white transition-all active:scale-[0.96] h-[240px] cursor-pointer shadow-[0_8px_20px_rgba(0,108,255,0.15)] ${isRunning ? 'bg-gradient-to-br from-[#FF6B6B] to-[#EE5253] shadow-[0_8px_20px_rgba(238,82,83,0.15)]' : 'bg-gradient-to-br from-[#1A75FF] to-[#0056FF]'}`}
        >
          {isRunning ? <Square className="w-[52px] h-[52px] mr-5 fill-white" /> : <Play className="w-[52px] h-[52px] mr-5 fill-white" />}
          <span className="text-[52px] font-medium">{isRunning ? '중지' : '시작'}</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes card-breathing {
          0%, 100% { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04), 0 0 0 0px rgba(0, 108, 255, 0.15); }
          50% { box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04), 0 0 25px 10px rgba(0, 108, 255, 0.2); }
        }
        @keyframes bubble-breathing {
          0%, 100% { box-shadow: 0 4px 12px rgba(0, 108, 255, 0.1), 0 0 0 0px rgba(0, 108, 255, 0.25); }
          50% { box-shadow: 0 4px 12px rgba(0, 108, 255, 0.1), 0 0 20px 10px rgba(0, 108, 255, 0.3); }
        }
        .animate-card-breathing { animation: card-breathing 2.5s infinite ease-in-out; }
        .animate-bubble-breathing { animation: bubble-breathing 2.5s infinite ease-in-out; }
      `}} />
    </div>
  );
}

