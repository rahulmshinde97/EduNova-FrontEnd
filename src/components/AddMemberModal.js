import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MultiSelect } from 'primereact/multiselect';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
  role: z.string().min(1, 'Role is required'),
  status: z.string().min(1, 'Status is required'),
  teams: z.array(z.string()).min(1, 'Select at least one team'),
});

export default function AddMemberModal({ isOpen, onClose, onSubmit, initialData }) {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData || { name: '', email: '', role: '', status: '', teams: [] },
  });

  const [selectedTeams, setSelectedTeams] = useState(initialData?.teams || []);
  const [profilePhoto, setProfilePhoto] = useState(initialData?.profilePhoto || null);

  useEffect(() => {
    if (initialData) {
      setValue('name', initialData.name || '');
      setValue('email', initialData.email || '');
      setValue('role', initialData.role || '');
      setValue('status', initialData.status || '');
      setValue('teams', initialData.teams || []);
      setSelectedTeams(initialData.teams || []);
      setProfilePhoto(initialData.profilePhoto || null);
    }
  }, [initialData, setValue]);

  const handleFormSubmit = (values) => {
    const updatedData = { ...values, profilePhoto };
    onSubmit(initialData ? { ...updatedData, id: initialData.id } : updatedData);
    reset();
    onClose();
  };

  const handleTeamChange = (e) => {
    setSelectedTeams(e.value);
    setValue('teams', e.value);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePhoto(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotoRemove = () => {
    setProfilePhoto(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg w-[600px] max-w-full">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative">
            {profilePhoto ? (
              <img src={profilePhoto} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                No Photo
              </div>
            )}
          </div>
          <div className="flex space-x-4 mt-4">
            <label className="bg-blue-500 text-white p-2 rounded cursor-pointer">
              Change Photo
              <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            </label>
            <button
              type="button"
              onClick={handlePhotoRemove}
              className="bg-red-500 text-white p-2 rounded"
            >
              Remove Photo
            </button>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-4">{initialData ? 'Edit Member' : 'Add Member'}</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Row 1: Name and Email */}
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm">Name</label>
              <input {...register('name')} className="w-full p-2 border rounded" />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>
            <div className="w-1/2">
              <label className="block text-sm">Email</label>
              <input {...register('email')} className="w-full p-2 border rounded" />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>
          </div>

          {/* Row 2: Role and Status */}
          <div className="flex space-x-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm">Role</label>
              <select {...register('role')} className="w-full p-2 border rounded">
                <option value="">Select role</option>
                <option value="Product Manager">Product Manager</option>
                <option value="Product Designer">Product Designer</option>
                <option value="Frontend Developer">Frontend Developer</option>
                <option value="Backend Developer">Backend Developer</option>
              </select>
              {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
            </div>
            <div className="w-1/2">
              <label className="block text-sm">Status</label>
              <select {...register('status')} className="w-full p-2 border rounded">
                <option value="">Select status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
              {errors.status && <p className="text-red-500 text-sm">{errors.status.message}</p>}
            </div>
          </div>

          {/* Row 3: Teams */}
          <div className="mb-4">
            <label className="block text-sm">Teams</label>
            <MultiSelect
              value={selectedTeams}
              options={['Design', 'Product', 'Marketing', 'Technology'].map(team => ({ label: team, value: team }))}
              onChange={handleTeamChange}
              className="w-full h-32 border rounded"
              display="chip"
            />
            {errors.teams && <p className="text-red-500 text-sm">{errors.teams.message}</p>}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                reset();
                onClose();
              }}
              className="bg-gray-300 text-gray-700 p-2 rounded"
            >
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              {initialData ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
