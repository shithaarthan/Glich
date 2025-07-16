import React, { useState } from 'react';
import Button from './ui/Button';
import Textarea from './ui/Textarea';
import Modal from './ui/Modal';
import { useAuthStore } from '@/store/authStore';
import { useInteractionStore } from '@/store/interactionStore';

interface CreateEchoFormProps {
  isOpen: boolean;
  onClose: () => void;
  callId: string; // To link the echo to a specific call
}

const CreateEchoForm: React.FC<CreateEchoFormProps> = ({ isOpen, onClose, callId }) => {
  const [echoText, setEchoText] = useState(''); // Assuming echo is just text for now
  const { user } = useAuthStore();
  const { createEcho } = useInteractionStore(); // Assuming createEcho function exists in interactionStore

  const handleSubmit = async () => {
    if (!echoText.trim() || !user || !callId) {
      alert('Please enter your echo and ensure you are logged in.');
      return;
    }

    try {
      // Call the backend API via the store's createEcho function
      await createEcho(callId, "0", user.id, echoText); // Assuming createEcho takes callId, responseId, userId, echoText
      alert('Echo created successfully!');
      setEchoText(''); // Clear the form
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error creating echo:', error);
      alert('Failed to create echo. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create an Echo">
      <div className="space-y-4">
        <div>
          <label htmlFor="echoText" className="block text-sm font-medium text-text mb-1">Your Echo</label>
          <Textarea
            id="echoText"
            value={echoText}
            onChange={(e) => setEchoText(e.target.value)}
            placeholder="Share your echo..."
            rows={5}
            className="resize-none"
          />
        </div>
        
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Create Echo
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateEchoForm;
