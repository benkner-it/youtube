import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import { HeroComponent } from './components/HeroComponent'
import { FormComponent } from './components/FormComponent'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config;
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const { docs } = await payload.find({
    collection: "pages",

  })

  console.log(payload);
  console.log(user);
  console.log(docs[0]);
  const page = docs[0];

  function renderBlocks() {
    return page.layout.map(it => {
      console.log(it.id);
      switch (it.blockType) {
        case "hero":
          return <HeroComponent block={it} key={it.id} />
        case "form":
          return <FormComponent block={it} key={it.id} />
        default:
          return <pre key={new Date().toISOString()}>{JSON.stringify(it, null, 2)}</pre>
      }
    })
  }

  return (
    <div>
      Hello World - {page.title}

      {renderBlocks()}
    </div>
  )
}
