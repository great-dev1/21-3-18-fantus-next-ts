import { createReadStream, statSync, unlinkSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'

import type { NextApiRequest, NextApiResponse } from 'next'
import Formidable from 'formidable'
import axios from 'axios'

const sendFileAndDelete = async (name: string, path: string) => {
  const stat = statSync(path)
  const stream = createReadStream(path)

  await axios({
    url: 'https://cloud.nicco.io/public.php/webdav/' + name,
    method: 'put',
    auth: {
      username: process.env.NEXTCLOUD_TOKEN || '',
      password: '',
    },
    headers: {
      'Content-Length': stat.size,
    },
    data: stream,
    maxContentLength: Infinity,
  })

  unlinkSync(path)
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // @ts-ignore
    const form = new Formidable()

    form.maxFileSize = 300 * 1024 * 1024 // 300MiB

    const body = await new Promise<any>((resolve, reject) => {
      form.parse(req, (err: any, fields: any, files: any) => {
        if (err) reject()
        else
          resolve({
            fields: JSON.parse(fields.json),
            files: Object.values(files),
          })
      })
    })

    const { token, ...rest } = body.fields

    const { data } = await axios({
      url: 'https://www.google.com/recaptcha/api/siteverify',
      method: 'post',
      params: {
        secret: process.env.RECAPTCHA_SERVER,
        response: token,
      },
    })

    if (!data.success) throw new Error()

    const now = Date.now()
    for (const file of body.files) await sendFileAndDelete(`${now}_${file.name}`, file.path)

    const txtFile = `${tmpdir()}/text`
    writeFileSync(txtFile, `${rest.contact}\n${rest.description}`)
    await sendFileAndDelete(`${now}_details.txt`, txtFile)

    res.status(200).end()
  } catch {
    res.status(400).end()
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
