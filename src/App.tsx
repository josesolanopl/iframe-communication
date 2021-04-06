import * as React from 'react'
import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";

export function App() {
  const [open, setOpen] = React.useState(false)

  const showDialog = () => {
    setOpen(true)
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
        ></iframe>
    </Dialog>
  </div>
}
