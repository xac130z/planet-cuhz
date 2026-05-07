import { useState, useCallback } from 'react';
import { sanitizeTextInput, sanitizeArrayInput, checkRateLimit } from '@/utils/inputValidation';

interface SecureInputOptions {
  maxLength?: number;
  rateLimit?: {
    key: string;
    maxAttempts: number;
    windowMs: number;
  };
}

export function useSecureInput(initialValue: string = '', options: SecureInputOptions = {}) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  const updateValue = useCallback((newValue: string) => {
    // Rate limiting check if enabled
    if (options.rateLimit) {
      const { key, maxAttempts, windowMs } = options.rateLimit;
      if (!checkRateLimit(key, maxAttempts, windowMs)) {
        setError('Too many attempts. Please try again later.');
        return false;
      }
    }

    // Sanitize input
    const sanitized = sanitizeTextInput(newValue, options.maxLength);
    setValue(sanitized);
    setError(null);
    return true;
  }, [options.maxLength, options.rateLimit]);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  return {
    value,
    error,
    updateValue,
    reset,
    isValid: !error && value.trim().length > 0
  };
}

export function useSecureArrayInput(initialValue: string[] = [], maxItems: number = 20, maxItemLength: number = 50) {
  const [value, setValue] = useState<string[]>(initialValue);
  const [error, setError] = useState<string | null>(null);

  const updateValue = useCallback((newValue: string[]) => {
    const sanitized = sanitizeArrayInput(newValue, maxItems, maxItemLength);
    setValue(sanitized);
    setError(null);
  }, [maxItems, maxItemLength]);

  const addItem = useCallback((item: string) => {
    if (value.length >= maxItems) {
      setError(`Maximum ${maxItems} items allowed`);
      return false;
    }
    
    const sanitized = sanitizeTextInput(item, maxItemLength);
    if (sanitized && !value.includes(sanitized)) {
      setValue(prev => [...prev, sanitized]);
      setError(null);
      return true;
    }
    return false;
  }, [value, maxItems, maxItemLength]);

  const removeItem = useCallback((index: number) => {
    setValue(prev => prev.filter((_, i) => i !== index));
    setError(null);
  }, []);

  return {
    value,
    error,
    updateValue,
    addItem,
    removeItem,
    isValid: !error && value.length > 0
  };
}