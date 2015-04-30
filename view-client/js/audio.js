console.log('loaded');

document.addEventListener('DOMContentLoaded', function() {
  var container = document.createElement('div');

  document.body.appendChild(container);

  function AutoAudio(src, options) {
    options = options || {};

    this._audio = document.createElement('audio');

    this._audio.setAttribute('src', src);
    this._audio.setAttribute('preload', 'auto');

    this._checkLoop(options);
    this._checkAutoplay(options);

    container.appendChild(this._audio);
  };

  AutoAudio.prototype._checkLoop = function(options) {
    if (options.loop) {
      this._audio.setAttribute('loop', true);
    }
  };

  AutoAudio.prototype._checkAutoplay = function(options) {
    if (options.autoplay) {
      this._audio.setAttribute('autoplay', true);
    }
  };

  AutoAudio.prototype.play = function() {
    this._audio.play();
  };

  AutoAudio.prototype.pause = function() {
    this._audio.pause();
  };

  AutoAudio.prototype.stop = function() {
    this._audio.pause();
    this._audio.currentTime = 0;
  };

  AutoAudio.prototype.mute = function() {
    this._audio.muted = true;
  };

  AutoAudio.prototype.unmute = function() {
    this._audio.muted = false;
  };

  AutoAudio.prototype.setVolume = function(volume) {
    this._audio.volume = volume / 100;
  };

  window.AutoAudio = AutoAudio;
});