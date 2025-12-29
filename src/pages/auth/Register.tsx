import { useRegister } from "@/hooks/useRegister";
import RegisterForm from "@/shared/components/auth/RegisterForm";
import Logo from "@/shared/ui/Logo";


export default function Register() {
    const { 
        formData, 
        errors, 
        isLoading, 
        handleInputChange, 
        handleSubmit 
    } = useRegister();

    return (
        <div className="bg-primary h-svh w-full overflow-hidden">
            <main className="grid grid-cols-1 md:grid-cols-2 h-svh">
                <div className="hidden md:flex items-center h-full bg-secondary">
                    <img src="assets/img/registro.svg" alt="" className="h-90 object-contain m-auto w-auto" />
                </div>
                <div className="flex flex-col items-start relative overflow-y-auto md:overflow-y-hidden overflow-x-hidden">
                    <Logo />
                    <div className="hidden md:block h-50 w-50 absolute bg-secondary rounded-full -right-25 -bottom-25"></div>
                    <RegisterForm 
                        formData={formData}
                        errors={errors}
                        isLoading={isLoading}
                        onInputChange={handleInputChange}
                        onSubmit={handleSubmit}
                    />
                </div>
            </main>
        </div>
    );
};