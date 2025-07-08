'use client';

import { useState, useEffect, useRef } from 'react';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  initialMin?: number;
  initialMax?: number;
  onChangeAction: (min: number, max: number) => void;
}

export default function PriceRangeSlider({
  min,
  max,
  initialMin = min,
  initialMax = max,
  onChangeAction
}: PriceRangeSliderProps) {
  const [minVal, setMinVal] = useState(initialMin);
  const [maxVal, setMaxVal] = useState(initialMax);
  
  const minValRef = useRef<HTMLInputElement>(null);
  const maxValRef = useRef<HTMLInputElement>(null);
  const range = useRef<HTMLDivElement>(null);
  
  // Convert to percentage
  const getPercent = (value: number) => {
    return Math.round(((value - min) / (max - min)) * 100);
  };
  
  // Set width of the range to decrease/increase from the left/right side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value);

      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease/increase from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);
  
  // Debounce the onChange event
  useEffect(() => {
    const timer = setTimeout(() => {
      onChangeAction(minVal, maxVal);
    }, 500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [minVal, maxVal, onChangeAction]);

  return (
    <div className="relative h-8">
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        ref={minValRef}
        onChange={(event) => {
          const value = Math.min(+event.target.value, maxVal - 1);
          setMinVal(value);
        }}
        className="thumb thumb--zindex-3 absolute h-0 w-full bg-transparent pointer-events-none appearance-none z-30"
        style={{ 
          zIndex: minVal > max - 100 ? 5 : undefined,
          // Add custom thumb styling
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        ref={maxValRef}
        onChange={(event) => {
          const value = Math.max(+event.target.value, minVal + 1);
          setMaxVal(value);
        }}
        className="thumb thumb--zindex-4 absolute h-0 w-full bg-transparent pointer-events-none appearance-none z-40"
      />

      <div className="relative w-full h-1 rounded bg-gray-200">
        <div ref={range} className="absolute h-1 bg-amber-500 rounded" />
      </div>
      
      <style jsx>{`
        .thumb {
          height: 0;
          width: 100%;
          outline: none;
        }
        
        .thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #ed8936;
          cursor: pointer;
          border: none;
          pointer-events: all;
          z-index: 50;
        }
        
        .thumb::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #ed8936;
          cursor: pointer;
          border: none;
          pointer-events: all;
          z-index: 50;
        }
      `}</style>
    </div>
  );
}
