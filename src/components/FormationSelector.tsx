
import { useState } from "react";
import { formations } from "../data/formations";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface FormationSelectorProps {
  currentFormation: string;
  onFormationChange: (formation: string) => void;
}

const FormationSelector: React.FC<FormationSelectorProps> = ({ currentFormation, onFormationChange }) => {
  const [open, setOpen] = useState(false);
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-white bg-opacity-90 backdrop-blur-sm hover:bg-opacity-100 transition-all duration-200 animate-slide-down"
          style={{ animationDelay: '0.1s' }}
        >
          {currentFormation}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 backdrop-blur-xl bg-white/90 border border-gray-200">
        <Command>
          <CommandInput placeholder="Search formation..." />
          <CommandList>
            <CommandEmpty>No formation found.</CommandEmpty>
            <CommandGroup heading="Formations">
              {formations.map((formation) => (
                <CommandItem
                  key={formation.name}
                  value={formation.name}
                  onSelect={() => {
                    onFormationChange(formation.name);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${currentFormation === formation.name ? "opacity-100" : "opacity-0"}`}
                  />
                  {formation.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default FormationSelector;
