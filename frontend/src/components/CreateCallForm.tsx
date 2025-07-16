import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import Modal from './ui/Modal'; // Assuming Modal component exists
import { useAuthStore } from '@/store/authStore';
import { useInteractionStore } from '@/store/interactionStore';

interface CreateCallFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateCallForm: React.FC<CreateCallFormProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const { user } = useAuthStore();
  const { createCall } = useInteractionStore(); // Assuming createCall function exists in interactionStore

  const handleSubmit = async () => {
    if (!prompt.trim() || !user) {
      alert('Please enter a prompt and ensure you are logged in.');
      return;
    }

    try {
      // Call the backend API via the store
      // Assuming createCall function in interactionStore handles the API call
      await createCall(user.id, prompt);
      alert('Call created successfully!');
      setPrompt(''); // Clear the form
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error creating call:', error);
      alert('Failed to create call. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create a New Call">
      <div className="space-y-4">
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium text-text mb-1">Your Prompt</label>
          <Textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your creative prompt for an AI..."
            rows={5}
            className="resize-none"
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Call
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateCallForm;
