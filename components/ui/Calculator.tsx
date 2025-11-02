

import React, { useReducer, useState, useRef, useEffect, useCallback } from 'react';
import { X, Calculator as CalculatorIcon } from 'lucide-react';

// Action types for the reducer
const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};

// Reducer function to manage calculator state
function reducer(state: any, { type, payload }: { type: string; payload: any }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === '0' && state.currentOperand === '0') return state;
      if (payload.digit === '.' && state.currentOperand?.includes('.')) return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`,
      };

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };

    case ACTIONS.CLEAR:
      return {};

    case ACTIONS.DELETE_DIGIT:
        if (state.overwrite) {
            return {
                ...state,
                overwrite: false,
                currentOperand: null
            }
        }
        if (state.currentOperand == null) return state;
        if (state.currentOperand.length === 1) {
            return { ...state, currentOperand: null }
        }
        return {
            ...state,
            currentOperand: state.currentOperand.slice(0, -1)
        }

    case ACTIONS.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };
    default:
      return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }: { currentOperand: string; previousOperand: string; operation: string }) {
  const prev = parseFloat(previousOperand);
  const current = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(current)) return '';
  let computation: number = 0;
  switch (operation) {
    case '+':
      computation = prev + current;
      break;
    case '-':
      computation = prev - current;
      break;
    case '*':
      computation = prev * current;
      break;
    case '÷':
      computation = prev / current;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
    maximumFractionDigits: 0,
})

function formatOperand(operand: string | null) {
    if (operand == null) return;
    const [integer, decimal] = operand.split('.');
    if (decimal == null) return INTEGER_FORMATTER.format(parseInt(integer));
    return `${INTEGER_FORMATTER.format(parseInt(integer))}.${decimal}`
}


const Calculator: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(reducer, {});

    const dragRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const offsetRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (dragRef.current) {
            const rect = dragRef.current.getBoundingClientRect();
            setPosition({
                x: window.innerWidth / 2 - rect.width / 2,
                y: 80, // Position below the header
            });
        }
    }, []);

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (dragRef.current) {
            setIsDragging(true);
            offsetRef.current = {
                x: e.clientX - position.x,
                y: e.clientY - position.y,
            };
        }
    };
    
    const onMouseMove = useCallback((e: MouseEvent) => {
        if (isDragging) {
            setPosition({
                x: e.clientX - offsetRef.current.x,
                y: e.clientY - offsetRef.current.y,
            });
        }
    }, [isDragging]);

    const onMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        } else {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [isDragging, onMouseMove, onMouseUp]);


    return (
        <div 
            ref={dragRef}
            className="fixed z-50 bg-surface rounded-xl shadow-2xl border border-border text-white w-80"
            style={{ left: `${position.x}px`, top: `${position.y}px`}}
        >
            <div 
                className="flex justify-between items-center p-2 bg-background rounded-t-xl cursor-move"
                onMouseDown={onMouseDown}
            >
                <div className="flex items-center gap-2">
                    <CalculatorIcon size={16} className="text-primary"/>
                    <span className="font-semibold text-sm">Calculator</span>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-border"><X size={16} /></button>
            </div>
            
            <div className="p-4">
                <div className="bg-background rounded-lg p-4 text-right mb-4 break-words min-h-[96px] flex flex-col justify-end">
                    <div className="text-text-secondary text-lg">{formatOperand(previousOperand)} {operation}</div>
                    <div className="text-text-primary text-4xl font-bold">{formatOperand(currentOperand)}</div>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => dispatch({ type: ACTIONS.CLEAR, payload: null })} className="col-span-2 bg-border text-primary hover:bg-border/70 p-4 rounded-lg text-xl font-semibold">AC</button>
                    <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT, payload: null })} className="bg-border text-primary hover:bg-border/70 p-4 rounded-lg text-xl font-semibold">DEL</button>
                    <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '÷' }})} className="bg-primary text-white hover:bg-primary-dark p-4 rounded-lg text-xl font-semibold">÷</button>

                    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '7' }})} className="bg-background hover:bg-border p-4 rounded-lg text-xl font-semibold">7</button>
                    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '8' }})} className="bg-background hover:bg-border p-4 rounded-lg text-xl font-semibold">8</button>
                    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '9' }})} className="bg-background hover:bg-border p-4 rounded-lg text-xl font-semibold">9</button>
                    <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '*' }})} className="bg-primary text-white hover:bg-primary-dark p-4 rounded-lg text-xl font-semibold">*</button>
                    
                    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '4' }})} className="bg-background hover:bg-border p-4 rounded-lg text-xl font-semibold">4</button>
                    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '5' }})} className="bg-background hover:bg-border p-4 rounded-lg text-xl font-semibold">5</button>
                    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '6' }})} className="bg-background hover:bg-border p-4 rounded-lg text-xl font-semibold">6</button>
                    <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '-' }})} className="bg-primary text-white hover:bg-primary-dark p-4 rounded-lg text-xl font-semibold">-</button>

                    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '1' }})} className="bg-background hover:bg-border p-4 rounded-lg text-xl font-semibold">1</button>
                    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '2' }})} className="bg-background hover:bg-border p-4 rounded-lg text-xl font-semibold">2</button>
                    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '3' }})} className="bg-background hover:bg-border p-4 rounded-lg text-xl font-semibold">3</button>
                    <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation: '+' }})} className="bg-primary text-white hover:bg-primary-dark p-4 rounded-lg text-xl font-semibold">+</button>

                    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '0' }})} className="col-span-2 bg-background hover:bg-border p-4 rounded-lg text-xl font-semibold">0</button>
                    <button onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit: '.' }})} className="bg-background hover:bg-border p-4 rounded-lg text-xl font-semibold">.</button>
                    <button onClick={() => dispatch({ type: ACTIONS.EVALUATE, payload: null })} className="bg-primary text-white hover:bg-primary-dark p-4 rounded-lg text-xl font-semibold">=</button>
                </div>
            </div>
        </div>
    );
};

export default Calculator;