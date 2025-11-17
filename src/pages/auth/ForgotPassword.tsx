import { useForgotPassword } from "@/hooks/useForgotPassword";
import ForgotPasswordForm from "@/shared/components/auth/ForgotPasswordForm";
import Logo from "@/shared/ui/Logo";

export default function ForgotPassword() {
    const {
        formData,
        errors,
        isLoading,
        step,
        handleInputChange,
        handleRequestCode,
        handleVerifyCode,
        handleResetPassword,
        handleBack
    } = useForgotPassword();

    return (
        <div className="bg-primary h-svh w-full overflow-hidden">
            <main className="h-svh">
                <header className="flex items-center justify-start bg-secondary h-16">
                    <Logo />
                </header>
                <div className="flex items-center relative justify-center h-[calc(100svh-10rem)] p-4 md:p-0">
                    <div className="h-50 w-50 absolute bg-secondary rounded-full -left-25 -bottom-50"></div>
                    <div className="h-50 w-50 absolute bg-secondary rounded-full -right-25 -bottom-50"></div>
                    <ForgotPasswordForm
                        formData={formData}
                        errors={errors}
                        isLoading={isLoading}
                        step={step}
                        onInputChange={handleInputChange}
                        onRequestCode={handleRequestCode}
                        onVerifyCode={handleVerifyCode}
                        onResetPassword={handleResetPassword}
                        onBack={handleBack}
                    />
                </div>
            </main>
        </div>
    );
};