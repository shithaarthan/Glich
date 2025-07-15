import React from 'react';
import Modal from '@/components/ui/Modal';
import { useModalStore } from '@/store/modalStore';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';

const CreateEchoModal: React.FC = () => {
  const { isCreateEchoModalOpen, closeCreateEchoModal } = useModalStore();

  return (
    <Modal
      isOpen={isCreateEchoModalOpen}
      onClose={closeCreateEchoModal}
      title="Create a new Echo"
    >
      <div className="space-y-6">
        <div className="font-mono text-sm">
          <label className="text-primary font-bold mb-2 uppercase tracking-wider block">THE CALL</label>
          <Textarea placeholder="What question will you ask the machine?" />
        </div>
        <div className="font-mono text-sm">
          <label className="text-secondary font-bold mb-2 uppercase tracking-wider block">THE RETURN</label>
          <Textarea placeholder="What strange wisdom did it offer back?" />
        </div>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={closeCreateEchoModal}>Cancel</Button>
          <Button variant="primary">Echo</Button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateEchoModal;
