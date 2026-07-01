import { darkTheme, lightTheme, Theme } from '@/constants/theme';
import { useApp } from '@/store/AppContext';
import { useColorScheme } from 'react-native';

export function useTheme(): Theme {
  const system = useColorScheme();
  const { state } = useApp();
  const pref = state.settings.darkMode;
  const dark = pref === 'dark' || (pref === 'system' && system === 'dark');
  return dark ? darkTheme : lightTheme;
}
