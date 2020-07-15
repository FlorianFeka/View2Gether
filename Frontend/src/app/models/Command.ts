export class Command {
  action: Action;
  value: any;
}

export enum Action {
  play,
  pause,
  speed
}
