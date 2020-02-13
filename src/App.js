import React, { Component } from 'react'
import Spinner from './Spinner'
import Images from './Images'
import Buttons from './Buttons'
// import { API_URL } from './config'
import './App.css'

const API_URL = "http://localhost:5000"
const content_type = 'image/jpeg'

export default class App extends Component {

  state = {
    uploading: false,
    images: []
  }

  onChange = e => {
    const files = Array.from(e.target.files)
    this.setState({ uploading: true })

    const formData = new FormData()

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
    const { uploading, images } = this.state

    const content = () => {
      switch (true) {
        case uploading:
          return <Spinner />
        case images.length > 0:
          return <Images images={images} removeImage={this.removeImage} />
        default:
          return <Buttons onChange={this.onChange} />
      }
    }

    return (
      <div>
        <div className='buttons'>
          {content()}
        </div>
      </div>
    )
  }
}