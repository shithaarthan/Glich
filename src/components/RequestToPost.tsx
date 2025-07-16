import React from 'react';
import Button from './ui/Button';

const RequestToPost: React.FC = () => {
  const handleRequest = () => {
    // Add logic to request permission to post
    console.log('Requesting permission to post...');
  };

  return (
    <div className="text-center p-8 bg-card rounded-lg">
      <h2 className="text-2xl font-bold mb-2">Join the conversation</h2>
      <p className="text-text-muted mb-4">You need to be a member of this community to post.</p>
      <Button onClick={handleRequest}>Request to Post</Button>
    </div>
  );
};

export default RequestToPost;
