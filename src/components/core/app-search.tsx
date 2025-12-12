import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type Props = Readonly<{
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}>;

export function AppSearch(props: Props) {
  return (
    <InputGroup>
      <InputGroupInput
        placeholder="جستجو..."
        value={props.value}
        onChange={props.onChange}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
}
