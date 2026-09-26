import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';

export default function GuestForm({ guest = null }) {
    const { data, setData, post, put, processing, errors } = useForm({
        first_name: guest?.first_name ?? '',
        last_name: guest?.last_name ?? '',
        document_id: guest?.document_id ?? '',
        phone: guest?.phone ?? '',
        email: guest?.email ?? '',
        notes: guest?.notes ?? '',
    });

    const submit = (e) => {
        e.preventDefault();

        if (guest) {
            put(route('guests.update', guest.id));
        } else {
            post(route('guests.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="first_name" value="Nombre" />

                    <TextInput
                        id="first_name"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        className="mt-1 block w-full"
                        isFocused
                        required
                    />

                    <InputError message={errors.first_name} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="last_name" value="Apellido" />

                    <TextInput
                        id="last_name"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        className="mt-1 block w-full"
                        required
                    />

                    <InputError message={errors.last_name} className="mt-2" />
                </div>
            </div>

            <div>
                <InputLabel
                    htmlFor="document_id"
                    value="Documento de identidad"
                />

                <TextInput
                    id="document_id"
                    value={data.document_id}
                    onChange={(e) => setData('document_id', e.target.value)}
                    className="mt-1 block w-full"
                />

                <InputError message={errors.document_id} className="mt-2" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <InputLabel htmlFor="phone" value="Teléfono" />

                    <TextInput
                        id="phone"
                        value={data.phone}
                        onChange={(e) => setData('phone', e.target.value)}
                        className="mt-1 block w-full"
                    />

                    <InputError message={errors.phone} className="mt-2" />
                </div>

                <div>
                    <InputLabel
                        htmlFor="email"
                        value="Correo electrónico (opcional)"
                    />

                    <TextInput
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className="mt-1 block w-full"
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>
            </div>

            <div>
                <InputLabel
                    htmlFor="notes"
                    value="Observaciones (opcional)"
                />

                <textarea
                    id="notes"
                    value={data.notes}
                    onChange={(e) => setData('notes', e.target.value)}
                    className="input mt-1 block w-full"
                    rows={3}
                />

                <InputError message={errors.notes} className="mt-2" />
            </div>

            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>
                    {guest ? 'Guardar cambios' : 'Crear huésped'}
                </PrimaryButton>
            </div>
        </form>
    );
}
