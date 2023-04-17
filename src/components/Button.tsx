import { HTMLAttributes } from 'react';
import { ButtonContainer, ButtonVariant } from './Button.styles';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export function Button({ variant = 'primary' }: ButtonProps) {
  return <ButtonContainer variant={variant}>Click me!</ButtonContainer>;
}
