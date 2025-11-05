import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaGlobe, FaCoins, FaPaintBrush, FaRocket } from 'react-icons/fa';

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
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  animation: ${fadeIn} 0.6s ease-out forwards;
  opacity: 0;
  animation-delay: ${props => props.delay || '0s'};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  }
`;

const SectionHeader = styled.h2`
  color: #1a202c;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.75rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 0.75rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #4f46e5, #7c3aed);
    border-radius: 2px;
  }
  
  svg {
    color: #4f46e5;
    background: #eef2ff;
    padding: 0.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(79, 70, 229, 0.15);
  }
`;

const Content = styled.div`
  p {
    margin-bottom: 1.5rem;
    color: #4a5568;
    font-size: 1.05rem;
    line-height: 1.8;
  }

  ul, ol {
    margin: 1.5rem 0;
    padding-left: 0;
  }

  li {
    margin-bottom: 0.8rem;
    position: relative;
    list-style-type: none;
    padding-left: 2rem;
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0.6em;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #4f46e5;
    }
  }
  
  a {
    color: #4f46e5;
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px dashed #a5b4fc;
    transition: all 0.2s ease;
    
    &:hover {
      color: #4338ca;
      border-bottom-style: solid;
    }
  }
`;

const HighlightBox = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.75rem;
  margin: 2rem 0;
  border-left: 4px solid #4f46e5;
  position: relative;
  overflow: hidden;
  
  strong {
    display: block;
    color: #1e40af;
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
  }
  
  div {
    color: #4b5563;
    line-height: 1.7;
  }
`;

const EnhancedBlogContent = ({ content }) => {
  const icons = {
    'Introduction': <FaGlobe />,
    'How Blockchain': <FaCoins />,
    'Benefits': <FaPaintBrush />,
    'Future': <FaRocket />
  };

  return (
    <BlogContainer>
      {content.sections.map((section, index) => (
        <Section 
          key={index}
          delay={`${index * 0.1}s`}
        >
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

export default EnhancedBlogContent;
