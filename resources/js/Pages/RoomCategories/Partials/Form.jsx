import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';

export default function CategoryForm({ category = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        name: category?.name ?? '',
        capacity: category?.capacity ?? 1,
    });

    const submit = (e) => {
        e.preventDefault();

        if (category) {
            put(route('room-categories.update', category.id));
        } else {
            post(route('room-categories.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div>
                <InputLabel htmlFor="name" value="Nombre" />

                <TextInput
                    id="name"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    className="mt-1 block w-full"
                    isFocused
                    required
                />

                <InputError message={errors.name} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="capacity" value="Capacidad" />

                <TextInput
                    id="capacity"
                    type="number"
                    min="1"
                    value={data.capacity}
                    onChange={(e) => setData('capacity', e.target.value)}
                    className="mt-1 block w-full"
                    required
                />

                <InputError message={errors.capacity} className="mt-2" />
            </div>

            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>
                    {category ? 'Guardar cambios' : 'Crear categoría'}
                </PrimaryButton>
            </div>
        </form>
    );
}
