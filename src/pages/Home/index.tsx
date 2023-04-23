import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { differenceInSeconds } from 'date-fns';
import { HandPalm, Play } from 'phosphor-react';

import {
  HomeContainer,
  FormContainer,
  CountdownContainer,
  TaskInput,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
} from './styles';

const newCycleValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60),
});

type NewCycleFormData = zod.infer<typeof newCycleValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export function Home() {
  const { register, watch, handleSubmit, reset } = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 5,
    },
  });

  const [, setCycles] = useState<Cycle[]>([]);
  const [activeCycle, setActiveCycle] = useState<Cycle>();
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;

  useEffect(() => {
    if (activeCycle) {
      const interval = setInterval(() => {
        const secondsDifference = differenceInSeconds(
          new Date(),
          activeCycle.startDate
        );

        if (secondsDifference >= totalSeconds) {
          setCycles((oldCycles) =>
            oldCycles.map((oldCycle) => {
              if (oldCycle.id === activeCycle?.id) {
                return {
                  ...oldCycle,
                  finishedDate: new Date(),
                };
              }

              return oldCycle;
            })
          );

          setAmountSecondsPassed(0);
          setActiveCycle(undefined);

          clearInterval(interval);
        } else {
          setAmountSecondsPassed(secondsDifference);
        }
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [activeCycle, totalSeconds]);

  function handleCreateNewCycle({ task, minutesAmount }: NewCycleFormData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task,
      minutesAmount,
      startDate: new Date(),
    };

    setCycles((oldCycles) => [...oldCycles, newCycle]);
    setActiveCycle(newCycle);
    setAmountSecondsPassed(0);

    reset();
  }

  function handleInterruptCycle() {
    setCycles((oldCycles) =>
      oldCycles.map((oldCycle) => {
        if (oldCycle.id === activeCycle?.id) {
          return {
            ...oldCycle,
            interruptedDate: new Date(),
          };
        }

        return oldCycle;
      })
    );

    setActiveCycle(undefined);
  }

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, '0');
  const seconds = String(secondsAmount).padStart(2, '0');

  useEffect(() => {
    if (activeCycle) document.title = `${minutes}:${seconds} - Timer`;
  }, [activeCycle, minutes, seconds]);

  const task = watch('task');
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)}>
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            type="text"
            list="task-suggestion"
            placeholder="Dê um nome para o seu projeto"
            disabled={!!activeCycle}
            {...register('task')}
          />
          <datalist id="task-suggestion">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Banana" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            id="minutesAmount"
            type="number"
            placeholder="00"
            step={5}
            min={5}
            max={60}
            disabled={!!activeCycle}
            {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <HandPalm size={24} /> Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} /> Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
