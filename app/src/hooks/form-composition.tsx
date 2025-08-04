import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { FileInput } from "~/components/ui/inputs/file/file";
import { MultiFileInput } from "~/components/ui/inputs/multi-file/multi-file";
import { MultiSelectInput } from "~/components/ui/inputs/multi-select";
import { SelectInput } from "~/components/ui/inputs/select";
import { TextInput } from "~/components/ui/inputs/text";
import { TextareaInput } from "~/components/ui/inputs/textarea";

export const { fieldContext, formContext, useFieldContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,

  fieldComponents: {
    TextInput,
    FileInput,
    MultiFileInput,
    TextareaInput,
    SelectInput,
    MultiSelectInput,
  },
  formComponents: {},
});
