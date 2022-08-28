import React from 'react'
import App from 'next/app'
import Head from 'next/head'
import dynamic from 'next/dynamic'

import 'tachyons/css/tachyons.min.css'
import './_app.css'
import Menu from '../screens/menu'
import Content from '../components/content'

const Background = dynamic(() => import('../components/background'), { ssr: false })

export default class extends App {
  render() {
    const { Component, pageProps } = this.props
    return (
      <React.Fragment>
        <Head>
          <title>fantus</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta charSet="utf-8" />
          <meta name="description" content="fantus - producer, dj, engineer" />
          <meta name="keywords" content="dj,producer,mastering,service,free,sets,mix,techno,music,set" />
          <link href="https://fonts.googleapis.com/css?family=Space+Mono:400,700&display=swap" rel="stylesheet" />
          <script
            src={'https://www.google.com/recaptcha/api.js?render=' + process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT}
          ></script>
        </Head>
        <Menu />
        <Background />
        <Content>
          <Component {...pageProps} />
        </Content>
      </React.Fragment>
    )
  }
}
