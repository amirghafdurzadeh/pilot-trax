import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type Props = Readonly<{
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}>;

export function AppSearch(props: Props) {
  return (
    <InputGroup>
      <InputGroupInput
        placeholder={props.placeholder}
        value={props.value}
        onChange={props.onChange}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
}
