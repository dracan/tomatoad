# Tomatoad

![Tomato](https://raw.githubusercontent.com/dracan/tomatoad/master/static/tomato.png)

Tomatoad is a cross-platform desktop [Pomodoro](https://en.wikipedia.org/wiki/Pomodoro_Technique) Timer.

I've recently started using the [Pomodoro Technique](https://en.wikipedia.org/wiki/Pomodoro_Technique), and have noticed a huge difference in the amount of work I can get done, due to being a lot more focused and ignoring distractions, eg. emails, Slack messages, etc. Basically a promise to myself that for 25 minutes, everything other than what I'm working on will be ignored. It makes quite a big difference!

Unfortunately, I couldn't find a Desktop Pomodoro app that I was happy with. So I decided to build my own!

This is very much work in progress (at the time of writing this readme, no code has yet been written!). It's going to be written with [Electron](https://electronjs.org/).

Obviously, having a Twitter account is clearly more important that having actual code! So [we can be found on Twitter here](https://twitter.com/tomatoadapp).

If you have any ideas or suggestions, then feel free to create a GitHub issue on this.

### Bruised Tomatos

Whilst the official technique says that you shouldn't be able to interupt a pomodoro - I think this is unrealistic. But you should be penalised for it. So I'm going to add a concept of a _"bruised tomato"_. So if interrupted - the logs / reports will show this as a bruised tomato. There'll be a bruised tomato icon/graphic to indicate this.

### Squished Tomatos

In the same way as you have bruised tomatos above, if you cancel a pomodoro - it'll become a _squished tomato_.

### Local Storage

By default, all your data will be stored locally. But there will be options to sync/backup to remote locations - FTP, Dropbox, etc.

### Reports

You'll be able to generate report in both HTML and PDF format.

# Building from Source

* Install [NodeJS](https://nodejs.org/)
* Clone this repository
* `npm install`
* `npm run compile`
* Finally `npm run dev` to run

This will then _live refresh_, meaning that you can edit the code, and the app will refresh as soon as you save the file without having to restart the app.

# Building installer

* Install [NodeJS](https://nodejs.org/)
* Clone this repository
* Run `cake.ps1`
