import React from 'react';
import { useForm } from 'react-hook-form';
import Modal from '@/components/ui/Modal';
import { useModalStore } from '@/store/modalStore';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface EditProfileFormData {
  name: string;
  username: string;
  bio: string;
}

const EditProfileModal: React.FC = () => {
  const { isEditProfileModalOpen, closeEditProfileModal } = useModalStore();
  const { user } = useAuthStore();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditProfileFormData>({
    defaultValues: {
      name: user?.name || 'Demo User',
      username: 'demo_user',
      bio: 'Curator of digital oddities and AI-generated chaos. Celebrating the ghosts in the machine.'
    }
  });

  const onSubmit = (data: EditProfileFormData) => {
    console.log('Edit Profile Form Data:', data);
    // Here you would typically send the data to your backend
    closeEditProfileModal();
  };

  const handleClose = () => {
    reset(); // Reset form when closing
    closeEditProfileModal();
  };

  return (
    <Modal
      isOpen={isEditProfileModalOpen}
      onClose={handleClose}
      title="Edit Profile"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-text-muted mb-1 block">Name</label>
          <Input 
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <label className="text-sm font-medium text-text-muted mb-1 block">Username</label>
          <Input 
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>
        
        <div>
          <label className="text-sm font-medium text-text-muted mb-1 block">Bio</label>
          <Textarea 
            {...register('bio')}
          />
        </div>
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;
