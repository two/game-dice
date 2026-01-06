
import React from 'react';

interface Dice3DProps {
  value: number;
  isRolling: boolean;
}

const Pips: React.FC<{ count: number }> = ({ count }) => {
  const renderDots = () => {
    switch(count) {
      case 1: return <div className="dot" />;
      case 2: return <><div className="dot" /><div className="dot" /></>;
      case 3: return <><div className="dot" /><div className="dot" /><div className="dot" /></>;
      case 4: return (
        <div className="flex justify-between w-full h-full p-2">
          <div className="flex flex-col justify-between"><div className="dot" /><div className="dot" /></div>
          <div className="flex flex-col justify-between"><div className="dot" /><div className="dot" /></div>
        </div>
      );
      case 5: return (
        <div className="relative w-full h-full p-2">
           <div className="absolute top-2 left-2 dot" />
           <div className="absolute top-2 right-2 dot" />
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 dot" />
           <div className="absolute bottom-2 left-2 dot" />
           <div className="absolute bottom-2 right-2 dot" />
        </div>
      );
      case 6: return (
        <div className="flex justify-between w-full h-full p-2">
          <div className="flex flex-col justify-between"><div className="dot" /><div className="dot" /><div className="dot" /></div>
          <div className="flex flex-col justify-between"><div className="dot" /><div className="dot" /><div className="dot" /></div>
        </div>
      );
      default: return null;
    }
  };

  return <div className="flex w-full h-full items-center justify-center">{renderDots()}</div>;
};

const Dice3D: React.FC<Dice3DProps> = ({ value, isRolling }) => {
  const getRotation = (v: number) => {
    switch (v) {
      case 1: return 'rotateX(0deg) rotateY(0deg)';
      case 2: return 'rotateX(0deg) rotateY(180deg)';
      case 3: return 'rotateX(0deg) rotateY(-90deg)';
      case 4: return 'rotateX(0deg) rotateY(90deg)';
      case 5: return 'rotateX(-90deg) rotateY(0deg)';
      case 6: return 'rotateX(90deg) rotateY(0deg)';
      default: return 'rotateX(0deg) rotateY(0deg)';
    }
  };

  return (
    <div className="dice-container inline-block">
      <div 
        className={`dice ${isRolling ? 'animate-roll' : ''}`}
        style={{ transform: isRolling ? undefined : getRotation(value) }}
      >
        <div className="dice-face face-1"><Pips count={1} /></div>
        <div className="dice-face face-2"><Pips count={2} /></div>
        <div className="dice-face face-3"><Pips count={3} /></div>
        <div className="dice-face face-4"><Pips count={4} /></div>
        <div className="dice-face face-5"><Pips count={5} /></div>
        <div className="dice-face face-6"><Pips count={6} /></div>
      </div>
    </div>
  );
};

export default Dice3D;
