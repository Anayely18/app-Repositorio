import { ArrowLeft, Eye, EyeOff, KeyRound, LockKeyhole, Mail } from "lucide-react";
import { useState } from "react";

export default function ForgotPasswordForm({
    formData,
    errors,
    isLoading,
    step,
    onInputChange,
    onRequestCode,
    onVerifyCode,
    onResetPassword,
    onBack
}) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleShowPassword = () => setShowPassword(!showPassword);
    const handleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSubmitStep1 = (e) => {
        e.preventDefault();
        onRequestCode(e);
    };

    const handleSubmitStep2 = (e) => {
        e.preventDefault();
        onVerifyCode(e);
    };

    const handleSubmitStep3 = (e) => {
        e.preventDefault();
        onResetPassword(e);
    };

    return (
        <div className="flex flex-col gap-y-4 w-full items-center justify-center min-h-screen">
            <div className="space-y-6 max-w-md w-full">
                <div>
                    <h2 className="text-center text-secondary font-medium text-2xl">
                        Recuperar Contraseña
                    </h2>
                    <span className="text-center text-xs block mt-2">
                        {step === 1 && "Ingresa tu correo electrónico para recibir el código de verificación"}
                        {step === 2 && "Ingresa el código de 6 dígitos que enviamos a tu correo"}
                        {step === 3 && "Ingresa tu nueva contraseña"}
                    </span>
                </div>

                <div className="flex justify-center items-center gap-2">
                    {[1, 2, 3].map((s) => (
                        <div
                            key={s}
                            className={`h-2 rounded-full transition-all ${s === step
                                    ? 'w-8 bg-secondary'
                                    : s < step
                                        ? 'w-2 bg-secondary/50'
                                        : 'w-2 bg-gray-300'
                                }`}
                        />
                    ))}
                </div>

                {step === 1 && (
                    <div className="w-full mt-8">
                        <div className="flex flex-col items-start gap-y-4 w-full">
                            <div className="flex flex-col gap-y-1 w-full">
                                <label
                                    htmlFor="email"
                                    className="text-xs flex items-center gap-2 font-medium"
                                >
                                    <Mail size={14} className="text-secondary" />
                                    <span>Correo Electrónico</span>
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={onInputChange}
                                    placeholder="tu_correo@ejemplo.com"
                                    className={`border w-full py-2 px-4 rounded outline-none text-xs ${errors.email ? 'border-red-500' : 'border-secondary'
                                        }`}
                                    disabled={isLoading}
                                    autoFocus
                                />
                                {errors.email && (
                                    <span className="text-xs text-red-500 mt-1">
                                        {errors.email}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={handleSubmitStep1}
                                disabled={isLoading}
                                className="bg-secondary hover:bg-secondary/95 mt-4 hover:-translate-y-1 transition-all duration-500 font-medium text-white rounded py-2 w-full cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {isLoading ? "Enviando código..." : "Enviar código"}
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="w-full mt-8">
                        <div className="flex flex-col items-start gap-y-4 w-full">
                            <div className="flex flex-col gap-y-1 w-full">
                                <label
                                    className="text-xs flex items-center gap-2 font-medium justify-center mb-3"
                                >
                                    <KeyRound size={14} className="text-secondary" />
                                    <span>Código de Verificación</span>
                                </label>
                                <div className="flex gap-2 justify-center">
                                    {[0, 1, 2, 3, 4, 5].map((index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength={1}
                                            value={formData.code[index] || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (value.match(/^[0-9]$/)) {
                                                    const newCode = formData.code.split('');
                                                    newCode[index] = value;
                                                    onInputChange({
                                                        target: {
                                                            name: 'code',
                                                            value: newCode.join('')
                                                        }
                                                    });
                                                    if (e.target.nextElementSibling) {
                                                        e.target.nextElementSibling.focus();
                                                    }
                                                } else if (value === '') {
                                                    const newCode = formData.code.split('');
                                                    newCode[index] = '';
                                                    onInputChange({
                                                        target: {
                                                            name: 'code',
                                                            value: newCode.join('')
                                                        }
                                                    });
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Backspace' && !formData.code[index] && e.target.previousElementSibling) {
                                                    e.target.previousElementSibling.focus();
                                                }
                                            }}
                                            className={`border w-12 h-12 text-center text-lg font-mono rounded outline-none ${errors.code ? 'border-red-500' : 'border-secondary'
                                                } focus:ring-2 focus:ring-secondary`}
                                            disabled={isLoading}
                                            autoFocus={index === 0}
                                        />
                                    ))}
                                </div>
                                {errors.code && (
                                    <span className="text-xs text-red-500 mt-2 text-center w-full block">
                                        {errors.code}
                                    </span>
                                )}
                                <span className="text-xs text-gray-500 mt-2 text-center w-full block">
                                    El código expira en 10 minutos
                                </span>
                            </div>

                            <div className="flex justify-center w-full">
                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="text-xs text-secondary hover:underline transition-all flex items-center gap-1"
                                >
                                    <ArrowLeft size={12} />
                                    Cambiar correo
                                </button>
                            </div>

                            <button
                                onClick={handleSubmitStep2}
                                disabled={isLoading}
                                className="bg-secondary hover:bg-secondary/95 mt-4 hover:-translate-y-1 transition-all duration-500 font-medium text-white rounded py-2 w-full cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {isLoading ? "Verificando..." : "Verificar código"}
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="w-full mt-8">
                        <div className="flex flex-col items-start gap-y-4 w-full">
                            <div className="flex flex-col gap-y-1 w-full">
                                <label
                                    htmlFor="newPassword"
                                    className="text-xs flex items-center gap-2 font-medium"
                                >
                                    <LockKeyhole size={14} className="text-secondary" />
                                    <span>Nueva Contraseña</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="newPassword"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={onInputChange}
                                        className={`border w-full py-2 pl-4 pr-8 rounded outline-none text-xs ${errors.newPassword ? 'border-red-500' : 'border-secondary'
                                            }`}
                                        disabled={isLoading}
                                        autoFocus
                                    />
                                    {showPassword ? (
                                        <EyeOff
                                            className="absolute top-2 right-2 cursor-pointer text-secondary"
                                            size={16}
                                            onClick={handleShowPassword}
                                        />
                                    ) : (
                                        <Eye
                                            className="absolute top-2 right-2 cursor-pointer text-secondary"
                                            size={16}
                                            onClick={handleShowPassword}
                                        />
                                    )}
                                </div>
                                {errors.newPassword && (
                                    <span className="text-xs text-red-500 mt-1">
                                        {errors.newPassword}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-col gap-y-1 w-full">
                                <label
                                    htmlFor="confirmPassword"
                                    className="text-xs flex items-center gap-2 font-medium"
                                >
                                    <LockKeyhole size={14} className="text-secondary" />
                                    <span>Confirmar Contraseña</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={onInputChange}
                                        className={`border w-full py-2 pl-4 pr-8 rounded outline-none text-xs ${errors.confirmPassword ? 'border-red-500' : 'border-secondary'
                                            }`}
                                        disabled={isLoading}
                                    />
                                    {showConfirmPassword ? (
                                        <EyeOff
                                            className="absolute top-2 right-2 cursor-pointer text-secondary"
                                            size={16}
                                            onClick={handleShowConfirmPassword}
                                        />
                                    ) : (
                                        <Eye
                                            className="absolute top-2 right-2 cursor-pointer text-secondary"
                                            size={16}
                                            onClick={handleShowConfirmPassword}
                                        />
                                    )}
                                </div>
                                {errors.confirmPassword && (
                                    <span className="text-xs text-red-500 mt-1">
                                        {errors.confirmPassword}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={handleSubmitStep3}
                                disabled={isLoading}
                                className="bg-secondary hover:bg-secondary/95 mt-4 hover:-translate-y-1 transition-all duration-500 font-medium text-white rounded py-2 w-full cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {isLoading ? "Actualizando..." : "Cambiar contraseña"}
                            </button>
                        </div>
                    </div>
                )}

                <span className="block text-center text-xs">
                    ¿Recordaste tu contraseña?
                    <button
                        onClick={() => window.location.href = "/login"}
                        className="text-secondary underline ml-1 cursor-pointer"
                    >
                        Inicia sesión
                    </button>
                </span>
            </div>
        </div>
    );
};