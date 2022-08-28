import React from 'react'
import NextLink, { LinkProps } from 'next/link'
import { useRouter } from 'next/router'

const Link: React.FC<LinkProps> = ({ href, children }) => {
    const router = useRouter()

    let className = ''
    try {
        // @ts-ignore
        className = children.props.className || ''
    } catch { }

    if (router.pathname === href)
        className = `${className} active`.trim()

    return <NextLink href={href}>{React.cloneElement(children as React.ReactElement, { className })}</NextLink>
}

export default Link