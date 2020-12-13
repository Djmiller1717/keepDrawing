import React, { Component } from 'react';
import * as handTrack from 'handtrackjs';
import ThreeDScene from '../babylon/game';

const modelParams = {
  flipHorizontal: true,
  imageScaleFactor: 1.0,
  maxNumBoxes: 1,
  iouThreshold: 0.5,
  scoreThreshold: 0.70,
};

let model = null;
const video = document.getElementById('myVideo');
const drawingCanvas = document.getElementById('drawingCanvas');
const handCanvas = document.getElementById('handCanvas');
const drawingContext = drawingCanvas.getContext('2d');
const handContext = handCanvas.getContext('2d');

export default class DrawingGame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVideo: false,
      draw: false,
      erase: false,
      message: '',
      socket: props.socket,
    };
    this.startVideo = this.startVideo.bind(this);
    this.runDetection = this.runDetection.bind(this);
    this.startGame = this.startGame.bind(this);
    this.handleButton = this.handleButton.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
  }

  handleButton(drawStatus, eraseStatus) {
    if (drawStatus) this.setState({ message: 'Drawing Activated' });
    if (eraseStatus) this.setState({ message: 'Eraser Activated' });
    if (!drawStatus && !eraseStatus) this.setState({ message: 'Drawing Paused' });
    this.setState({ draw: drawStatus, erase: eraseStatus });
  }

  clearCanvas() {
    drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
  }

  runDetection() {
    const {
      isVideo, erase, draw,
    } = this.state;
    const { runDetection } = this;
    if (model) {
      model.detect(video).then((predictions) => {
        model.renderPredictions(predictions, handCanvas, handContext, video);
        if (predictions[0]) {
          const hand = predictions[0].bbox;
          const midValX = hand[0] + (hand[2] / 2);
          const midValY = hand[1] + (hand[3] / 2);
          if (draw) drawingContext.fillRect(midValX, midValY, 20, 20);
          if (erase) drawingContext.clearRect(midValX, midValY, 10, 10);
        }
        if (isVideo) {
          window.requestAnimationFrame(runDetection);
        }
      });
    }
  }

  startVideo() {
    handTrack.startVideo(video)
      .then((status) => {
        if (status) {
          this.setState({ isVideo: true, message: 'Click START DRAWING to begin!' });
          this.runDetection();
        } else {
          this.setState({ message: 'Please enable your video' });
        }
      });
  }

  startGame() {
    const { startVideo } = this;
    handTrack.load(modelParams)
      .then((lmodel) => {
        model = lmodel;
        startVideo();
      });
  }

  render() {
    const { handleButton, startGame } = this;
    const { isVideo, message, socket } = this.state;
    if (!isVideo) startGame();
    return (
      <ThreeDScene socket={socket} handleButton={handleButton} clearCanvas={this.clearCanvas} />
    );
  }
}
