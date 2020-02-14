import React, { Component } from 'react'
// import { API_URL } from './config'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFire } from '@fortawesome/free-solid-svg-icons'
import { faSmog } from '@fortawesome/free-solid-svg-icons'
import { faTree } from '@fortawesome/free-solid-svg-icons'
import firebase from "firebase";

const API_URL = "http://localhost:5000"
const content_type = 'image/jpeg'
const firebaseConfig = {
  apiKey: "AIzaSyBp6jBOyWb6KuqOhFjpQuEWczNoEzsQuFo",
  authDomain: "fire-8df5b.firebaseapp.com",
  databaseURL: "https://fire-8df5b.firebaseio.com",
  projectId: "fire-8df5b",
  storageBucket: "fire-8df5b.appspot.com",
  messagingSenderId: "36012338897",
  appId: "1:36012338897:web:3995addfff4d47bfdc1ff0"
}
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore()

export default class App extends Component {

  state = {
    uploading: false,
    images: [],
    index: 0
  }

  componentDidMount() {
    db.collection('images').get().then(data => {
      let docs = []
      data.docs.forEach(doc => docs.push(doc.data()))
      this.setState({ images: docs })
    })
  }

  handleClick(source) {
    let images = this.state.images
    let index = this.state.index

    if (index >= this.state.images.length) {
      return
    }

    switch (source) {
      case 0:
        // Fire
        images[index]['class'] = 'fire'
        break
      case 1:
        // No fire
        images[index]['class'] = 'nofire'
        break
      case 2:
        // Smoke
        images[index]['class'] = 'smoke'
        break
    }
    this.setState({ images: images, index: index + 1 })
    this.updateDB(images[index])
  }

  updateDB(img) {
    db.collection('images').doc(img.name).update(img)
  }

  onChange = e => {
    const files = Array.from(e.target.files)
    this.setState({ uploading: true })

    // files.forEach((file, i) => {
    //   formData.append(i, file)
    // })

    fetch(`${API_URL}/api/image`, {
      method: 'POST',
      body: files[0],
      headers:
        { 'content-type': content_type }

    })
      .then(res => res.json())
      .then(images => {
        console.log(images)
        this.setState({
          uploading: false,
          images
        })
      })
  }

  removeImage = id => {
    this.setState({
      images: this.state.images.filter(image => image.public_id !== id)
    })
  }

  render() {
    return (
      <div>
        <div className='App'>
          <div className="image">
            <img src={this.state.images[this.state.index] ?
              this.state.images[this.state.index].image :
              ''}>
            </img>
          </div>
          <div className="buttonRow">
            <div className="stopButton">
              <FontAwesomeIcon icon={faFire} onClick={this.handleClick.bind(this, 0)} />
              <h5>Fuego</h5>
            </div>

            <div className="playButton">
              <FontAwesomeIcon icon={faTree} onClick={this.handleClick.bind(this, 1)} />
              <h5>No fuego</h5>
            </div>

            <div className="resetButton">
              <FontAwesomeIcon icon={faSmog} onClick={this.handleClick.bind(this, 2)} />
              <h5>Humo</h5>
            </div>
          </div>

        </div>
      </div>
    )
  }
}
