import React from "react"

import {
  Container,
  List,
  ListItem,
  Link as ChakraLink,
  Heading,
  Text
} from "@chakra-ui/layout"
import { GetStaticProps, InferGetStaticPropsType, NextPage } from "next"

import { Footer } from "../components/footer"
import { Main } from "../components/main"
import { BlogListResponse } from "../types/blog"
import { SiteDataResponse } from "../types/siteData"
import { client } from "../utils/api"

type StaticProps = {
  siteData: SiteDataResponse
  blogList: BlogListResponse
}
type PageProps = InferGetStaticPropsType<typeof getStaticProps>

const Page: NextPage<PageProps> = props => {
  const { siteData, blogList } = props

  return (
    <Container height="100vh">
      <Main>
        <Heading>{siteData.title}</Heading>
        <section>
          <h2>ブログ一覧</h2>
          <List spacing={3} my={0}>
            {blogList.contents.map(blog => (
              <ListItem key={blog.id}>
                <ChakraLink href={`/blogs/${blog.id}`} flexGrow={1} mr={2}>
                  <a>{blog.title}</a>
                </ChakraLink>
              </ListItem>
            ))}
          </List>
        </section>
      </Main>
      <Footer>
        <Text>Next ❤️ Chakra</Text>
      </Footer>
    </Container>
  )
}

export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const siteDataPromise = client.v1.sitedata.$get({
    query: { fields: "title" }
  })

  const blogListPromise = client.v1.blogs.$get({
    query: { fields: "id,title" }
  })

  const [siteData, blogList] = await Promise.all([
    siteDataPromise,
    blogListPromise
  ])

  return {
    props: { siteData, blogList },
    revalidate: 60
  }
}

export default Page
