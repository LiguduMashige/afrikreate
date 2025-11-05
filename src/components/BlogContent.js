import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaGlobe, FaCoins, FaPaintBrush, FaRocket, FaLink, FaExternalLinkAlt, FaQuoteLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const BlogContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: #2d3748;
  line-height: 1.8;
  font-size: 1.1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  
  @media (min-width: 768px) {
    padding: 2rem;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #4a6bff;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`;

const SectionHeader = styled.h2`
  color: #2c3e50;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.8rem;
  
  svg {
    color: #4a6bff;
  }
`;

const Content = styled.div`
  p {
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }

  ul, ol {
    margin: 1.5rem 0;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.8rem;
    position: relative;
    list-style-type: none;
    padding-left: 1.8rem;
    
    &::before {
      content: "•";
      color: #4a6bff;
      font-weight: bold;
      position: absolute;
      left: 0;
      font-size: 1.5rem;
      line-height: 1;
    }
  }
`;

const HighlightBox = styled.div`
  background: #f8f9ff;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-left: 3px solid #4a6bff;
`;

const BlogContent = ({ content }) => {
  const icons = {
    'Introduction': <FaGlobe />,
    'How Blockchain': <FaCoins />,
    'Benefits': <FaPaintBrush />,
    'Future': <FaRocket />
  };

  return (
    <BlogContainer>
      {content.sections.map((section, index) => (
        <Section key={index}>
          <SectionHeader>
            {Object.entries(icons).map(([key, icon]) => 
              section.heading.startsWith(key) ? icon : null
            )}
            {section.heading}
          </SectionHeader>
          <Content>
            {section.content.split('\n\n').map((paragraph, i) => {
              if (paragraph.startsWith('**')) {
                const [title, ...rest] = paragraph.split('**:');
                return (
                  <HighlightBox key={i}>
                    <strong>{title.replace('**', '')}</strong>
                    <div>{rest.join('')}</div>
                  </HighlightBox>
                );
              }
              return <p key={i} dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
            })}
          </Content>
        </Section>
      ))}
    </BlogContainer>
  );
};

export default BlogContent;
