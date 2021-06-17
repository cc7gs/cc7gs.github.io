import * as React from "react"
import { Global } from "@emotion/react"
import SEO from "@lekoarts/gatsby-theme-cara/src/components/seo"
import Header from "./header"

type LayoutProps = { children: React.ReactNode; className?: string }

const Layout = ({ children, className = `` }: LayoutProps) => (
  <React.Fragment>
    <Global
      styles={(theme) => ({
        "*": {
          boxSizing: `inherit`,
          "&:before": {
            boxSizing: `inherit`,
          },
          "&:after": {
            boxSizing: `inherit`,
          },
        },
        html: {
          fontSize: `18px`,
          WebkitTextSizeAdjust: `100%`,
        },
        img: {
          borderStyle: `none`,
        },
        pre: {
          fontFamily: `monospace`,
          fontSize: `1em`,
        },
        "[hidden]": {
          display: `none`,
        },
        "::selection": {
          backgroundColor: theme.colors.primary,
          color: theme.colors.background,
        },
      })}
    />
    <SEO />
     <Header/>
    <main className={className}>
      {children}
    </main>
  </React.Fragment>
)

export default Layout




