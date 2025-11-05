import React from 'react';
import { useParams } from 'react-router-dom';
import { blogContent } from '../data/blogContent';
import EnhancedBlogContent from '../components/EnhancedBlogContent';
import styled from 'styled-components';

const BlogPostContainer = styled.div`
  padding: 2rem 0;
  background-color: #f9faff;
  min-height: 100vh;
`;

const BlogHeader = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  padding: 4rem 2rem 3rem;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border-radius: 0 0 30px 30px;
  box-shadow: 0 10px 30px rgba(79, 70, 229, 0.2);
  position: relative;
  overflow: hidden;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    font-weight: 700;
    position: relative;
    z-index: 1;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.95;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
  position: relative;
  z-index: 1;
`;

const BlogPost = () => {
  const { id } = useParams();
  const post = blogContent[id];

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <BlogPostContainer>
      <BlogHeader>
        <h1>{post.title}</h1>
        <Subtitle>{post.subtitle}</Subtitle>
      </BlogHeader>
      <EnhancedBlogContent content={post} />
    </BlogPostContainer>
  );
};

export default BlogPost;
