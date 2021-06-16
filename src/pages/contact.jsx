import * as React from "react"
import { Parallax } from "@react-spring/parallax"
import { Themed } from "theme-ui"
import Layout from "@lekoarts/gatsby-theme-cara/src/components/layout"
import Seo from "@lekoarts/gatsby-theme-cara/src/components/seo"
import Content from "@lekoarts/gatsby-theme-cara/src/elements/content"
import Inner from "@lekoarts/gatsby-theme-cara/src/elements/inner"

const Contact = () => (
  <Layout>
    <Seo title="contact me" />
    <Parallax pages={1}>
      <div>
        <Content sx={{ variant: `texts.bigger` }} speed={0.4} offset={0} factor={1}>
          <Inner>
            <Themed.h1>weChat</Themed.h1>
            <Themed.p style={{textAlign:'center'}}>
             <img src="/me.jpeg" style={{width:200}}/>
            </Themed.p>
          </Inner>
        </Content>
      </div>
    </Parallax>
  </Layout>
)

export default Contact
