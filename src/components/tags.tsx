import React from "react"
import styled from "styled-components"

export const Tag = styled.div<{ selected: boolean }>`
  margin: 5px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: bold;
  display: inline-block;

  background-color: ${props =>
    props.selected ? "var(--color-links)" : "var(--post-color)"};

  &:hover {
    cursor: pointer;
  }
`

const TagsContainer = styled.section`
  color: var(--color-text);
  margin-bottom: 40px;
`

const H2 = styled.h2`
  color: var(--color-text);
`

export const Tags = ({ tags, selectedTag, onSelectTag }) => {
  const tagSet = Array.from(new Set(tags))

  return (
    <TagsContainer>
      <H2>Tags</H2>
      {tagSet.map(tag => (
        <Tag
          role="button"
          tabIndex={0}
          onClick={() => onSelectTag(tag)}
          selected={selectedTag === tag}
        >
          {tag}
        </Tag>
      ))}
    </TagsContainer>
  )
}
