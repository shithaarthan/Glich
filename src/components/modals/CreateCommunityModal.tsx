import React, { useState } from 'react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { useCommunityModalStore } from '@/store/communityModalStore';

const CreateCommunityModal: React.FC = () => {
  const { isOpen, closeModal } = useCommunityModalStore();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCreateCommunity = () => {
    // Add logic to create community here
    console.log('Creating community:', { name, description });
    closeModal();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Create a new community">
      <div className="space-y-4">
        <Input
          placeholder="Community Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="Community Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button onClick={handleCreateCommunity} className="w-full">
          Create Community
        </Button>
      </div>
    </Modal>
  );
};

export default CreateCommunityModal;
