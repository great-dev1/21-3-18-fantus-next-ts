import React, { useState, useCallback } from 'react'

import Link from '../components/link'

const HomeLink = () => (
  <div className="home">
    <Link href="/">
      <div>fantus</div>
    </Link>
  </div>
)

const Menu: React.FC = () => {
  const [open, setOpen] = useState(false)

  const _close = useCallback(() => {
    setOpen(false)
  }, [])

  const _toggle = useCallback(() => {
    setOpen(!open)
  }, [open])

  return (
    <nav className="main flex justify-between items-center">
      <HomeLink />

      <img id="icon" src="/assets/menu.svg" onClick={_toggle} />

      <div className={`links flex ${open ? 'open' : ''}`.trim()} onClick={_close}>
        <HomeLink />
        <Link href="/works">
          <div>works</div>
        </Link>
        <Link href="/sets">
          <div>sets</div>
        </Link>
        <Link href="/mastering">
          <div>mastering</div>
        </Link>
        <Link href="/about">
          <div>about</div>
        </Link>
      </div>
    </nav>
  )
}

export default Menu
