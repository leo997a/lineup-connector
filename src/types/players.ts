
export interface Player {
  id: string;
  name: string;
  position: string;
  image: string;
  number: number;
}

export interface Formation {
  name: string;
  lines: number[];
}

export interface LineupData {
  formation: Formation;
  goalkeeper: Player[];
  defense: Player[];
  midfield: Player[];
  attack: Player[];
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  colors: {
    primary: string;
    secondary: string;
    accent?: string;
  };
  players: Player[];
}
