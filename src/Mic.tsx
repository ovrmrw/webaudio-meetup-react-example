import * as React from 'react'
import * as recognizeMicrophone from 'watson-speech/speech-to-text/recognize-microphone'


export class Mic extends React.PureComponent<{}, ComponentState> {
  private isRecording = false


  constructor(props) {
    super(props)
    this.state = {
      // isRecording: false,
      stream: null,
      transcripts: [],
    }
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


  toggleMicrophoneState() {
    // isRecording === true && stream === null のときは、RECボタンは押されたがまだstreamが生成される前の状態なので何もしない。
    if (this.state.stream) {
      this.stopRecognizeStream()

    } else if (!this.isRecording) {
      this.isRecording = true

      this.getTokenAsync()
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

    this.setState({ stream })
  }


  stopRecognizeStream() {
    if (this.state.stream) {
      this.state.stream.stop()
      this.state.stream.removeAllListeners()
    }

    this.isRecording = false
    this.setState({ stream: null })
  }


  render() {
    const buttonName = !this.state.stream ? 'REC' : 'STOP'
    const transcripts = this.state.transcripts

    return (
      <div>
        <div>Mic Component</div>
        <button onClick={() => this.toggleMicrophoneState()}>{buttonName}</button>
        <div>{transcripts.join(', ')}</div>
      </div>
    )
  }
}



interface ComponentState {
  // isRecording: boolean,
  stream: any,
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
