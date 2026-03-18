import { useColorScheme as _useColorScheme } from 'react-native';
import { useState, useEffect } from 'react';

export function useColorScheme() {
  const systemScheme = _useColorScheme();
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(systemScheme || 'dark');

  useEffect(() => {
    if (systemScheme) {
      setColorScheme(systemScheme);
    }
  }, [systemScheme]);

  return { colorScheme, setColorScheme };
}
