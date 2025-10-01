import * as Ariakit from "@ariakit/react";

export interface SelectProps {
  children?: React.ReactNode;
  selectProviderProps?: Ariakit.SelectProviderProps;
  selectProps?: Ariakit.SelectProps & { fallback?: string };
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
        className={`select ${selectClassName}`}
      >
        {renderSelection ??
          (selectProps?.value || (
            <Ariakit.SelectValue fallback={restSelectProps.fallback} />
          ))}
        <Ariakit.SelectArrow className="select-arrow" />
      </Ariakit.Select>
      <Ariakit.SelectPopover
        {...restPopoverProps}
        sameWidth
        portal
        gutter={8}
        className={`select-popover ${popoverClassName}`}
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
      className={`select-item ${className}`}
      accessibleWhenDisabled={true}
    />
  );
}
