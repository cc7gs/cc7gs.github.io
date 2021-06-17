import React, { useMemo } from "react";
import { useColorMode } from "theme-ui";
import Switch from './Switch';
import './Switch.css';

export const isBrowser = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

const Header = () => {
  const [colorMode, setColorMode] = useColorMode()
  const isDark = colorMode === `dark`
  const toggleColorMode = () => {
    setColorMode(isDark ? `light` : `dark`)
  }

  const defaultDarken = useMemo(() => {
    if (!isBrowser()) {
      return 'light';
    }
    return localStorage.getItem('dark_theme') || 'light';
  }, []);
  return (
    <header
      style={{
        position: 'fixed',
        right: 80,
        top: 8,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Switch
        checkedChildren="🌜"
        unCheckedChildren="🌞"
        defaultChecked={defaultDarken === 'dark'}
        checked={isDark}
        onChange={(check) => {
          toggleColorMode();
          if (!check) {
            localStorage.setItem('dark_theme', 'light');
            return;
          }
          localStorage.setItem('dark_theme', 'dark');
        }}
      />
    </header>
  )
}
export default Header;