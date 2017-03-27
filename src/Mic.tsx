import * as React from 'react'
import * as recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone'
import './Mic.css'


export class Mic extends React.PureComponent<{}, ComponentState> {
  private isRecording = false
  private recognizeStream: any = null


  constructor(props) {
    super(props)
    this.state = { transcripts: [] }
  }


  getTokenAsync() {
    return fetch('http://localhost:4000/api/watson/speech-to-text/token')
      .then(res => res.json() as any)
      .then(data => data.token)
      .catch(err => {
        alert(err)
        throw err
      })
  }


  async toggleMicrophoneState() {
    /*
      isRecording === true && recognizeStream === null のときは、
      RECボタンは押されたがまだrecognizeStreamが生成される前の状態なので何もしない。
    */
    if (this.recognizeStream) {
      this.stopRecognizeStream()

    } else if (!this.isRecording) {
      this.isRecording = true

      await this.getTokenAsync()
        .then(token => {
          this.setState({ transcripts: [] })
          this.startRecognizeStream(token)
        })
    }
  }


  startRecognizeStream(token: string) {
    const stream = recognizeMicrophone({
      token,
      model: 'ja-JP_BroadbandModel',
      objectMode: true,
      extractResults: true,
    })
    console.log('stream:', stream)

    stream.on('data', (data: AudioResult) => {
      console.log('data:', data)
      if (data.final) {
        const transcript = data.alternatives[0].transcript
        this.setState({ transcripts: [...this.state.transcripts, transcript] })
      }
    })

    this.recognizeStream = stream
  }


  stopRecognizeStream() {
    if (this.recognizeStream) {
      this.recognizeStream.stop()
      this.recognizeStream.removeAllListeners()
    }

    this.isRecording = false
    this.recognizeStream = null
  }


  render() {
    const buttonName = !this.recognizeStream ? 'REC' : 'STOP'

    return (
      <div>
        <div>Mic Component</div>
        <button onClick={() => this.toggleMicrophoneState().then(() => this.forceUpdate())}>
          {buttonName}
        </button>
        <div className="transcript">{this.state.transcripts.join(', ')}</div>
      </div>
    )
  }
}




interface ComponentState {
  transcripts: string[],
}

interface AudioResult {
  index: number,
  final: boolean,
  alternatives: Alternative[],
}

interface Alternative {
  confidence?: number,
  transcript: string,
}
