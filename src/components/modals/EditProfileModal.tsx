import React from 'react';
import Modal from '@/components/ui/Modal';
import { useModalStore } from '@/store/modalStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

const EditProfileModal: React.FC = () => {
  const { isEditProfileModalOpen, closeEditProfileModal } = useModalStore();

  return (
    <Modal
      isOpen={isEditProfileModalOpen}
      onClose={closeEditProfileModal}
      title="Edit Profile"
    >
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-text-muted mb-1 block">Name</label>
          <Input defaultValue="Glitch User" />
        </div>
        <div>
          <label className="text-sm font-medium text-text-muted mb-1 block">Username</label>
          <Input defaultValue="@glitch_user" />
        </div>
        <div>
          <label className="text-sm font-medium text-text-muted mb-1 block">Bio</label>
          <Textarea defaultValue="Curator of digital oddities and AI-generated chaos. Celebrating the ghosts in the machine." />
        </div>
        <div className="flex justify-end space-x-3 pt-4">
          <Button variant="secondary" onClick={closeEditProfileModal}>Cancel</Button>
          <Button variant="primary">Save Changes</Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditProfileModal;
