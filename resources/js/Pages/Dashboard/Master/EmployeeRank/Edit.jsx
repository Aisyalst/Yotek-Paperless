import React from 'react';
import DashboardLayout from '@/Layouts/Dashboard';
import { Head, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ employeeRank }) {
    const { data, setData, put, processing, errors } = useForm({
        title: employeeRank.title || '',
        order: employeeRank.order || '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('employee-ranks.update', employeeRank.id));
    };

    return (
        <DashboardLayout judulHalaman="Edit Employee Rank">
            <Head title={`Edit Rank - ${employeeRank.title}`} />

            <div className="max-w-2xl mx-auto py-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 text-[#1a1a1a]">Edit Rank</h2>

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <InputLabel htmlFor="title" value="Jabatan / Pangkat (Title)" />
                            <TextInput
                                id="title"
                                type="text"
                                name="title"
                                value={data.title}
                                className="mt-1 block w-full border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                            <InputError message={errors.title} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="order" value="Order" />
                            <TextInput
                                id="order"
                                type="number"
                                name="order"
                                value={data.order}
                                className="mt-1 block w-full border-gray-300 focus:border-[#eaae36] focus:ring-[#eaae36] rounded-md shadow-sm"
                                onChange={(e) => setData('order', e.target.value)}
                                required
                            />
                            <InputError message={errors.order} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-end">
                            <PrimaryButton className="bg-[#1a1a1a] hover:bg-[#eaae36] hover:text-[#1a1a1a] transition-colors" disabled={processing}>
                                Update
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
}
