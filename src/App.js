import React, { Component } from 'react';
import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';

const app = new Clarifai.App({
 apiKey: 'ddb57512f2df44e3a24fdb9b27020057'
});

const particlesOptions = {
    particles: {
        number: {
            value: 30,
              density: {
                enable: true,
                value_area: 800
              }
          }
      }
  }

class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin'
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiface = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiface.left_col * width,
      topRow: clarifaiface.top_row * height,
      rightCol: width - (clarifaiface.right_col * width),
      bottomRow: height - (clarifaiface.bottom_row * height)  
    }
  }

  displayFaceBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState( { input: event.target.value })
  }

  onSubmit = () => {
    this.setState( { imageUrl: this.state.input })
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err)); 
  }

  onRouteChange = (param) => {
    this.setState({ route: param });
  }

  render() {
    return (
      <div className="App">
        <Particles 
              className='particles'
              params={{ particlesOptions }}
            />
        <Navigation onRouteChange={this.onRouteChange} />
      { this.state.route === 'home'
        ? <div>
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange = {this.onInputChange} onButtonSubmit = {this.onSubmit} />
            <FaceRecognition box = {this.state.box} imageUrl = {this.state.imageUrl} />
          </div>

        : (
          this.state.route === 'signin'
          ? <SignIn onRouteChange={this.onRouteChange} />
          : <Register onRouteChange={this.onRouteChange} />
          )
      }
      </div>
    );
  }
}

export default App;
