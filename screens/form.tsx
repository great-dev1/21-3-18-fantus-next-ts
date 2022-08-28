import React, { useState, useCallback } from 'react'
import { useForm } from 'formhero'

const initial = {
  contact: '',
  description: '',
}

const Form: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({
    title: '',
    error: false,
  })

  const { field, form, setForm } = useForm(initial)
  const [files, setFiles] = useState([] as File[])

  const _onFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessage({ title: '', error: false })
      const uploaded = Array.from(e.target.files || [])

      const nonAudio = uploaded.find((file) => !/^audio\//.test(file.type))
      if (nonAudio) {
        setMessage({
          title: `Error: ${nonAudio.name} You can only select audio files.`,
          error: true,
        })
        return
      }

      setFiles([...files, ...uploaded])
    },
    [files]
  )

  const _clear = useCallback(() => {
    setFiles([])
  }, [])

  const _submit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (loading) return

      // @ts-ignore
      window.grecaptcha.ready(() => {
        // @ts-ignore
        window.grecaptcha
          .execute(process.env.NEXT_PUBLIC_RECAPTCHA_CLIENT, { action: 'homepage' })
          .then(function (token: string) {
            setLoading(true)
            setMessage({ title: '', error: false })

            const body = new FormData()

            body.append(
              'json',
              JSON.stringify({
                ...form,
                token,
              })
            )

            for (const file of files) {
              body.append(file.name, file)
            }

            fetch('/api/form', {
              method: 'POST',
              body,
            })
              .then(() => {
                setForm(initial)
                setFiles([])
                setMessage({ title: 'Uploaded 🚀', error: false })
              })
              .catch(() => setMessage({ title: 'Something went wrong 😥', error: true }))
              .finally(() => setLoading(false))
          })
      })
    },
    [form, files, loading]
  )

  return (
    <form onSubmit={_submit}>
      <div className="body">
        <h3 className="ma0 mb3">submit track</h3>
        <label className="text">
          <small>contact email</small>
          <input type="email" disabled={loading} placeholder={'me@example.org'} {...field('contact')} />
        </label>
        <br />
        <label className="text">
          <small>description</small>
          <textarea
            rows={2}
            placeholder="reference trakcs, comments, ..."
            disabled={loading}
            {...field('description')}
          />
        </label>
        <br />
        <label className="file">
          <input type="file" multiple disabled={loading} onChange={_onFileChange} />
          upload tracks [max. 300MiB]
        </label>
        {/* {files.length > 0 && (
          <div>
            <input onClick={_clear} type="button" value="clear all" />
            <ul>
              {files.map((file, i) => (
                <li key={i}>{file.name}</li>
              ))}
            </ul>
          </div>
        )} */}
        <br />
        <input type="submit" value={loading ? 'uploading...' : 'submit'} disabled={loading} />

        {!!message.title && (
          <div>
            <br />
            <div className={`pa2 ba br1 ${message.error ? 'b--red' : 'b--light-blue'}`}>{message.title}</div>
          </div>
        )}
      </div>

      <div className="grc">
        This site is protected by reCAPTCHA and the Google&nbsp;
        <a href="https://policies.google.com/privacy">Privacy Policy</a> and&nbsp;
        <a href="https://policies.google.com/terms">Terms of Service</a> apply.
      </div>
    </form>
  )
}

export default Form
