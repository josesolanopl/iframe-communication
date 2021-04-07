import * as React from 'react'
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { MainWindowChannel } from './WindowChannel/MainWindowChannel';

let channel: MainWindowChannel
const listener = () => {
  console.log(channel.connections)
}

export function App() {
  const [open, setOpen] = React.useState(false)

  const showDialog = () => {
    setOpen(true)
  }

  const onRef = (node: HTMLIFrameElement) => {
    if (!node) {
      return
    }
    channel = new MainWindowChannel(node.contentWindow as Window, {
      origin: 'http://localhost:3009'
    })
    channel.on('connection', listener)
    channel.on('close', ({data: closingData}) => {
      console.log(closingData)
      setOpen(false)
      channel.dispose()
    })
  }

  React.useEffect(() => {
    return () => {
      if (!channel) {
        return
      }
      channel.off('connection', listener)
    }
  }, [])

  const poopClick = () => {
    channel.emit('poop')
  }

  return <div>
    <h1>Hi i am an app</h1>
    <button onClick={showDialog}>Show me the iframe</button>

    <Dialog isOpen={open} style={{
      padding: 0,
      width: '800px',
      height: '500px'
    }}>
        <iframe
          style={{
            width: '100%',
            height: '100%',
          }}
          title="homework-assign"
          src="http://localhost:3009/#/homework-assign"
          ref={onRef}
        ></iframe>
        <button onClick={poopClick}>
          POOP!
        </button>
    </Dialog>
  </div>
}
