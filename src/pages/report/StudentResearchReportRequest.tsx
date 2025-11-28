import { AsesorForm } from "@/shared/components/forms/AsesorForm"
import { AddStudentForm } from "@/shared/components/forms/AddStudentForm";
import { FileUpload } from "@/shared/components/forms/FileUpload"
import { FormInput } from "@/shared/components/forms/FormInput"
import { InfoCheckbox } from "@/shared/components/forms/InfoCheckbox"
import Logo from "@/shared/ui/Logo"
import { AlertCircle, CheckCircle2, FileText, User, Users, Plus } from "lucide-react"
import { useState } from "react"
import { toastService } from "@/services/toastService";
import { API_URL } from "@/utils/api";

export default function StudentResearchReportRequest() {

    const [checkboxes, setCheckboxes] = useState({
        agreement: false,
        format: false,
        errors: false,
        informed: false
    })

    const [student, setStudent] = useState([1])
    const [studentData, setStudentData] = useState<any[]>([{}])

    const addStudent = () => {
        if (student.length === 2) {
            toastService.error("Máximo dos estudiantes por informe")
            return
        }
        setStudent([...student, student.length + 1])
        setStudentData([...studentData, {}])
    }
    const removeStudent = (index) => {
        setStudent(student.filter((_, i) => i !== index))
        setStudentData(studentData.filter((_, i) => i !== index))
    }

    const updateStudentData = (index: number, data: any) => {
        const newData = [...studentData]
        newData[index] = data
        setStudentData(newData)
    }

    const [advisor, setAdvisor] = useState([1])
    const [advisorData, setAdvisorData] = useState<any[]>([{}])

    const addAdvisor = () => {
        if (advisor.length === 2) {
            toastService.error("Máximo dos asesores por informe")
            return
        }
        setAdvisor([...advisor, advisor.length + 1])
        setAdvisorData([...advisorData, {}])
    }

    const removeAdvisor = (index) => {
        setAdvisor(advisor.filter((_, i) => i !== index))
        setAdvisorData(advisorData.filter((_, i) => i !== index))
    }

    const updateAdvisorData = (index: number, data: any) => {
        const newData = [...advisorData]
        newData[index] = data
        setAdvisorData(newData)
    }

    const [jury, setJury] = useState([0, 1, 2])
    const [juryData, setJuryData] = useState<Array<{ firstName: string; lastName: string }>>([
        { firstName: "", lastName: "" },
        { firstName: "", lastName: "" },
        { firstName: "", lastName: "" }
    ])

    const addJury = () => {
        if (jury.length === 4) {
            toastService.error("Máximo cuatro jurados por informe")
            return
        }
        setJury([...jury, jury.length])
        setJuryData([...juryData, { firstName: "", lastName: "" }])
    }

    const removeLastJury = () => {
        if (jury.length > 3) {
            setJury(jury.slice(0, -1))
            setJuryData(juryData.slice(0, -1))
        }
    }

    const updateJuryData = (index: number, data: { firstName: string; lastName: string }) => {
        const newData = [...juryData]
        newData[index] = data
        setJuryData(newData)
    }

    const [projectTitle, setProjectTitle] = useState<string>("")
    const [files, setFiles] = useState({
        authorization: null,
        certificate: null,
        thesis: null,
        originality: null
    })

    const handleSubmit = async () => {
        try {
            const formData = new FormData();


            formData.append('projectTitle', projectTitle);
            formData.append('checkboxes', JSON.stringify(checkboxes));
            formData.append('students', JSON.stringify(studentData));
            formData.append('advisors', JSON.stringify(advisorData));
            formData.append('jury', JSON.stringify(juryData));

            if (files.authorization) {
                formData.append('authorization', files.authorization);
            }
            if (files.certificate) {
                formData.append('certificate', files.certificate);
            }
            if (files.thesis) {
                formData.append('thesis', files.thesis);
            }
            if (files.originality) {
                formData.append('originality', files.originality);
            }

            const response = await fetch(`${API_URL}/applications/students`, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                toastService.success('Solicitud enviada exitosamente');
                resetForm();
            } else {
                toastService.error(result.message || 'Error al enviar solicitud');
            }
        } catch (error) {
            console.error('Error:', error);
            toastService.error('Error de conexión al servidor');
        }
    };

    const resetForm = () => {

        setProjectTitle("");

        setCheckboxes({
            agreement: false,
            format: false,
            errors: false,
            informed: false
        });

        setStudentData([
            { nombres: "", apellidos: "", telefono: "", dni: "", escuela: "" }
        ]);

        setAdvisorData([
            { nombre: "", dni: "", orcid: "" }
        ]);


        setFiles({
            authorization: null,
            certificate: null,
            thesis: null,
            originality: null
        });

    };


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
                        <p className="text-sm text-gray-500 font-medium">Tesis</p>
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
                                    onClick={addStudent}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar autor
                                </button>
                            </div>
                            <div className="space-y-4">
                                {student.map((num, index) => (
                                    <AddStudentForm
                                        key={index}
                                        number={num}
                                        onRemove={() => removeStudent(index)}
                                        canRemove={student.length > 1}
                                        data={studentData[index]}
                                        onChange={(data) => updateStudentData(index, data)}
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
                                    Asesores
                                </h3>
                                <button
                                    type="button"
                                    onClick={addAdvisor}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar asesor
                                </button>
                            </div>
                            <div className="space-y-4">
                                {advisor.map((num, index) => (
                                    <AsesorForm
                                        key={index}
                                        number={num}
                                        onRemove={() => removeAdvisor(index)}
                                        canRemove={advisor.length > 1}
                                        data={advisorData[index]}
                                        onChange={(data) => updateAdvisorData(index, data)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="border-2 border-gray-200 rounded-xl p-6 space-y-4 bg-linear-to-br from-gray-50 to-white hover:border-blue-300 transition-all">
                            <div className="flex items-center justify-between">
                                <h3 className="text-base font-semibold text-gray-800 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-blue-600" />
                                    </div>
                                    Sobre los jurados
                                </h3>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-6">
                                    {jury.map((index) => (
                                        <div key={index} className="flex items-start gap-2 col-span-2">
                                            <div className="grid grid-cols-2 gap-4 flex-1">
                                                <FormInput
                                                    icon={User}
                                                    label={`Nombre del ${index === 0 ? 'presidente' : index === 1 ? 'primer miembro' : index === 2 ? 'segundo miembro' : 'tercer miembro'}`}
                                                    sublabel ="(En mayúsculas y minúsculas según corresponda)"
                                                    type="text"
                                                    placeholder="Ejem: Luis"
                                                    value={juryData[index]?.firstName || ''}
                                                    onChange={(e) => updateJuryData(index, { ...juryData[index], firstName: e.target.value })}
                                                />
                                                <FormInput
                                                    icon={User}
                                                    label={`Apellido del ${index === 0 ? 'presidente' : index === 1 ? 'primer miembro' : index === 2 ? 'segundo miembro' : 'tercer miembro'}`}
                                                    sublabel ="(En mayúsculas y minúsculas según corresponda)"
                                                    type="text"
                                                    placeholder="Ejem: Robles"
                                                    value={juryData[index]?.lastName || ''}
                                                    onChange={(e) => updateJuryData(index, { ...juryData[index], lastName: e.target.value })}
                                                />
                                            </div>
                                            {jury.length > 3 && index === jury.length - 1 && (
                                                <button
                                                    type="button"
                                                    onClick={removeLastJury}
                                                    className="mt-8 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                                    title="Eliminar último jurado"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {jury.length < 4 && (
                                    <button
                                        type="button"
                                        onClick={addJury}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Agregar jurado excepcional
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="border-t-2 border-gray-100 pt-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-blue-600" />
                                </div>
                                Información del proyecto
                            </h3>

                            <div className="space-y-6">
                                <FormInput
                                    icon={FileText}
                                    label="Nombre del Proyecto tesis/Trabajo de investigación"
                                    type="text"
                                    placeholder="Ingrese el título completo"
                                    value={projectTitle}
                                    onChange={(e) => setProjectTitle(e.target.value)}
                                />
                                <FileUpload
                                    label="Hoja de autorización de publicación escaneado en formato PDF (Apellidos Nombre Hoja.pdf max 1 MB, firmado y con su huella digital)"
                                    maxSize="1 MB"
                                    onChange={(file) => setFiles({ ...files, authorization: file })}
                                />
                                <FileUpload
                                    label="Constancia de entrega de empastados otorgado por la Unidad de Investigación de su Facultad (Apellidos Nombres Acta.pdf) max 1 MB"
                                    maxSize="1 MB"
                                    onChange={(file) => setFiles({ ...files, certificate: file })}
                                />
                                <FileUpload
                                    label="Tesis con el mismo contenido presentado en Unidad de Investigación (apellidos Nombre Tesis.pdf), TAMAÑO A4 y máximo 10 Mb"
                                    maxSize="10 MB"
                                    onChange={(file) => setFiles({ ...files, thesis: file })}
                                />
                                <FileUpload
                                    label="Constancia de originalidad de su Tesis otorgado por la Unidad de Investigación de su Facultad (apellidos Nombre Constancia.pdf), TAMAÑO A4 y máximo 1 Mb"
                                    maxSize="1 MB"
                                    onChange={(file) => setFiles({ ...files, originality: file })}
                                />
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
                </div>
            </main>
        </div>
    )
}
