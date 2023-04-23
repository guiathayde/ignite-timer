import { ReactNode, createContext, useState, useReducer } from 'react';

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

interface CyclesContextData {
  cycles: Cycle[];
  activeCycle?: Cycle;
  amountSecondsPassed: number;
  markCycleAsFinished(activeCycle: Cycle): void;
  setSecondsPassed(seconds: number): void;
  createNewCycle({ task, minutesAmount }: CreateCycleData): void;
  interruptCurrentCycle(): void;
}

export const CyclesContext = createContext({} as CyclesContextData);

interface CyclesContextProviderProps {
  children: ReactNode;
}

interface CyclesState {
  cycles: Cycle[];
  activeCycle?: Cycle;
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    (state: CyclesState, action: any) => {
      if (action.type === 'ADD_NEW_CYCLE') {
        return {
          ...state,
          cycles: [...state.cycles, action.payload.newCycle],
          activeCycle: action.payload.newCycle,
        };
      }

      if (action.type === 'MARK_CURRENT_CYCLE_AS_FINISHED') {
        return {
          ...state,
          cycles: state.cycles.map((oldCycle) => {
            if (oldCycle.id === action.payload.activeCycle?.id) {
              return {
                ...oldCycle,
                finishedDate: new Date(),
              };
            }

            return oldCycle;
          }),
        };
      }

      if (action.type === 'INTERRUPT_CURRENT_CYCLE') {
        return {
          ...state,
          cycles: state.cycles.map((oldCycle) => {
            if (oldCycle.id === action.payload.activeCycle?.id) {
              return {
                ...oldCycle,
                interruptedDate: new Date(),
              };
            }

            return oldCycle;
          }),
          activeCycle: undefined,
        };
      }

      return state;
    },
    {
      cycles: [],
      activeCycle: undefined,
    }
  );

  const { cycles, activeCycle } = cyclesState;

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCycleAsFinished(activeCycle: Cycle) {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycle,
      },
    });
  }

  function createNewCycle({ task, minutesAmount }: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task,
      minutesAmount,
      startDate: new Date(),
    };

    dispatch({ type: 'ADD_NEW_CYCLE', payload: { newCycle } });
    setAmountSecondsPassed(0);
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycle,
      },
    });
  }

  return (
    <CyclesContext.Provider
      value={{
        cycles,
        activeCycle,
        amountSecondsPassed,
        markCycleAsFinished,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  );
}
