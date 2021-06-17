/*
 * Forked from https://github.com/react-component/switch
 * remove onKeyDown
*/

import * as React from 'react';
import classNames from 'classnames';
import useMergedState from '../hooks/useMergeState';
import './Switch.css';

export type SwitchChangeEventHandler = (
  checked: boolean,
  event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
) => void;
export type SwitchClickEventHandler = SwitchChangeEventHandler;

interface SwitchProps
  extends Omit<React.HTMLAttributes<HTMLButtonElement>, 'onChange' | 'onClick'> {
  className?: string;
  prefixCls?: string;
  disabled?: boolean;
  checkedChildren?: React.ReactNode;
  unCheckedChildren?: React.ReactNode;
  onChange?: SwitchChangeEventHandler;
  onKeyDown?: React.KeyboardEventHandler<HTMLButtonElement>;
  onClick?: SwitchClickEventHandler;
  tabIndex?: number;
  checked?: boolean;
  defaultChecked?: boolean;
  loadingIcon?: React.ReactNode;
  style?: React.CSSProperties;
  title?: string;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      prefixCls = 'rc-switch',
      className,
      checked,
      defaultChecked,
      disabled,
      loadingIcon,
      checkedChildren,
      unCheckedChildren,
      onClick,
      onChange,
      onKeyDown,
      ...restProps
    },
    ref,
  ) => {
    const [innerChecked, setInnerChecked] = useMergedState<boolean>(false, {
      value: checked,
      defaultValue: defaultChecked,
    });

    function triggerChange(
      newChecked: boolean,
      event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLButtonElement>,
    ) {
      let mergedChecked = innerChecked;

      if (!disabled) {
        mergedChecked = newChecked;
        setInnerChecked(mergedChecked);
        onChange?.(mergedChecked, event);
      }

      return mergedChecked;
    }



    function onInternalClick(e: React.MouseEvent<HTMLButtonElement>) {
      const ret = triggerChange(!innerChecked, e);
      // [Legacy] trigger onClick with value
      onClick?.(ret, e);
    }

    const switchClassName = classNames(prefixCls, className, {
      [`${prefixCls}-checked`]: innerChecked,
      [`${prefixCls}-disabled`]: disabled,
    });

    return (
      <button
        {...restProps}
        type="button"
        role="switch"
        aria-checked={innerChecked}
        disabled={disabled}
        className={switchClassName}
        ref={ref}
        onClick={onInternalClick}
      >
        {loadingIcon}
        <span className={`${prefixCls}-inner`}>
          {innerChecked ? checkedChildren : unCheckedChildren}
        </span>
      </button>
    );
  },
);

Switch.displayName = 'Switch';

export default Switch;
