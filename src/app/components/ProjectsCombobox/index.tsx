import { AsyncCombobox } from "../Combobox";
import { getProjectsComboboxOptions } from "./actions";

export const ProjectsCombobox = (props: {
  name: string;
  required?: boolean;
}) => {
  return <AsyncCombobox {...props} search={getProjectsComboboxOptions} />;
};
