enum ElementType {
  SERPIENTE = 'Serpiente',
  ESCALERA = 'Escalera',
}
export abstract class BaseGameElement {
  private readonly elementType: ElementType;
  public readonly from: number;
  public readonly to: number;
  constructor(elementType: ElementType, from: number, to: number) {
    this.elementType = elementType;
    this.from = from;
    this.to = to;
  }
  showMessage = (player: Player) =>
    console.log(
      `${player.getPresentation()} ha caído en una ${this.elementType} desde ${
        this.from
      } hasta ${this.to}`
    );
}
export class Snake extends BaseGameElement {
  constructor(from: number, to: number) {
    super(ElementType.SERPIENTE, from, to);
  }
}
export class Ladder extends BaseGameElement {
  constructor(from: number, to: number) {
    super(ElementType.ESCALERA, from, to);
  }
}

export class Player {
  private readonly name: string;
  private readonly turn: number;
  private position: number;
  constructor(name: string, turn: number) {
    this.name = name;
    this.turn = turn;
    this.position = 1;
  }
  getPosition = () => this.position;
  showPosition = () => console.log(this.name, 'está en ', this.position);
  getPresentation = () => `Jugador #${this.turn}: ${this.name}`;
  showPresentation = () => console.log(this.getPresentation());
  move = (to: number) => (this.position = to);
}

export class Dice {
  static launch = () => Math.floor(Math.random() * 6) + 1;
}

export class Game {
  private readonly players: Player[];
  private readonly board: any[];
  constructor(players: Player[], snakesAndLaders: BaseGameElement[]) {
    this.players = players;
    this.board = new Array(100);
    // console.log(board);
    snakesAndLaders.forEach((element) => {
      this.board[element.from] = element;
    });
  }
  private get canAdvance() {
    return !(
      this.players.filter((player) => player.getPosition() >= 100).length > 0
    );
  }
  private tick() {
    this.players.forEach((player) => player.showPosition());

    for (const player of this.players) {
      const newPlayerPosition = player.getPosition() + Dice.launch();
      const boardSquare = this.board[newPlayerPosition];
      player.move(
        boardSquare instanceof BaseGameElement
          ? (boardSquare as BaseGameElement).to
          : newPlayerPosition
      );
      //   if (boardSquare instanceof Snake) {
      //     console.log(player.getPresentation(), 'cayó en serpiente');
      //     player.showPosition();
      //   }
      //   if (boardSquare instanceof Ladder) {
      //     console.log(player.getPresentation(), 'cayó en escalera');
      //     player.showPosition();
      //   }
      if (boardSquare instanceof BaseGameElement)
        boardSquare.showMessage(player);
      if (player.getPosition() >= 100) {
        console.log('El ganador es ', player.getPresentation());
        break;
      }
    }
    console.log`/////////////////`;
  }
  start() {
    this.players.forEach((player) => player.showPresentation());
    while (this.canAdvance) this.tick();
  }
}
