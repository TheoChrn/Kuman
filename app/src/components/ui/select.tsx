import * as Ariakit from "@ariakit/react";

interface SelectProps {
  children: React.ReactNode;
  selectProviderProps?: Ariakit.SelectProviderProps;
  selectProps?: Ariakit.SelectProps;
  selectPopoverProps?: Ariakit.SelectPopoverProps;
}

export function Select({
  children,
  selectProviderProps,
  selectProps = {},
  selectPopoverProps = {},
}: SelectProps) {
  const { className: selectClassName, ...restSelectProps } = selectProps;
  const { className: popoverClassName, ...restPopoverProps } =
    selectPopoverProps;

  return (
    <Ariakit.SelectProvider {...selectProviderProps}>
      <Ariakit.Select {...restSelectProps} className={selectClassName} />
      <Ariakit.SelectPopover {...restPopoverProps} className={popoverClassName}>
        {children}
      </Ariakit.SelectPopover>
    </Ariakit.SelectProvider>
  );
}

interface SelectItemProps extends Ariakit.SelectItemProps {}

export function SelectItem(props: SelectItemProps) {
  return <Ariakit.SelectItem {...props} accessibleWhenDisabled={true} />;
}
