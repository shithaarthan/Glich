import React, { useState } from 'react';
import Button from './ui/Button';
import Textarea from './ui/Textarea';
import Modal from './ui/Modal';
import { useAuthStore } from '@/store/authStore';
import { useInteractionStore } from '@/store/interactionStore';

interface CreateResponseFormProps {
  isOpen: boolean;
  onClose: () => void;
  callId: string; // To link the response to a specific call
}

const CreateResponseForm: React.FC<CreateResponseFormProps> = ({ isOpen, onClose, callId }) => {
  const [responseText, setResponseText] = useState('');
  const { user } = useAuthStore();
  const { addComment } = useInteractionStore(); // Using addComment as it maps to creating a response

  const handleSubmit = async () => {
    if (!responseText.trim() || !user || !callId) {
      alert('Please enter your response, ensure you are logged in, and a call is selected.');
      return;
    }

    try {
      // Call the backend API via the store's addComment function
      // Note: addComment expects a comment object with author and content.
      await addComment(callId, {
        author: {
          name: user.name || 'Demo User',
          username: user.username || 'demo_user', // Use username from authStore
          avatar: user.avatarUrl || 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg'
        },
        content: responseText
      });
      
      alert('Response submitted successfully!');
      setResponseText(''); // Clear the form
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Failed to submit response. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Your Response">
      <div className="space-y-4">
        <div>
          <label htmlFor="responseText" className="block text-sm font-medium text-text mb-1">Your Response</label>
          <Textarea
            id="responseText"
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)} // Corrected typo here
            placeholder="Share your thoughts or insights..."
            rows={5}
            className="resize-none"
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit Response
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateResponseForm;
