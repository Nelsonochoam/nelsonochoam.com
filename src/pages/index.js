import React, { useState } from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Image from "gatsby-image"

import { Tags } from "../components/tags"

import styled from "styled-components"

const TagsContainer = styled.div`
  display: flex;
  justify-content: flex-start;

  .frontmatter-tags {
    margin-top: 10px;
    font-weight: bold;
  }
`

const BlogIndex = ({ data, location }) => {
  const [selectedTag, setSelectedTag] = useState()
  const welcome = data?.welcome?.childImageSharp?.fluid

  const siteTitle = data.site.siteMetadata?.title || `Title`
  const tags = data.allMarkdownRemark.nodes
    .flatMap(post => post.frontmatter.tags)
    .filter(tag => !!tag)

  const posts = () => {
    if (!selectedTag) return data.allMarkdownRemark.nodes
    const matches_tag = tag => tag === selectedTag
    return data.allMarkdownRemark.nodes.filter(post =>
      post.frontmatter.tags.some(matches_tag)
    )
  }

  const filterByTag = tag => {
    if (tag === selectedTag) {
      setSelectedTag(undefined)
    } else {
      setSelectedTag(tag)
    }
  }

  if (posts().length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <SEO title={`Posts | ${siteTitle}`} />
        <Bio />
        <p>No blog posts found.</p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title={`Posts | ${siteTitle}`} />
      <Bio />

      <Image fluid={welcome} alt={"welcome"} />

      <div className="posts-section">
        <Tags tags={tags} onSelectTag={filterByTag} selectedTag={selectedTag} />

        <ol style={{ listStyle: `none` }}>
          {posts().map(post => {
            const title = post.frontmatter.title || post.fields.slug

            return (
              <li key={post.fields.slug}>
                <Link to={post.fields.slug} itemProp="url">
                  <article
                    className="post-list-item"
                    itemScope
                    itemType="http://schema.org/Article"
                  >
                    <header>
                      <h2>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: title,
                          }}
                          itemProp="headline"
                        />
                      </h2>
                      <small>{post.frontmatter.date}</small>
                    </header>
                    <section>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: post.frontmatter.description || post.excerpt,
                        }}
                        itemProp="description"
                      />
                    </section>
                    <TagsContainer>
                      <div className="frontmatter-tags">
                        {post.frontmatter.tags.join(", ")}
                      </div>
                    </TagsContainer>
                  </article>
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    welcome: file(absolutePath: { regex: "/welcome.png/" }) {
      childImageSharp {
        fluid(maxWidth: 730, quality: 100) {
          ...GatsbyImageSharpFluid
        }
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          tags
        }
      }
    }
  }
`
