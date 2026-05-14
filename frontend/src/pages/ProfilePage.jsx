import { useState, useEffect } from 'react';
import userService from '../services/userService';

const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');

    // Estado del formulario de editar nombre
    const [showEditName, setShowEditName]   = useState(false);
    const [newName, setNewName]             = useState('');
    const [nameLoading, setNameLoading]     = useState(false);
    const [nameError, setNameError]         = useState('');
    const [nameSuccess, setNameSuccess]     = useState('');

    // Estado del formulario de cambiar contraseña
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword:     '',
        confirmPassword: '',
    });
    const [passLoading, setPassLoading] = useState(false);
    const [passError, setPassError]     = useState('');
    const [passSuccess, setPassSuccess] = useState('');

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const data = await userService.getProfile();
                setProfile(data);
                setNewName(data.name);
            } catch (err) {
                setError('Error al cargar el perfil.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    // Actualizar nombre
    const handleNameSubmit = async (e) => {
        e.preventDefault();
        if (!newName.trim()) {
            setNameError('El nombre no puede estar vacío');
            return;
        }

        try {
            setNameLoading(true);
            setNameError('');
            setNameSuccess('');

            const updated = await userService.updateProfile({ name: newName.trim() });
            setProfile(updated);

            // Actualizamos el nombre en localStorage para que
            // Navbar y Sidebar muestren el nuevo nombre
            const currentUser = JSON.parse(localStorage.getItem('carepet_user'));
            if (currentUser) {
                localStorage.setItem('carepet_user', JSON.stringify({
                    ...currentUser,
                    name: updated.name,
                }));
            }

            setNameSuccess('Nombre actualizado correctamente');
            setShowEditName(false);

        } catch (err) {
            setNameError('Error al actualizar el nombre.');
            console.error(err);
        } finally {
            setNameLoading(false);
        }
    };

    // Cambiar contraseña
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (!passwordForm.currentPassword) {
            setPassError('Introduce tu contraseña actual');
            return;
        }
        if (!passwordForm.newPassword) {
            setPassError('Introduce la nueva contraseña');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setPassError('La nueva contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPassError('Las contraseñas no coinciden');
            return;
        }

        try {
            setPassLoading(true);
            setPassError('');
            setPassSuccess('');

            await userService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword:     passwordForm.newPassword,
            });

            setPassSuccess('Contraseña actualizada correctamente');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowChangePassword(false);

        } catch (err) {
            const msg = err.response?.data?.message
                || err.response?.data
                || 'Error al cambiar la contraseña.';
            setPassError(typeof msg === 'string' ? msg : 'Error al cambiar la contraseña.');
        } finally {
            setPassLoading(false);
        }
    };

    // Generamos las iniciales igual que en el Sidebar
    const initials = profile?.name
        ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase()
        : '?';

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <span className="text-4xl">👤</span>
                    <p className="text-text-medium mt-3">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg">
                {error}
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-text-dark">Mi perfil</h1>
                <p className="text-text-medium mt-1">
                    Gestiona tu información personal
                </p>
            </div>

            {/* TARJETA DE PERFIL */}
            <div className="bg-white rounded-xl border border-border p-6 mb-4">

                {/* Avatar e info principal */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary-bg border-2 border-border-dark flex items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-bold text-primary">
                            {initials}
                        </span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-text-dark">
                            {profile?.name}
                        </h2>
                        <p className="text-text-medium">{profile?.email}</p>
                        <p className="text-xs text-text-light mt-0.5">
                            Miembro desde {formatDate(profile?.createdAt)}
                        </p>
                    </div>
                </div>

                {/* Mensajes de éxito globales */}
                {nameSuccess && !showEditName && (
                    <div className="bg-accent-bg border border-accent text-accent px-4 py-3 rounded-lg mb-4 text-sm">
                        ✓ {nameSuccess}
                    </div>
                )}
                {passSuccess && !showChangePassword && (
                    <div className="bg-accent-bg border border-accent text-accent px-4 py-3 rounded-lg mb-4 text-sm">
                        ✓ {passSuccess}
                    </div>
                )}

                {/* INFORMACIÓN */}
                <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm text-text-medium">Nombre</span>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-text-dark">
                                {profile?.name}
                            </span>
                            <button
                                onClick={() => {
                                    setShowEditName(!showEditName);
                                    setShowChangePassword(false);
                                    setNameError('');
                                    setNameSuccess('');
                                }}
                                className="text-xs text-primary hover:text-primary-hover font-medium"
                            >
                                {showEditName ? 'Cancelar' : 'Editar'}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-sm text-text-medium">Email</span>
                        <span className="text-sm font-medium text-text-dark">
                            {profile?.email}
                        </span>
                    </div>

                    <div className="flex justify-between items-center py-2">
                        <span className="text-sm text-text-medium">Contraseña</span>
                        <button
                            onClick={() => {
                                setShowChangePassword(!showChangePassword);
                                setShowEditName(false);
                                setPassError('');
                                setPassSuccess('');
                            }}
                            className="text-xs text-primary hover:text-primary-hover font-medium"
                        >
                            {showChangePassword ? 'Cancelar' : 'Cambiar'}
                        </button>
                    </div>
                </div>
            </div>

            {/* FORMULARIO EDITAR NOMBRE */}
            {showEditName && (
                <div className="bg-white rounded-xl border border-border p-6 mb-4">
                    <h3 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-4">
                        Editar nombre
                    </h3>
                    {nameError && (
                        <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg mb-4 text-sm">
                            {nameError}
                        </div>
                    )}
                    <form onSubmit={handleNameSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Nuevo nombre
                            </label>
                            <input
                                type="text"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                                disabled={nameLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={nameLoading}
                            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
                        >
                            {nameLoading ? 'Guardando...' : 'Guardar nombre'}
                        </button>
                    </form>
                </div>
            )}

            {/* FORMULARIO CAMBIAR CONTRASEÑA */}
            {showChangePassword && (
                <div className="bg-white rounded-xl border border-border p-6 mb-4">
                    <h3 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-4">
                        Cambiar contraseña
                    </h3>
                    {passError && (
                        <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg mb-4 text-sm">
                            {passError}
                        </div>
                    )}
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Contraseña actual
                            </label>
                            <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                                placeholder="••••••••"
                                disabled={passLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Nueva contraseña
                            </label>
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                                placeholder="Mínimo 6 caracteres"
                                disabled={passLoading}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-dark mb-1">
                                Confirmar nueva contraseña
                            </label>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                                placeholder="Repite la nueva contraseña"
                                disabled={passLoading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={passLoading}
                            className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
                        >
                            {passLoading ? 'Guardando...' : 'Cambiar contraseña'}
                        </button>
                    </form>
                </div>
            )}

            {/* INFORMACIÓN DE LA CUENTA */}
            <div className="bg-white rounded-xl border border-border p-6">
                <h3 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-4">
                    Información de la cuenta
                </h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-start py-2 border-b border-border">
                        <span className="text-sm text-text-medium">ID de usuario</span>
                        <span className="text-sm font-medium text-text-dark">
                            #{profile?.id}
                        </span>
                    </div>
                    <div className="flex justify-between items-start py-2">
                        <span className="text-sm text-text-medium">Cuenta creada</span>
                        <span className="text-sm font-medium text-text-dark">
                            {formatDate(profile?.createdAt)}
                        </span>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default ProfilePage;