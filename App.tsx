
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GameState, GameTurn } from './types';
import Dice3D from './components/Dice3D';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    diceCount: 1,
    lastRoll: [1],
    isRolling: false,
    history: [],
  });

  const rollTimerRef = useRef<number | null>(null);

  const stopDice = useCallback(() => {
    // 使用 setState 的函数式更新来确保获取最新的 isRolling 状态
    setState(prev => {
      if (!prev.isRolling) return prev;

      // 清除自动停止计时器
      if (rollTimerRef.current) {
        window.clearTimeout(rollTimerRef.current);
        rollTimerRef.current = null;
      }

      const newRolls = Array.from({ length: prev.diceCount }, () => Math.floor(Math.random() * 6) + 1);
      const total = newRolls.reduce((a, b) => a + b, 0);

      const newTurn: GameTurn = {
        timestamp: Date.now(),
        roll: newRolls,
        total,
        diceCount: prev.diceCount,
      };

      return {
        ...prev,
        lastRoll: newRolls,
        isRolling: false,
        history: [newTurn, ...prev.history].slice(0, 10),
      };
    });
  }, []);

  const startRolling = useCallback(() => {
    if (state.isRolling) return;

    setState(prev => ({ ...prev, isRolling: true }));

    // 设置 3 秒后自动停止
    rollTimerRef.current = window.setTimeout(() => {
      stopDice();
    }, 3000);
  }, [state.isRolling, stopDice]);

  const setDiceCount = (count: number) => {
    if (state.isRolling) return;
    setState(prev => ({ 
      ...prev, 
      diceCount: count,
      lastRoll: Array(count).fill(1)
    }));
  };

  const resetHistory = () => {
    setState(prev => ({
      ...prev,
      lastRoll: Array(prev.diceCount).fill(1),
      isRolling: false,
      history: [],
    }));
  };

  // 组件卸载时清除计时器
  useEffect(() => {
    return () => {
      if (rollTimerRef.current) window.clearTimeout(rollTimerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 bg-slate-900 text-slate-100 font-sans">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8 md:mb-12">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
          极简骰子
        </h1>
        <button 
          onClick={resetHistory}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-sm transition-colors text-slate-300"
        >
          清空记录
        </button>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        
        {/* 左侧：游戏操作区 */}
        <section className="bg-slate-800/40 p-6 md:p-10 rounded-3xl border border-slate-700/50 backdrop-blur-md flex flex-col space-y-8 md:space-y-12">
          
          {/* 骰子数量选择器 */}
          <div className="flex flex-col items-center">
            <span className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-4">骰子个数</span>
            <div className="flex p-1 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setDiceCount(num)}
                  disabled={state.isRolling}
                  className={`
                    px-6 md:px-10 py-2.5 rounded-xl text-sm font-bold transition-all
                    ${state.diceCount === num 
                      ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                    }
                    ${state.isRolling ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* 3D 骰子显示区 - 修复 3 个骰子时的 UI 覆盖 bug */}
          <div className="flex justify-center items-center min-h-[160px] flex-wrap gap-4 md:gap-8 overflow-visible py-4">
            {state.lastRoll.map((val, idx) => (
              <div key={idx} className="flex-shrink-0">
                <Dice3D value={val} isRolling={state.isRolling} />
              </div>
            ))}
          </div>

          {/* 操作按钮组 */}
          <div className="w-full">
            {!state.isRolling ? (
              <button
                onClick={startRolling}
                className="w-full py-5 md:py-6 rounded-2xl font-black text-xl transition-all active:scale-[0.98] bg-gradient-to-br from-indigo-500 to-blue-600 hover:from-indigo-400 hover:to-blue-500 text-white shadow-[0_8px_30px_rgb(37,99,235,0.3)] tracking-widest"
              >
                开始转动
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={stopDice}
                  className="w-full py-5 md:py-6 rounded-2xl font-black text-xl transition-all active:scale-[0.98] bg-gradient-to-br from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white shadow-[0_8px_30px_rgb(225,29,72,0.3)] animate-pulse tracking-widest"
                >
                  立即停止！
                </button>
                <p className="text-center text-[10px] text-slate-500 font-bold uppercase tracking-widest animate-pulse">
                  3秒后将自动停止
                </p>
              </div>
            )}
          </div>
        </section>

        {/* 右侧：历史记录 */}
        <section className="flex flex-col space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-slate-200">历史记录</h2>
            <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em] bg-slate-800/50 px-2 py-1 rounded">Activity</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px] lg:max-h-[600px] space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
            {state.history.length === 0 ? (
              <div className="h-full min-h-[250px] flex flex-col items-center justify-center text-slate-600 space-y-4 border-2 border-dashed border-slate-800 rounded-3xl">
                <div className="w-16 h-16 bg-slate-800/30 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <p className="text-sm font-medium">还没有投掷记录</p>
              </div>
            ) : (
              state.history.map((turn) => (
                <div key={turn.timestamp} className="group bg-slate-800/20 hover:bg-slate-800/50 border border-slate-700/30 p-5 rounded-2xl transition-all duration-300">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-white font-black text-3xl leading-none">{turn.total}</span>
                        <span className="text-[10px] text-slate-500 font-bold uppercase mt-1">Total</span>
                      </div>
                      <div className="flex gap-2">
                        {turn.roll.map((r, i) => (
                          <div key={i} className="flex items-center justify-center w-8 h-8 bg-slate-700/50 border border-slate-600/30 text-white text-xs font-black rounded-lg shadow-sm">
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-600 font-mono self-start mt-1">
                      {new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="mt-auto py-12 text-slate-600 text-xs text-center border-t border-slate-800/50 w-full max-w-4xl">
        纯净版骰子模拟器 · 3秒自动结算
      </footer>
    </div>
  );
};

export default App;
