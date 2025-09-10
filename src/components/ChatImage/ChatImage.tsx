import React from 'react';

interface ChatImageProps {
  src: string;
  alt: string;
}

const ChatImage: React.FC<ChatImageProps> = ({ src, alt }) => {
  return <img src={`data:image/png;base64,${src}`} alt={alt} style={{ maxWidth: '100%', height: 'auto' }} />;
};

export default ChatImage;