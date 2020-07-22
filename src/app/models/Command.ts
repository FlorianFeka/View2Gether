export class Command {
  action: Action;
  value: any;
}

export enum Action {
  change,
  play,
  pause,
  speed,
}
