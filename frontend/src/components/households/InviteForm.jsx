import { useState} from "react";
import invitationService from "../../services/invitationService";
import { useAuth } from "../../hooks/useAuth.js";

// Roles que se ofrecen al invitar a alguien
const ROLE_OPTIONS = [
    {value: 'ADMIN', label: 'Administrador'},
    {value: 'MEMBER', label: 'Miembro'},
];

function InviteForm({ householdId, onInviteSent }) {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        invitedUserEmail: '',
        roleOffered: 'MEMBER',
        message: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación básica del email
        if (!formData.invitedUserEmail.trim()) {
            setError('El email del usuario es obligatorio');
            return;
        }

        // Validación del formato email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.invitedUserEmail)) {
            setError('El email no tiene un formato válido');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSuccess('');

            await invitationService.inviteUser(householdId, user.id, {
                invitedUserEmail: formData.invitedUserEmail.trim(),
                roleOffered: formData.invitedUserEmail,
                message: formData.message.trim() || null,
            });

            // Mensake de éxito
            setSuccess(`Invitación enviada a ${formData.invitedUserEmail}`);

            setFormData({
                invitedUserEmail: '',
                roleOffered: 'MEMBER',
                message: '',
            });

            if (onInviteSent) onInviteSent();
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data || 'Error al enviar la invitación.';
            setError(typeof msg === 'string' ? msg : 'Error al enviar la invitación.');
            console.error('Error completo:', err.response?.data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-sm font-semibold text-text-light uppercase tracking-wide mb-4">
                Invitar usuario
            </h2>

            {/* MENSAJE DE ÉXITO */}
            {success && (
                <div className="bg-accent-bg border border-accent text-accent px-4 py-3 rounded-lg mb-4 text-sm">
                    ✓ {success}
                </div>
            )}

            {/* MENSAJE DE ERROR */}
            {error && (
                <div className="bg-primary-bg border border-border-dark text-primary px-4 py-3 rounded-lg mb-4 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* EMAIL */}
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                        Email del usuario <span className="text-primary">*</span>
                    </label>
                    <input
                        type="email"
                        name="invitedUserEmail"
                        value={formData.invitedUserEmail}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light"
                        placeholder="email@ejemplo.com"
                        disabled={loading}
                    />
                </div>

                {/* ROL OFRECIDO */}
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                        Rol
                    </label>
                    <select
                        name="roleOffered"
                        value={formData.roleOffered}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark"
                        disabled={loading}
                    >
                        {ROLE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* MENSAJE OPCIONAL */}
                <div>
                    <label className="block text-sm font-medium text-text-dark mb-1">
                        Mensaje
                        <span className="text-text-light font-normal ml-1">(opcional)</span>
                    </label>
                    <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-dark placeholder:text-text-light resize-none"
                        placeholder="Añade un mensaje personal a la invitación..."
                        rows={2}
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Enviando...' : 'Enviar invitación'}
                </button>

            </form>
        </div>
    );
}

export default InviteForm;