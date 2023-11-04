import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import App from "src/app"

const IndexPage: React.FC<PageProps> = () => {
  return (
    <App />
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>Home Page</title>
