import { AsesorForm } from "@/shared/components/forms/AsesorForm"
import { AddStudentForm } from "@/shared/components/forms/AddStudentForm";
import { FileUpload } from "@/shared/components/forms/FileUpload"
import { FormInput } from "@/shared/components/forms/FormInput"
import { InfoCheckbox } from "@/shared/components/forms/InfoCheckbox"
import Logo from "@/shared/ui/Logo"
import { AlertCircle, CheckCircle2, FileText, User, Users, Plus, X, IdCard, ArrowLeft } from "lucide-react"
import { Link,useNavigate } from "react-router-dom"
import { useState, useRef } from "react"
import { useEffect } from "react"
import { API_URL } from "@/utils/api";
export default function StudentResearchReportRequest() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [checkboxes, setCheckboxes] = useState({
        agreement: false,
        format: false,
        errors: false,
        informed: false
    })

    useEffect(() => {
        return () => {
            Object.values(juryTimers.current).forEach((t) => t && window.clearTimeout(t));
            Object.values(juryAbort.current).forEach((c) => c && c.abort());
        };
    }, []);

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
            toastService.error("Máximo dos asesores por tesis")
            return
        }
        setAdvisor([...advisor, advisor.length + 1])
        setAdvisorData([...advisorData, {}])
    }

    const advisorsPayload = advisorData.map((a) => {
        const fullName = [a?.nombre, a?.apellido].filter(Boolean).join(" ").trim();

        return {
            full_name: fullName,
            nombre: fullName,
            dni: a?.dni ?? "",
            orcid: a?.orcid ?? "",
        };
    });


    const removeAdvisor = (index) => {
        setAdvisor(advisor.filter((_, i) => i !== index))
        setAdvisorData(advisorData.filter((_, i) => i !== index))
    }

    const updateAdvisorData = (index: number, data: any) => {
        const newData = [...advisorData]
        newData[index] = data
        setAdvisorData(newData)
    }
    const juryFlashTimers = useRef<Record<number, number | null>>({});
    const [jury, setJury] = useState([0, 1, 2])
    const [juryData, setJuryData] = useState<Array<{ dnijury: string; firstName: string; lastName: string }>>([
        { dnijury: "", firstName: "", lastName: "" },
        { dnijury: "", firstName: "", lastName: "" },
        { dnijury: "", firstName: "", lastName: "" },
    ]);



    const addJury = () => {
        if (jury.length === 4) {
            toastService.error("Máximo cuatro jurados por informe")
            return
        }
        setJury([...jury, jury.length])
        setJuryData([...juryData, { dnijury: "", firstName: "", lastName: "" }])
        setJuryLookupMsg((prev) => [...prev, ""]);
        setJuryTypingErr((prev) => [...prev, ""]);

    }

    const removeLastJury = () => {
        if (jury.length > 3) {
            setJury(jury.slice(0, -1))
            setJuryData(juryData.slice(0, -1))
            setJuryLookupMsg((prev) => prev.slice(0, -1));
            setJuryTypingErr((prev) => prev.slice(0, -1));

        }
    }

    const updateJuryData = (index: number, data: { dnijury: string; firstName: string; lastName: string }) => {
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

    const [showValidation, setShowValidation] = useState(false);

    const [formErrors, setFormErrors] = useState<{
        checkboxes?: string;
        projectTitle?: string;
        files?: Partial<Record<"authorization" | "certificate" | "thesis" | "originality", string>>;
        jury?: Array<Partial<Record<"dnijury" | "firstName" | "lastName", string>>>;
    }>({
        files: {},
        jury: [],
    });


    const [juryLookupMsg, setJuryLookupMsg] = useState<string[]>(["", "", "", ""]);

    const [juryTypingErr, setJuryTypingErr] = useState<string[]>(["", "", "", ""]);
    const [juryNameErr, setJuryNameErr] = useState<string[]>(["", "", "", ""]);
    const [juryLastErr, setJuryLastErr] = useState<string[]>(["", "", "", ""]);

    const flashJuryMsg = (index: number, msg: string) => {
        setJuryLookupMsg((prev) => {
            const copy = [...prev];
            copy[index] = msg;
            return copy;
        });

        if (juryFlashTimers.current[index]) {
            window.clearTimeout(juryFlashTimers.current[index]!);
        }

        juryFlashTimers.current[index] = window.setTimeout(() => {
            setJuryLookupMsg((prev) => {
                const copy = [...prev];
                copy[index] = "";
                return copy;
            });
        }, 20000);
    };
    const onlyLetters = (v: string) =>
        String(v ?? "")
            .replace(/[^a-zA-ZÀ-ÿÑñ\s'-]/g, "")
            .replace(/\s+/g, " ")
            .trimStart();

    const clearJuryError = (index: number, key: "dnijury" | "firstName" | "lastName") => {
        setFormErrors((prev) => {
            const copy = {
                ...prev,
                jury: Array.isArray(prev?.jury) ? [...prev.jury] : [],
            };

            copy.jury[index] = { ...(copy.jury[index] ?? {}) };
            delete (copy.jury[index] as any)[key];

            return copy;
        });
    };
    const clearCheckboxErrorIfOk = (next: typeof checkboxes) => {
        setFormErrors((prev) => ({
            ...prev,
            checkboxes: next.agreement && next.format && next.errors && next.informed
                ? ""
                : prev.checkboxes,
        }));
    };



    const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
    const onlyDigitsLocal = (v: string, max: number) => String(v ?? "").replace(/\D/g, "").slice(0, max);

    const validateStudent = (s: any) => {
        const codigo = (s?.codigo ?? "").trim();
        const dni = (s?.dni ?? "").trim();
        const nombres = (s?.nombres ?? "").trim();
        const apellidos = (s?.apellidos ?? "").trim();
        const telefono = (s?.telefono ?? "").trim();
        const escuela = (s?.escuela ?? "").trim();
        const email = (s?.email ?? "").trim();

        if (!/^\d{6}$/.test(codigo)) return false;
        if (!/^\d{8}$/.test(dni)) return false;
        if (nombres.length < 2) return false;
        if (apellidos.length < 2) return false;
        if (!/^\d{9}$/.test(telefono)) return false;
        if (!escuela) return false;
        if (!isEmail(email)) return false;

        return true;
    };

    const validateAdvisor = (a: any) => {
        const dni = (a?.dni ?? "").trim();
        const nombre = (a?.nombre ?? "").trim();
        const apellido = (a?.apellido ?? "").trim();
        const orcid = (a?.orcid ?? "").trim();

        if (!/^\d{8}$/.test(dni)) return false;
        if (nombre.length < 2) return false;
        if (apellido.length < 2) return false;

        if (orcid) {
            const re = /^(https?:\/\/orcid\.org\/)?\d{4}-\d{4}-\d{4}-\d{3}(\d|X)$/i;
            if (!re.test(orcid)) return false;
        }

        return true;
    };

    const validateJuryAll = () => {
        const errs: Array<Partial<Record<"dnijury" | "firstName" | "lastName", string>>> = [];

        for (let i = 0; i < jury.length; i++) {
            const j = juryData[i] ?? { dnijury: "", firstName: "", lastName: "" };

            const required = i < 3;
            const anyFilled = !!(j.dnijury || j.firstName || j.lastName);

            if (!required && !anyFilled) {
                errs[i] = {};
                continue;
            }

            const e: any = {};

            if (!/^\d{8}$/.test((j.dnijury ?? "").trim())) e.dnijury = "DNI obligatorio.";
            if (((j.firstName ?? "").trim().length) < 2) e.firstName = "Nombre obligatorio.";
            if (((j.lastName ?? "").trim().length) < 2) e.lastName = "Apellido obligatorio.";

            errs[i] = e;
        }

        const ok = errs.every((x) => !x.dnijury && !x.firstName && !x.lastName);
        return { ok, errs };
    };

    const validateGlobal = () => {
        const e: any = { files: {}, jury: [] };
        let ok = true;


        const c = checkboxes;
        if (!c.agreement || !c.format || !c.errors || !c.informed) {
            e.checkboxes = "Debes marcar todas las confirmaciones antes de enviar.";
            ok = false;
        }

        if (!projectTitle.trim()) {
            e.projectTitle = "El título del proyecto es obligatorio.";
            ok = false;
        }

        if (!files.authorization) { e.files.authorization = "Adjunta la hoja de autorización (PDF)."; ok = false; }
        if (!files.certificate) { e.files.certificate = "Adjunta la constancia de empastados (PDF)."; ok = false; }
        if (!files.thesis) { e.files.thesis = "Adjunta la tesis/informe (PDF)."; ok = false; }
        if (!files.originality) { e.files.originality = "Adjunta la constancia de originalidad (PDF)."; ok = false; }

        const studentsOk = studentData.every(validateStudent);
        const advisorsOk = advisorData.every(validateAdvisor);
        if (!studentsOk) ok = false;
        if (!advisorsOk) ok = false;


        const j = validateJuryAll();
        e.jury = j.errs;
        if (!j.ok) ok = false;

        return { ok, e };
    };


    const handleSubmit = async () => {
        if (isLoading) return;

        try {
            setShowValidation(true);

            const { ok, e } = validateGlobal();
            setFormErrors(e);

            if (!ok) {
                toastService.error("Corrige los campos marcados antes de enviar.");
                return;
            }

            setIsLoading(true);

            const formData = new FormData();
            const studentsPayload = studentData.map(({ codigo, ...rest }) => rest);
            const juryPayload = juryData.map(({ dnijury, ...rest }) => rest);

            formData.append("projectTitle", projectTitle);
            formData.append("checkboxes", JSON.stringify(checkboxes));
            formData.append("students", JSON.stringify(studentsPayload));
            formData.append("advisors", JSON.stringify(advisorsPayload));
            formData.append("jury", JSON.stringify(juryPayload));

            if (files.authorization) formData.append("authorization", files.authorization);
            if (files.certificate) formData.append("certificate", files.certificate);
            if (files.thesis) formData.append("thesis", files.thesis);
            if (files.originality) formData.append("originality", files.originality);

            const response = await fetch(`${API_URL}/applications/students`, {
                method: "POST",
                body: formData,
            });

            const result = await response.json();

            if (result.success) {
                setIsModalOpen(true);
                resetForm();
                setTimeout(() => window.location.reload(), 30000);
            } else {
                toastService.error(result.message || "Error al enviar solicitud");
            }
        } catch (error) {
            console.error("Error:", error);
            toastService.error("Error de conexión al servidor");
        } finally {
            setIsLoading(false);
        }
    };



    const onlyDigits = (v: string, max: number) => String(v ?? "").replace(/\D/g, "").slice(0, max);

    const PERSON_BY_DNI_URL = (dni: string) => `${API_URL}/personas/dni/${dni}`

    const pickNames = (payload: any) => {
        const p = payload?.data ?? payload;
        const first = p?.nombres ?? p?.nombre ?? p?.first_name ?? p?.firstName ?? "";
        const last = p?.apellidos ?? p?.apellido ?? p?.last_name ?? p?.lastName ?? "";
        const full = p?.full_name ?? p?.fullName ?? "";
        return { first: String(first).trim(), last: String(last).trim(), full: String(full).trim() };
    };

    const splitFullName = (full: string) => {
        const parts = String(full ?? "").trim().split(/\s+/).filter(Boolean);
        if (parts.length <= 1) return { first: parts[0] || "", last: "" };
        return { first: parts.slice(0, -2).join(" "), last: parts.slice(-2).join(" ") };
    };

    const juryTimers = useRef<Record<number, number | null>>({});
    const juryAbort = useRef<Record<number, AbortController | null>>({});
    const juryLastDni = useRef<Record<number, string>>({});

    const lookupPersonByDni = async (dni: string, signal?: AbortSignal) => {
        const res = await fetch(PERSON_BY_DNI_URL(dni), { signal });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json?.success === false) throw new Error(json?.message || "No encontrado");
        const { first, last, full } = pickNames(json);

        let firstName = first;
        let lastName = last;

        if ((!firstName || !lastName) && full) {
            const x = splitFullName(full);
            firstName = firstName || x.first;
            lastName = lastName || x.last;
        }
        return { firstName, lastName };
    };

    const MAX_10_MB = 10 * 1024 * 1024;

    const validatePdfAndSize = (file: File | null, maxBytes: number) => {
        if (!file) return "";
        if (file.type !== "application/pdf") return "Solo se permite PDF.";
        if (file.size > maxBytes) return `El archivo supera el límite de ${Math.round(maxBytes / (1024 * 1024))} MB.`;
        return "";
    };

    const setFileWithValidation = (
        key: "authorization" | "certificate" | "thesis" | "originality",
        file: File | null
    ) => {
        const err = validatePdfAndSize(file, MAX_10_MB);

        if (err) {
            toastService.error(err);
            setFiles((prev) => ({ ...prev, [key]: null }));

            setFormErrors((prev) => ({
                ...prev,
                files: { ...(prev.files ?? {}), [key]: err },
            }));
            return;
        }

        setFiles((prev) => ({ ...prev, [key]: file }));

        setFormErrors((prev) => ({
            ...prev,
            files: { ...(prev.files ?? {}), [key]: "" },
        }));
    };


    const handleJuryDniChange = (index: number, raw: string) => {
        const hasLetters = /[a-zA-Z]/.test(raw);
        setJuryTypingErr((prev) => {
            const copy = [...prev];
            copy[index] = hasLetters ? "Solo se aceptan números" : "";
            return copy;
        });

        const dni = onlyDigits(raw, 8);

        if (juryTimers.current[index]) window.clearTimeout(juryTimers.current[index]!);
        if (juryAbort.current[index]) juryAbort.current[index]!.abort();

        juryLastDni.current[index] = "";

        setJuryLookupMsg((prev) => {
            const copy = [...prev];
            copy[index] = "";
            return copy;
        });

        setJuryNameErr((prev) => {
            const copy = [...prev];
            copy[index] = "";
            return copy;
        });
        setJuryLastErr((prev) => {
            const copy = [...prev];
            copy[index] = "";
            return copy;
        });

        setFormErrors((prev) => {
            const jury = [...(prev.jury ?? [])];
            jury[index] = { ...(jury[index] ?? {}) };
            jury[index].dnijury = "";
            jury[index].firstName = "";
            jury[index].lastName = "";
            return { ...prev, jury };
        });

        updateJuryData(index, {
            ...juryData[index],
            dnijury: dni,
            firstName: "",
            lastName: "",
        });

        if (dni.length !== 8) return;

        if (juryLastDni.current[index] === dni) return;


        juryTimers.current[index] = window.setTimeout(async () => {
            try {
                const controller = new AbortController();
                juryAbort.current[index] = controller;

                const { firstName, lastName } = await lookupPersonByDni(dni, controller.signal);

                juryLastDni.current[index] = dni;

                setJuryLookupMsg((prev) => {
                    const copy = [...prev];
                    copy[index] = "";
                    return copy;
                });

                updateJuryData(index, {
                    ...juryData[index],
                    dnijury: dni,
                    firstName: firstName || "",
                    lastName: lastName || "",
                });
            } catch (err: any) {
                if (err?.name === "AbortError") return;

                flashJuryMsg(index, "DNI no encontrado, escribe nombre y apellido manualmente.");

                juryLastDni.current[index] = dni;
            }
        }, 450);
    };


    const [formKey, setFormKey] = useState(0);

    const resetForm = () => {
        setProjectTitle("");

        setCheckboxes({ agreement: false, format: false, errors: false, informed: false });

        setStudent([1]);
        setStudentData([{ nombres: "", apellidos: "", telefono: "", dni: "", escuela: "", email: "", codigo: "" }]);

        setAdvisor([1]);
        setAdvisorData([{ nombre: "", apellido: "", dni: "", orcid: "" }]);

        setFiles({ authorization: null, certificate: null, thesis: null, originality: null });

        setShowValidation(false);
        setFormErrors({ files: {}, jury: [] });

        setJuryLookupMsg(["", "", "", ""]);
        setJuryTypingErr(["", "", "", ""]);
        setJuryNameErr(["", "", "", ""]);
        setJuryLastErr(["", "", "", ""]);

        setJury([0, 1, 2]);
        setJuryData([
            { dnijury: "", firstName: "", lastName: "" },
            { dnijury: "", firstName: "", lastName: "" },
            { dnijury: "", firstName: "", lastName: "" },
        ]);

        setFormKey((k) => k + 1);
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

                        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
                            ¡Solicitud enviada con éxito!
                        </h2>

                        <p className="text-slate-500 text-center leading-relaxed mb-6">
                            Tu solicitud para publicar tu tesis ha sido enviada correctamente.
                            Podrás hacer seguimiento de tu trámite en la plataforma.
                        </p>

                        <div className="flex gap-3 mb-3">
                            <button
                            onClick={() => {
                                setIsModalOpen(false);
                                navigate("/process");
                            }}
                            >
                            Ir a seguimiento
                            </button>

                        </div>

                        <div className="flex gap-3">
                            <button
                            onClick={() => {
                                setIsModalOpen(false);
                                navigate("/");
                            }}
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
                <div className="mb-4">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span>Volver al inicio</span>
                    </Link>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">

                    <div className="text-center mb-10 pb-6 border-b-2 border-gray-100">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                            <FileText className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className=" md:textext-lgt-xl font-bold text-gray-900 mb-2">
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
                                onChange={(e) => {
                                    const next = { ...checkboxes, agreement: e.target.checked };
                                    setCheckboxes(next);
                                    clearCheckboxErrorIfOk(next);
                                }}

                            />
                            <InfoCheckbox
                                icon={FileText}
                                iconColor="blue"
                                text="He leído y ajustado el informe de investigación al formato oficial del reglamento de Investigación de la UNAMBA."
                                checkboxLabel="Sí, he ajustado"
                                checked={checkboxes.format}
                                onChange={(e) => {
                                    const next = { ...checkboxes, format: e.target.checked };
                                    setCheckboxes(next);
                                    clearCheckboxErrorIfOk(next);
                                }}
                            />
                            <InfoCheckbox
                                icon={AlertCircle}
                                iconColor="red"
                                text={<>He leído los errores más comunes que se presentan a la hora de presentar los informes de investigación cuyo link está aquí: <a href="https://drive.google.com/file/d/1yUA2CEBWBsgf1o181WaqmomqtHwkiNEK/view" target="_blank" className="text-blue-600 hover:underline font-semibold">ERRORES RECURRENTES EN DIAGRAMACION.pdf</a></>}
                                checkboxLabel="Sí, he leído"
                                checked={checkboxes.errors}
                                onChange={(e) => {
                                    const next = { ...checkboxes, errors: e.target.checked };
                                    setCheckboxes(next);
                                    clearCheckboxErrorIfOk(next);
                                }}

                            />
                            <InfoCheckbox
                                icon={CheckCircle2}
                                iconColor="green"
                                text="Estoy informado que el trámite es virtual, existe una página de seguimiento para ver mi trámite, que el procedimiento para otorgar la constancia es de 5 días hábiles."
                                checkboxLabel="Sí, estoy informado"
                                checked={checkboxes.informed}
                                onChange={(e) => {
                                    const next = { ...checkboxes, informed: e.target.checked };
                                    setCheckboxes(next);
                                    clearCheckboxErrorIfOk(next);
                                }}

                            />
                            {showValidation && formErrors.checkboxes && (
                                <p className="text-xs text-red-600 font-medium">{formErrors.checkboxes}</p>
                            )}

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
                                        number={index + 1}
                                        onRemove={() => removeStudent(index)}
                                        canRemove={index !== 0}
                                        data={studentData[index]}
                                        onChange={(data) => updateStudentData(index, data)}
                                        showValidation={showValidation}

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
                                        key={`${formKey}-advisor-${index}`}
                                        number={index + 1}
                                        onRemove={() => removeAdvisor(index)}
                                        canRemove={index !== 0}
                                        data={advisorData[index]}
                                        onChange={(data) => updateAdvisorData(index, data)}
                                        showValidation={showValidation}

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
                                    Sobre los jurados
                                </h3>
                            </div>
                            <div className="border-2 border-gray-200 rounded-xl p-6 space-y-4 bg-linear-to-br from-gray-50 to-white hover:border-blue-300 transition-all">
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-6">
                                        {jury.map((index, i) => (
                                            <div key={index} className="col-span-2">
                                                <div className="flex items-start gap-2">
                                                    <div className="grid grid-cols-[200px_1fr_1fr] gap-4 flex-1 items-start">
                                                        <div className="space-y-2">
                                                            <FormInput
                                                                icon={IdCard}
                                                                label={`dni del ${index === 0 ? 'presidente' : index === 1 ? 'primer miembro' : index === 2 ? 'segundo miembro' : 'tercer miembro'}`}
                                                                sublabel="Número de documento de identidad"
                                                                type="text"
                                                                placeholder="Ejem: 67234567"
                                                                value={juryData[index]?.dnijury || ""}
                                                                onChange={(e) => handleJuryDniChange(index, e.target.value)}

                                                            />

                                                            <p className="text-xs min-h-[16px] -mt-1">
                                                                {(() => {
                                                                    const dniLen = (juryData[index]?.dnijury ?? "").length;

                                                                    const typing = juryTypingErr[index]; // letras
                                                                    const submitErr =
                                                                        showValidation && dniLen === 0
                                                                            ? (formErrors.jury?.[index]?.dnijury || "")
                                                                            : "";

                                                                    const hint = dniLen > 0 && dniLen < 8 ? `Debe ser 8 dígitos (${dniLen}/8)` : "";
                                                                    const lookup = juryLookupMsg[index]; // no encontrado

                                                                    const msg = typing || submitErr || hint || lookup || "";
                                                                    const cls =
                                                                        typing || submitErr
                                                                            ? "text-red-600"
                                                                            : hint
                                                                                ? "text-red-500"
                                                                                : lookup
                                                                                    ? "text-amber-700"
                                                                                    : "text-red-600";

                                                                    return <span className={cls}>{msg || "."}</span>;
                                                                })()}
                                                            </p>

                                                        </div>

                                                        <div className="space-y-2">
                                                            <FormInput
                                                                icon={User}
                                                                label={`Nombre del ${index === 0 ? 'presidente' : index === 1 ? 'primer miembro' : index === 2 ? 'segundo miembro' : 'tercer miembro'}`}
                                                                sublabel="(En mayúsculas y minúsculas según corresponda)"
                                                                type="text"
                                                                placeholder="Ejem: Luis"
                                                                value={juryData[index]?.firstName || ''}
                                                                onChange={(e) => {
                                                                    const raw = e.target.value;
                                                                    const cleaned = onlyLetters(raw);
                                                                    clearJuryError(index, "firstName");
                                                                    setJuryNameErr((prev) => {
                                                                        const copy = [...prev];
                                                                        copy[index] = /\d/.test(raw) ? "Solo se aceptan letras" : "";
                                                                        return copy;
                                                                    });

                                                                    updateJuryData(index, { ...juryData[index], firstName: cleaned });
                                                                }}


                                                            />
                                                            <p className="text-xs text-red-600 min-h-[16px]">
                                                                {juryLastErr[index] ||
                                                                    (showValidation && (juryData[index]?.lastName ?? "").trim().length === 0
                                                                        ? (formErrors.jury?.[index]?.lastName || "")
                                                                        : "")}

                                                            </p>


                                                        </div>
                                                        <div className="space-y-2">
                                                            <FormInput
                                                                icon={User}
                                                                label={`Apellido del ${index === 0 ? 'presidente' : index === 1 ? 'primer miembro' : index === 2 ? 'segundo miembro' : 'tercer miembro'}`}
                                                                sublabel="(En mayúsculas y minúsculas según corresponda)"
                                                                type="text"
                                                                placeholder="Ejem: Robles"
                                                                value={juryData[index]?.lastName || ''}
                                                                onChange={(e) => {
                                                                    const raw = e.target.value;
                                                                    const cleaned = onlyLetters(raw);
                                                                    clearJuryError(index, "lastName");
                                                                    setJuryLastErr((prev) => {
                                                                        const copy = [...prev];
                                                                        copy[index] = /\d/.test(raw) ? "Solo se aceptan letras" : "";
                                                                        return copy;
                                                                    });

                                                                    updateJuryData(index, { ...juryData[index], lastName: cleaned });
                                                                }}

                                                            />
                                                            <p className="text-xs text-red-600 min-h-[16px]">
                                                                {juryNameErr[index] ||
                                                                    (showValidation && (juryData[index]?.lastName ?? "").trim().length === 0
                                                                        ? (formErrors.jury?.[index]?.lastName || "")
                                                                        : "")}
                                                            </p>


                                                        </div>
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


                                                {
                                                    i < jury.length - 1 && (
                                                        <div className="my-4 border-t border-gray-200" />
                                                    )
                                                }
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
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        setProjectTitle(v);

                                        if (v.trim().length > 5) {
                                            setFormErrors((prev) => ({ ...prev, projectTitle: "" }));
                                        }
                                    }}
                                />

                                {showValidation && formErrors.projectTitle && (
                                    <p className="text-xs text-red-600 font-medium">{formErrors.projectTitle}</p>
                                )}
                                <FileUpload
                                    label="Hoja de autorización de publicación escaneado en formato PDF (Apellidos Nombre Hoja.pdf max 10 MB, firmado y con su huella digital)"
                                    maxSize="10 MB"
                                    value={files.authorization}
                                    onChange={(file) => setFileWithValidation("authorization", file)}
                                />
                                {showValidation && formErrors.files?.authorization && (
                                    <p className="text-xs text-red-600 font-medium">{formErrors.files.authorization}</p>
                                )}
                                <FileUpload
                                    label="Constancia de entrega de empastados otorgado por la Unidad de Investigación de su Facultad (Apellidos Nombres Acta.pdf) max 10 MB"
                                    maxSize="10 MB"
                                    value={files.certificate}
                                    onChange={(file) => setFileWithValidation("certificate", file)}
                                />
                                {showValidation && formErrors.files?.certificate && (
                                    <p className="text-xs text-red-600 font-medium">{formErrors.files.certificate}</p>
                                )}
                                <FileUpload
                                    label="Tesis con el mismo contenido presentado en Unidad de Investigación (apellidos Nombre Tesis.pdf), TAMAÑO A4 y máximo 10 Mb"
                                    maxSize="10 MB"
                                    value={files.thesis}
                                    onChange={(file) => setFileWithValidation("thesis", file)}

                                />
                                {showValidation && formErrors.files?.thesis && (
                                    <p className="text-xs text-red-600 font-medium">{formErrors.files.thesis}</p>
                                )}
                                <FileUpload
                                    label="Constancia de originalidad de su Tesis otorgado por la Unidad de Investigación de su Facultad (apellidos Nombre Constancia.pdf), TAMAÑO A4 y máximo 10 Mb"
                                    maxSize="10 MB"
                                    value={files.originality}
                                    onChange={(file) => setFileWithValidation("originality", file)}
                                />
                                {showValidation && formErrors.files?.originality && (
                                    <p className="text-xs text-red-600 font-medium">{formErrors.files.originality}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white font-semibold py-4 px-8 rounded-xl text-sm transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="w-5 h-5 rounded-full border-2 border-white/60 border-t-white animate-spin" />
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
                                className="px-8 py-4 border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl text-sm transition-all hover:border-gray-400"
                            >
                                Limpiar
                            </button>

                        </div>
                    </div>
                </div>
            </main >
        </div >
    )
}
