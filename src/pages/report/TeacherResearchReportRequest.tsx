import { CoautorForm } from "@/shared/components/forms/CoautorForm"
import { AddTeacherForm } from "@/shared/components/forms/AddTeacherForm";
import { FileUpload } from "@/shared/components/forms/FileUpload"
import { FormInput } from "@/shared/components/forms/FormInput"
import { InfoCheckbox } from "@/shared/components/forms/InfoCheckbox"
import Logo from "@/shared/ui/Logo"
import { AlertCircle, CheckCircle2, FileText, User, Users, Plus, Loader, X } from "lucide-react"
import { useState } from "react"
import { toastService } from "@/services/toastService";
import { API_URL } from "@/utils/api";

export default function TeacherResearchReportRequest() {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [checkboxes, setCheckboxes] = useState({
        agreement: false,
        format: false,
        errors: false,
        informed: false,
        truthful: false,
        funding: null as 'public' | 'self' | null
    })

    const [autorTeacher, setTeacher] = useState([1])
    const [teacherData, setTeacherData] = useState<any[]>([{}])

    const addAutorTeacher = () => {
        if (autorTeacher.length === 3) {
            toastService.error("Máximo tres autores por informe")
            return
        }
        setTeacher([...autorTeacher, autorTeacher.length + 1])
        setTeacherData([...teacherData, {}])
    }

    const removeAutorTeacher = (index: number) => {
        setTeacher(autorTeacher.filter((_, i) => i !== index))
        setTeacherData(teacherData.filter((_, i) => i !== index))
    }

    const updateTeacherData = (index: number, data: any) => {
        const newData = [...teacherData]
        newData[index] = data
        setTeacherData(newData)
    }

    const [coautor, setCoautor] = useState<number[]>([])
    const [coautorData, setCoautorData] = useState<any[]>([])

    const addCoautor = () => {
        if (coautor.length === 5) {
            toastService.error("Máximo cinco coautores por informe")
            return
        }
        setCoautor([...coautor, coautor.length + 1])
        setCoautorData([...coautorData, {}])
    }

    const removeCoautor = (index: number) => {
        setCoautor(coautor.filter((_, i) => i !== index))
        setCoautorData(coautorData.filter((_, i) => i !== index))
    }

    const updateCoautorData = (index: number, data: any) => {
        const newData = [...coautorData]
        newData[index] = data
        setCoautorData(newData)
    }

    const [projectTitle, setProjectTitle] = useState<string>("")
    const [files, setFiles] = useState({
        authorization: null as File | null,
        document: null as File | null,
        similarity: null as File | null,
        report: null as File | null
    })

    // Validar formulario antes de enviar
    const validateForm = (): boolean => {
        const errors: string[] = [];

        if (!projectTitle || projectTitle.trim().length < 5) {
            errors.push("El título del proyecto es requerido (mínimo 5 caracteres)");
        }

        if (!checkboxes.agreement || !checkboxes.format || !checkboxes.errors || !checkboxes.informed) {
            errors.push("Debe aceptar todos los términos requeridos");
        }

        if (!checkboxes.truthful) {
            errors.push("Debe declarar que la información es verídica");
        }

        if (!checkboxes.funding) {
            errors.push("Debe especificar el tipo de financiamiento");
        }

        if (teacherData.length === 0 || !teacherData[0].nombres || !teacherData[0].apellidos || !teacherData[0].dni) {
            errors.push("El primer autor debe tener nombres, apellidos y DNI completos");
        }

        if (!files.authorization) {
            errors.push("Debe adjuntar la hoja de autorización");
        }

        if (!files.document) {
            errors.push("Debe adjuntar el documento de investigación");
        }

        if (!files.report) {
            errors.push("Debe adjuntar el informe de investigación");
        }

        if (errors.length > 0) {
            errors.forEach(error => toastService.error(error));
            return false;
        }

        return true;
    }

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const formData = new FormData();

            formData.append('projectTitle', projectTitle);
            formData.append('checkboxes', JSON.stringify(checkboxes));
            formData.append('teachers', JSON.stringify(teacherData));
            formData.append('coauthors', JSON.stringify(coautorData));

            // Agregar archivos
            if (files.authorization) {
                formData.append('authorization', files.authorization);
            }
            if (files.document) {
                formData.append('document', files.document);
            }
            if (files.similarity) {
                formData.append('similarity', files.similarity);
            }
            if (files.report) {
                formData.append('report', files.report);
            }

            const response = await fetch(`${API_URL}/applications/teachers`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                setIsModalOpen(true);

                // Guardar ID para referencia
                const applicationId = result.data.applicationId;
                sessionStorage.setItem('lastApplicationId', applicationId);

                resetForm();

                // Redirigir después de 1.5 segundos
                /*setTimeout(() => {
                    window.location.href = `/dashboard?tab=pendientes&ref=${applicationId}`;
                }, 1500);*/
            } else {
                toastService.error(result.message || 'Error al enviar solicitud');
            }
        } catch (error) {
            console.error('Error:', error);
            toastService.error('Error de conexión al servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setProjectTitle("");
        setCheckboxes({
            agreement: false,
            format: false,
            errors: false,
            informed: false,
            truthful: false,
            funding: null
        });
        setTeacher([1]);
        setTeacherData([{}]);
        setCoautor([]);
        setCoautorData([]);
        setFiles({
            authorization: null,
            document: null,
            similarity: null,
            report: null
        });
    };

    return (
        <div className="min-h-screen w-full bg-linear-to-br from-gray-50 to-blue-50">
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                            aria-label="Cerrar"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-emerald-600 stroke-[3]" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-slate-900 text-center mb-4">
                            ¡Solicitud enviada con éxito!
                        </h2>

                        <p className="text-slate-500 text-center leading-relaxed mb-6">
                            Tu solicitud para publicar el informe de investigación ha sido enviada correctamente.
                            Recibirás una confirmación por correo electrónico y podrás hacer seguimiento de tu trámite en la plataforma.
                        </p>

                        <div className="flex gap-3 mb-3">
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    window.location.href = '/process';
                                }}
                                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                            >
                                Ir a seguimiento
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="flex-1 px-6 py-3 border font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
                                checked={checkboxes.agreement}
                                onChange={(e) => setCheckboxes({ ...checkboxes, agreement: e.target.checked })}
                            />
                            <InfoCheckbox
                                icon={FileText}
                                iconColor="blue"
                                text="He leído y ajustado el informe de investigación al formato oficial del reglamento de Investigación de la UNAMBA."
                                checkboxLabel="Sí, he ajustado"
                                checked={checkboxes.format}
                                onChange={(e) => setCheckboxes({ ...checkboxes, format: e.target.checked })}
                            />
                            <InfoCheckbox
                                icon={AlertCircle}
                                iconColor="red"
                                text={<>He leído los errores más comunes que se presentan a la hora de presentar los informes de investigación cuyo link está aquí: <a href="https://drive.google.com/file/d/1yUA2CEBWBsgf1o181WaqmomqtHwkiNEK/view" target="_blank" className="text-blue-600 hover:underline font-semibold">ERRORES RECURRENTES EN DIAGRAMACION.pdf</a></>}
                                checkboxLabel="Sí, he leído"
                                checked={checkboxes.errors}
                                onChange={(e) => setCheckboxes({ ...checkboxes, errors: e.target.checked })}
                            />
                            <InfoCheckbox
                                icon={CheckCircle2}
                                iconColor="green"
                                text="Estoy informado que el trámite es virtual, existe una página de seguimiento para ver mi trámite, que el procedimiento para otorgar la constancia es de 5 días hábiles."
                                checkboxLabel="Sí, estoy informado"
                                checked={checkboxes.informed}
                                onChange={(e) => setCheckboxes({ ...checkboxes, informed: e.target.checked })}
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
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md disabled:opacity-50"
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
                                        data={teacherData[index]}
                                        onChange={(data) => updateTeacherData(index, data)}
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
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md disabled:opacity-50"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar coautor
                                </button>
                            </div>
                            <div className="space-y-4">
                                {coautor.length === 0 ? (
                                    <p className="text-gray-500 text-sm italic">No hay coautores agregados. Haga clic en "Agregar coautor" si desea añadir uno.</p>
                                ) : (
                                    coautor.map((num, index) => (
                                        <CoautorForm
                                            key={index}
                                            number={num}
                                            onRemove={() => removeCoautor(index)}
                                            canRemove={true}
                                            data={coautorData[index]}
                                            onChange={(data) => updateCoautorData(index, data)}
                                        />
                                    ))
                                )}
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
                                    value={projectTitle}
                                    onChange={(e) => setProjectTitle(e.target.value)}
                                    disabled={isLoading}
                                />
                                <FileUpload
                                    label="Adjuntar hoja de autorización de publicación"
                                    sublabel="Debe estar escaneado en formato PDF (Apellidos Nombre Hoja.pdf) max 1 MB, firmado y con su huella digital."
                                    maxSize="1 MB"
                                    onChange={(file) => setFiles({ ...files, authorization: file })}
                                />
                                <FileUpload
                                    label="Adjuntar documento escaneado"
                                    sublabel="(constancia, carta de aceptación, carta de informe de investigacion favorable u otro) emitido por la Dirección de Institutos de Investigación (formato PDF)."
                                    maxSize="1 MB"
                                    onChange={(file) => setFiles({ ...files, document: file })}
                                />
                                <FileUpload
                                    label="Adjuntar reporte de similitud"
                                    sublabel="emitido por Turnitin, donde muestre título del informe, nombres y apellidos del primer autor (formato PDF)."
                                    maxSize="10 MB"
                                    onChange={(file) => setFiles({ ...files, similarity: file })}
                                />
                                <FileUpload
                                    label="Adjuntar Informe de investigacion"
                                    sublabel="con el mismo contenido presentado a la Dirección de Institutos de Investigación y que fue aceptado de forma favorable. Este documento será publicado en Repositorio DSpace (formato PDF)."
                                    maxSize="10 MB"
                                    onChange={(file) => setFiles({ ...files, report: file })}
                                />
                                <div className="space-y-4">
                                    <InfoCheckbox
                                        icon={AlertCircle}
                                        iconColor="amber"
                                        text="Declaro bajo juramento que toda esta información compartida en la solicitud es verídica."
                                        checkboxLabel="Sí, es información verídica"
                                        checked={checkboxes.truthful}
                                        onChange={(e) => setCheckboxes({ ...checkboxes, truthful: e.target.checked })}
                                    />

                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                                                <FileText className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-700 mb-3">
                                                    Declaro que este trabajo fue financiado con fondos públicos de la UNAMBA.
                                                </p>
                                                <div className="space-y-2">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="funding"
                                                            checked={checkboxes.funding === 'public'}
                                                            onChange={() => setCheckboxes({ ...checkboxes, funding: 'public' })}
                                                            className="w-4 h-4 text-blue-600"
                                                            disabled={isLoading}
                                                        />
                                                        <span className="text-sm text-gray-700">Sí, doy conformidad a esta afirmación.</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="radio"
                                                            name="funding"
                                                            checked={checkboxes.funding === 'self'}
                                                            onChange={() => setCheckboxes({ ...checkboxes, funding: 'self' })}
                                                            className="w-4 h-4 text-blue-600"
                                                            disabled={isLoading}
                                                        />
                                                        <span className="text-sm text-gray-700">No, es un trabajo de investigación autofinanciado.</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold py-4 px-8 rounded-xl text-sm transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {isLoading ? (
                                <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Enviar Solicitud
                                </>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={isLoading}
                            className="px-8 py-4 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-sm transition-all hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Limpiar Formulario
                        </button>
                    </div>
                </div>
            </main>
        </div>
    )
}
