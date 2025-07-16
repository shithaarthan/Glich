import React from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import { useModalStore } from '@/store/modalStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface CreateEchoFormData {
  call: string;
  response: string;
  specimen: string;
  tags: string;
}

const CreateEchoModal: React.FC = () => {
  const { isCreateEchoModalOpen, closeCreateEchoModal } = useModalStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateEchoFormData>();

  const onSubmit = (data: CreateEchoFormData) => {
    console.log('Create Echo Form Data:', data);
    // Here you would typically send the data to your backend
    reset(); // Reset the form
    closeCreateEchoModal(); // Close the modal
  };

  const handleClose = () => {
    reset(); // Reset form when closing
    closeCreateEchoModal();
  };

  return (
    <Modal
      isOpen={isCreateEchoModalOpen}
      onClose={handleClose}
      title="Create a new Echo"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-sm">
          <label className="text-primary font-bold mb-2 uppercase tracking-wider block">THE CALL</label>
          <Textarea 
            {...register('call', { required: 'The call is required' })}
            placeholder="What question will you ask the machine?" 
          />
          {errors.call && <p className="text-red-500 text-sm mt-1">{errors.call.message}</p>}
        </div>
        
        <div className="text-sm">
          <label className="text-secondary font-bold mb-2 uppercase tracking-wider block">THE RETURN</label>
          <Textarea 
            {...register('response', { required: 'The response is required' })}
            placeholder="What strange wisdom did it offer back?" 
          />
          {errors.response && <p className="text-red-500 text-sm mt-1">{errors.response.message}</p>}
        </div>

        <div className="text-sm">
          <label className="text-accent font-bold mb-2 uppercase tracking-wider block">Specimen</label>
          <Input
            {...register('specimen', { required: 'Specimen is required' })}
            placeholder="e.g., GPT-4, Claude, etc."
          />
          {errors.specimen && <p className="text-red-500 text-sm mt-1">{errors.specimen.message}</p>}
        </div>

        <div className="text-sm">
          <label className="text-accent font-bold mb-2 uppercase tracking-wider block">Tags</label>
          <Input
            {...register('tags')}
            placeholder="e.g., #AI, #art, etc."
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="primary">Echo</Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateEchoModal;
