/**
 * Reusable Form Field Component for react-hook-form
 */

import { FieldError } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BaseFormFieldProps {
  label: string;
  error?: FieldError;
  required?: boolean;
}

interface InputFormFieldProps extends BaseFormFieldProps {
  type: 'text' | 'email' | 'password';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}

interface SelectFormFieldProps extends BaseFormFieldProps {
  type: 'select';
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

type FormFieldProps = InputFormFieldProps | SelectFormFieldProps;

export function FormField(props: FormFieldProps) {
  const { label, error, required, type } = props;

  return (
    <div className="space-y-2">
      <Label htmlFor={label.toLowerCase().replace(/\s+/g, '-')}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {type === 'select' ? (
        <Select value={props.value} onValueChange={props.onChange}>
          <SelectTrigger
            className={error ? 'border-destructive' : ''}
            id={label.toLowerCase().replace(/\s+/g, '-')}
          >
            <SelectValue placeholder={props.placeholder || 'Select...'} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={label.toLowerCase().replace(/\s+/g, '-')}
          type={props.type}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          autoComplete={props.autoComplete}
          className={error ? 'border-destructive' : ''}
        />
      )}

      {error && (
        <p className="text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
}
