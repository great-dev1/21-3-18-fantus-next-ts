import React from 'react'

import Form from '../screens/form'

const Home = () => {
  return (
    <div className="center color">
      <h1 className="ma0">mastering</h1>
      <div>
        <h3>how does it work?</h3>
        <p>
          My aim is to practise mastering. As anything it requires a lot of trial and error. So the idea is as follows:
        </p>
        <ol>
          <li>You send me a track</li>
          <li>It gets mastered based on your wishes & feedback</li>
          <li>If you like it, you are free to use the master for free. Otherwise just trash it.</li>
        </ol>
        <h3>what's the catch then?</h3>
        <p>
          Nothing really. It's{' '}
          <b>
            <i>completely free</i>
          </b>{' '}
          for you. It goes without saying that of course I will not upload the tracks anywhere. No surprises.
        </p>
        <h3>what if you like the result?</h3>
        <p>
          If you think the master is good you can use it for free withouth any royalties to me. It would be cool if you
          could reference me in the youtube description or spotify credits for mastering it, but it's totally optional
          and up to you.
        </p>
      </div>
      <br />
      <Form />
    </div>
  )
}

export default Home
