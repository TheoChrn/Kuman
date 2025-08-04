import * as Ariakit from "@ariakit/react";
import styles from "./styles.module.scss";

export interface SelectProps {
  children?: React.ReactNode;
  selectProviderProps?: Ariakit.SelectProviderProps;
  selectProps?: Ariakit.SelectProps;
  selectPopoverProps?: Ariakit.SelectPopoverProps;
  renderSelection?: React.ReactNode;
}

export function Select({
  children,
  selectProviderProps,
  selectProps = {},
  selectPopoverProps = {},
  renderSelection,
}: SelectProps) {
  const { className: selectClassName, ...restSelectProps } = selectProps;
  const { className: popoverClassName, ...restPopoverProps } =
    selectPopoverProps;

  return (
    <Ariakit.SelectProvider {...selectProviderProps}>
      <Ariakit.Select
        {...restSelectProps}
        className={`${styles["select"]} ${selectClassName}`}
      >
        {renderSelection ?? restSelectProps.value}
        <Ariakit.SelectArrow className={styles["select-arrow"]} />
      </Ariakit.Select>
      <Ariakit.SelectPopover
        {...restPopoverProps}
        sameWidth
        portal
        flip="bottom"
        className={`${styles["select-popover"]} ${popoverClassName}`}
      >
        {children}
      </Ariakit.SelectPopover>
    </Ariakit.SelectProvider>
  );
}

interface SelectItemProps extends Ariakit.SelectItemProps {}

export function SelectItem({ className, ...props }: SelectItemProps) {
  return (
    <Ariakit.SelectItem
      {...props}
      className={`${styles["select-item"]} ${className}`}
      accessibleWhenDisabled={true}
    />
  );
}
