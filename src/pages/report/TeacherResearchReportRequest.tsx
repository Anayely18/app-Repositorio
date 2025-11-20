import { CoautorForm } from "@/shared/components/forms/CoautorForm"
import { AddTeacherForm } from "@/shared/components/forms/AddTeacherForm";
import { FileUpload } from "@/shared/components/forms/FileUpload"
import { FormInput } from "@/shared/components/forms/FormInput"
import { InfoCheckbox } from "@/shared/components/forms/InfoCheckbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Logo from "@/shared/ui/Logo"
import { AlertCircle, Building2, CheckCircle2, CreditCard, FileText, Mail, Phone, User, Users, Plus } from "lucide-react"
import { useState } from "react"
export default function TeacherResearchReportRequest() {
    const [autorTeacher, setTeacher] = useState([1])

    const addAutorTeacher = () => {
        setTeacher([...autorTeacher, autorTeacher.length + 1])
    }

    const removeAutorTeacher = (index) => {
        setTeacher(autorTeacher.filter((_, i) => i !== index))
    }
    const [coautor, setCoautor] = useState([1])

    const addCoautor = () => {
        setCoautor([...coautor, coautor.length + 1])
    }

    const removeCoautor = (index) => {
        setCoautor(coautor.filter((_, i) => i !== index))
    }

    const handleSubmit = () => {
        alert('Formulario enviado!')
    }

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-gray-50 to-blue-50">
            <div className="h-16 bg-secondary shadow-lg flex items-center px-6">
                <Logo />
            </div>
            <main className="max-w-5xl mx-auto p-6 md:p-8">
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
                    <div className="text-center mb-10 pb-6 border-b-2 border-gray-100">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                            Solicitud para publicar informe de investigación
                        </h2>
                        <p className="text-sm text-gray-500 font-medium">Docente</p>
                    </div>
                    <div className="space-y-8">

                        <div className="space-y-4">
                            <InfoCheckbox
                                icon={AlertCircle}
                                iconColor="amber"
                                text={<>
                                    No es función de la unidad de repositorio revisar en todo su extremo el informe de investigación, esa es responsabilidad de usted, equipo de trabajo, revisores o la Dirección de Institutos de Investigación. Sin embargo, a pesar de estos filtros a la fecha existen trabajos rechazados. Esta oficina verifica aleatoriamente el formato o esquema, caso no esté bien será rechazado y si reincide se aplica el <a href="https://drive.google.com/file/d/1FNXxEnW_zWmuuFhHJ7tW2AqECUwekjBc/view" target="_blank" className="text-blue-600 hover:underline font-semibold">reglamento</a>.</>}
                                checkboxLabel="Sí, estoy de acuerdo"
                            />
                            <InfoCheckbox
                                icon={FileText}
                                iconColor="blue"
                                text="He leído y ajustado el informe de investigación al formato oficial del reglamento de Investigación de la UNAMBA."
                                checkboxLabel="Sí, he ajustado"
                            />
                            <InfoCheckbox
                                icon={AlertCircle}
                                iconColor="red"
                                text={<>He leído los errores más comunes que se presentan a la hora de presentar los informes de investigación cuyo link está aquí: <a href="https://drive.google.com/file/d/1yUA2CEBWBsgf1o181WaqmomqtHwkiNEK/view" target="_blank" className="text-blue-600 hover:underline font-semibold">ERRORES RECURRENTES EN DIAGRAMACION.pdf</a></>}
                                checkboxLabel="Sí, he leído"
                            />
                            <InfoCheckbox
                                icon={CheckCircle2}
                                iconColor="green"
                                text="Estoy informado que el trámite es virtual, existe una página de seguimiento para ver mi trámite, que el procedimiento para otorgar la constancia es de 5 días hábiles."
                                checkboxLabel="Sí, estoy informado"
                            />
                        </div>

                        <div className="border-t-2 border-gray-100 pt-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    Información personal
                                </h3>
                                <button
                                    type="button"
                                    onClick={addAutorTeacher}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar autor
                                </button>
                            </div>

                            <div className="space-y-4">
                                {autorTeacher.map((num, index) => (
                                    <AddTeacherForm
                                        key={index}
                                        number={num}
                                        onRemove={() => removeAutorTeacher(index)}
                                        canRemove={autorTeacher.length > 1}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="border-t-2 border-gray-100 pt-8">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-blue-600" />
                                    </div>
                                    Co-autores
                                </h3>
                                <button
                                    type="button"
                                    onClick={addCoautor}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar coautor
                                </button>
                            </div>
                            <div className="space-y-4">
                                {coautor.map((num, index) => (
                                    <CoautorForm
                                        key={index}
                                        number={num}
                                        onRemove={() => removeCoautor(index)}
                                        canRemove={coautor.length > 1}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="border-t-2 border-gray-100 pt-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                Requisitos importantes
                            </h3>

                            <div className="space-y-6">
                                <FormInput
                                    icon={FileText}
                                    label="Titulo del informe final de investigación"
                                    type="text"
                                    placeholder="Ingrese el título completo"
                                />
                                <FileUpload
                                    label="Adjuntar hoja de autorización de publicación"
                                    sublabel="Dbe estar escaneado en formato PDF (Apellidos Nombre Hoja.pdf) max 1 MB, firmado y con su huella digital."
                                    maxSize="1 MB"
                                />
                                <FileUpload
                                    label="Adjuntar documento escaneado"
                                    sublabel="(constancia, carta de aceptación, carta de informe de investigacion favorable u otro) emitido por la Dirección de Institutos de Investigación (formato PDF)."
                                    maxSize="1 MB"
                                />
                                <FileUpload
                                    label="Adjuntar reporte de similitud"
                                    sublabel="emitido por Turnitin, donde muestre título del informe, nombres y apellidos del primer autor (formato PDF)."
                                    maxSize="10 MB"
                                />
                                <FileUpload
                                    label="Adjuntar Informe  de investigacion"
                                    sublabel="con el mismo contenido presentado a la Dirección de Institutos de Investigación y que fue aceptado de forma favorable. Este documento será publicado en Repositorio DSpace (formato PDF)."
                                    maxSize="1 MB"
                                />
                                <div className="space-y-4">
                                    <InfoCheckbox
                                        icon={AlertCircle}
                                        iconColor="amber"
                                        text={<>
                                            Declaro bajo juramento que toda esta información compartida en la solicitud es verídica.</>}
                                        checkboxLabel="Sí, es informacion veridica"
                                    />
                                    <InfoCheckbox
                                        icon={FileText}
                                        iconColor="green"
                                        text="Declaro que este trabajo fue financiado con fondos públicos de la UNAMBA."
                                        checkboxLabel="Si, doy conformidad a esta afirmación."
                                        checkboxLabel2="No, es un trabajo de investigación autofinanciado."
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <button
                            onClick={handleSubmit}
                            className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-8 rounded-xl text-sm transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <CheckCircle2 className="w-5 h-5" />
                            Enviar Solicitud
                        </button>
                        <button
                            type="button"
                            className="px-8 py-4 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-sm transition-all hover:border-gray-400"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </main >
        </div >
    )
}