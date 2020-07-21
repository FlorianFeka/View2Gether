import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { Command, Action } from '../models/Command';
import { Subscription } from 'rxjs';
import { Info } from '../models/Info';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css'],
})
export class RoomComponent implements OnInit, OnDestroy {
  public YT: any;
  public video: any;
  public player: any;
  public reframed: boolean = false;
  public id: string;
  private commands: Subscription;
  private onGetInfo: Subscription;
  private paused: boolean = true;
  private joined: boolean = true;

  isRestricted = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  constructor(
    private route: ActivatedRoute,
    private socketService: SocketService,
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.joined = this.checkIfJoinedRoom();
    this.video = 'uxfoa23skHg';
    this.init();
  }

  ngOnDestroy(): void {
    this.commands.unsubscribe();
    this.onGetInfo.unsubscribe();
  }

  init() {
    // return if player is already created
    if (window['YT']) {
      this.startVideo();
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window['onYouTubeIframeAPIReady'] = () => {
      this.startVideo();
    };
  }

  checkIfJoinedRoom() {
    if (history.state.data !== undefined && history.state.data.join === false) {
      return false;
    }
    return true;
  }

  requestForInfoIfJoining() {
    if (this.joined) {
      const infoSub = this.socketService
        .getInfo(this.id)
        .subscribe((info: Info) => {
          console.log(info);

          this.changeVideo(info.videoUrl);
          infoSub.unsubscribe();
        });
    }
  }

  listenToInfoRequests() {
    this.onGetInfo = this.socketService.onGetInfo().subscribe(() => {
      const info: Info = <Info>{
        videoUrl: this.video,
        time: Date.now(),
        paused: this.paused,
      };
      console.log(info);

      this.socketService.sendInfo(this.id, info);
    });
  }

  listenToCommands() {
    this.commands = this.socketService
      .onCommand()
      .subscribe((data: Command) => {
        switch (data.action) {
          case Action.play:
            console.log('Command Play');

            this.changeVideo(data.value);
            break;
          case Action.pause:
            break;
          case Action.speed:
            break;
        }
      });
  }

  extractVideoId(url: string): string {
    // Regex to extract video ID from url
    let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    let match = url.match(regExp);
    if (match && match[2].length == 11) {
      return match[2];
    } else {
      // TODO - Handle incorrect urls
      return null;
    }
  }

  changeVideo(videoId: string) {
    console.log(`Load Video ${videoId}`);
    console.log(this.player);

    this.player.loadVideoById(videoId, 0, 'default');
  }

  changeRoomVideo(url: string) {
    this.video = this.extractVideoId(url);
    if (this.video != null) {
      const command = new Command();
      command.action = Action.play;
      command.value = this.video;
      this.socketService.sendCommand(this.id, command);
    }
  }

  startVideo() {
    this.reframed = false;
    this.player = new window['YT'].Player('player', {
      videoId: this.video,
      playerVars: {
        autoplay: 1,
        modestbranding: 1,
        controls: 1,
        disablekb: 1,
        rel: 0,
        showinfo: 0,
        fs: 0,
        playsinline: 1,
      },
      events: {
        onStateChange: this.onPlayerStateChange.bind(this),
        onError: this.onPlayerError.bind(this),
        onReady: this.onPlayerReady.bind(this),
        onPlaybackRateChange: this.onPlaybackRateChange.bind(this),
      },
    });
  }

  onPlayerReady(event) {
    this.socketService.joinRoom(this.id);
    this.listenToInfoRequests();
    this.listenToCommands();
    this.requestForInfoIfJoining();
    if (this.isRestricted) {
      event.target.mute();
      event.target.playVideo();
    } else {
      event.target.playVideo();
    }
  }

  onPlayerStateChange(event) {
    switch (event.data) {
      case window['YT'].PlayerState.PLAYING:
        if (this.player.getCurrentTime() === 0) {
          console.log('started ' + this.player.getCurrentTime());
        } else {
          this.paused = false;
          console.log('playing ' + this.player.getCurrentTime());
        }
        break;
      case window['YT'].PlayerState.PAUSED:
        if (this.player.getDuration() - this.player.getCurrentTime() !== 0) {
          this.paused = true;
          console.log('paused' + ' @ ' + this.player.getCurrentTime());
        }
        break;
      case window['YT'].PlayerState.ENDED:
        console.log('ended ');
        break;
    }
  }

  onPlaybackRateChange(event) {
    console.log('speed changed to ' + event.data);
  }

  onPlayerError(event) {
    switch (event.data) {
      case 2:
        console.log('' + this.video);
        break;
      case 100:
        break;
      case 101 || 150:
        break;
    }
  }
}
