import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Camera } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { useModalStore } from '@/store/modalStore';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface EditProfileFormData {
  username: string;
  bio: string;
  avatar?: FileList;
  banner?: FileList;
}

const EditProfileModal: React.FC = () => {
  const { isEditProfileModalOpen, closeEditProfileModal } = useModalStore();
  const { user } = useAuthStore();

  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || 'https://images.pexels.com/photos/1542083/pexels-photo-1542083.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1');
  const [bannerPreview, setBannerPreview] = useState('https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<EditProfileFormData>({
    defaultValues: {
      username: 'demo_user',
      bio: 'Curator of digital oddities and AI-generated chaos. Celebrating the ghosts in the machine.'
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (file) {
      setter(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: EditProfileFormData) => {
    console.log('Edit Profile Form Data:', {
      ...data,
      avatar: data.avatar?.[0],
      banner: data.banner?.[0]
    });
    // Here you would typically send the data (including files) to your backend
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
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Banner and Avatar */}
        <div className="relative h-48 bg-cover bg-center rounded-lg" style={{ backgroundImage: `url(${bannerPreview})` }}>
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <Button type="button" variant="secondary" onClick={() => bannerInputRef.current?.click()}>
              <Camera size={16} className="mr-2" />
              Edit Cover Photo
            </Button>
            <input 
              type="file" 
              accept="image/*"
              className="hidden"
              {...register('banner')}
              ref={bannerInputRef}
              onChange={(e) => handleFileChange(e, setBannerPreview)}
            />
          </div>
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
            <div className="relative group">
              <img src={avatarPreview} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-background" />
              <div 
                className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => avatarInputRef.current?.click()}
              >
                <Camera size={24} className="text-white" />
              </div>
              <input 
                type="file" 
                accept="image/*"
                className="hidden"
                {...register('avatar')}
                ref={avatarInputRef}
                onChange={(e) => handleFileChange(e, setAvatarPreview)}
              />
            </div>
          </div>
        </div>

        {/* Spacer for avatar */}
        <div className="pt-12" />

        {/* Form Fields */}
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
            rows={4}
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
