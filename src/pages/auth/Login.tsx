import { useLogin } from "@/hooks/useLogin";
import LoginForm from "@/shared/components/auth/LoginForm";
import Logo from "@/shared/ui/Logo";


export default function Login() {
    const {
        formData,
        errors,
        isLoading,
        handleInputChange,
        handleSubmit
    } = useLogin();

    return (
        <div className="bg-primary h-svh w-full overflow-hidden">
            <main className="grid grid-cols-1 md:grid-cols-2 h-svh">
                <div className="flex flex-col items-start relative">
                    <Logo />
                    <div className="h-50 w-50 absolute bg-secondary rounded-full -left-25 -bottom-25"></div>
                    <div className="md:hidden h-50 w-50 absolute bg-secondary rounded-full -right-25 -bottom-25"></div>
                    <LoginForm
                        formData={formData}
                        errors={errors}
                        isLoading={isLoading}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                    />
                </div>
                <div className="hidden md:flex items-center h-full bg-secondary">
                    
                    <img src="assets/img/login.svg" alt="" className="h-90 object-contain m-auto w-auto" />
                </div>
            </main>
        </div>
    );
};