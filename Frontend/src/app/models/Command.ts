export class Command {
    roomId: string;
    action: Action;
    value: any;
}

enum Action {
    play,
    pause,
    speed
}