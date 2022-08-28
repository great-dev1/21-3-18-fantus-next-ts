import type { NextPage, GetStaticProps } from 'next'
import React from 'react'
import axios from 'axios'

type Props = {
  slugs: string[]
}

const Home: NextPage<Props> = ({ slugs }) => {
  const encoded = slugs.map((slug) => encodeURIComponent(`/fantus/${slug}/`))

  return (
    <div className="sets">
      <h1 className="ma0">sets</h1>
      <p>collection of some sets made here and there.</p>
      <ul>
        {encoded.map((link) => (
          <li key={link}>
            <iframe
              width="100%"
              height="120"
              src={`https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${link}`}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Home

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const { data } = await axios({
    url: 'https://www.mixcloud.com/graphql',
    method: 'post',
    data: {
      query: `
        query UserUploadsQuery($lookup: UserLookup!, $orderBy: CloudcastOrderByEnum) {
            user: userLookup(lookup: $lookup) {
              uploads(first: 100, orderBy: $orderBy) {
                edges {
                  node {
                    slug
                  }
                }
              }
            }
          }          
        `,
      variables: { lookup: { username: 'fantus' }, orderBy: 'LATEST' },
    },
  })
  const slugs: string[] = data.data.user.uploads.edges.map((item: any) => item.node.slug)
  return { props: { slugs } }
}
