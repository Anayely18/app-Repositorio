import { CoautorForm } from "@/shared/components/forms/CoautorForm";
import { AddTeacherForm } from "@/shared/components/forms/AddTeacherForm";
import { FileUpload } from "@/shared/components/forms/FileUpload";
import { FormInput } from "@/shared/components/forms/FormInput";
import { InfoCheckbox } from "@/shared/components/forms/InfoCheckbox";
import Logo from "@/shared/ui/Logo";
import { AlertCircle, CheckCircle2, FileText, User, Users, Plus, Loader, X, ArrowLeft } from "lucide-react";
import { Link, useNavigate  } from "react-router-dom"
import { useState } from "react";
import { toastService } from "@/services/toastService";
import { API_URL } from "@/utils/api";

type TeacherErr = { nombres?: string; apellidos?: string; dni?: string; orcid?: string; escuela?: string };
type CoautorErr = { tipoUbicacion?: string; tipoRol?: string; nombre?: string; apellido?: string; orcid?: string; codigo?: string; dni?: string };
type FileErr = { authorization?: string; document?: string; similarity?: string; report?: string };
type TopErr = { projectTitle?: string; terms?: string; truthful?: string; funding?: string; files?: FileErr };

export default function TeacherResearchReportRequest() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [submitAttempted, setSubmitAttempted] = useState(false);

  const [checkboxes, setCheckboxes] = useState({
    agreement: false,
    format: false,
    errors: false,
    informed: false,
    truthful: false,
    funding: null as "public" | "self" | null,
  });

  const [autorTeacher, setTeacher] = useState([1]);
  const [teacherData, setTeacherData] = useState<any[]>([{}]);

  const [teacherErrors, setTeacherErrors] = useState<TeacherErr[]>([{}]);

  const addAutorTeacher = () => {
    if (autorTeacher.length === 3) return toastService.error("Máximo tres autores por informe");
    setTeacher([...autorTeacher, autorTeacher.length + 1]);
    setTeacherData([...teacherData, {}]);
    setTeacherErrors([...teacherErrors, {}]);
  };

  const removeAutorTeacher = (index: number) => {
    setTeacher(autorTeacher.filter((_, i) => i !== index));
    setTeacherData(teacherData.filter((_, i) => i !== index));
    setTeacherErrors(teacherErrors.filter((_, i) => i !== index));
  };

  const updateTeacherData = (index: number, data: any) => {
    const newData = [...teacherData];
    newData[index] = data;
    setTeacherData(newData);
  };

  const setTeacherFieldError = (index: number, field: keyof TeacherErr, value: string) => {
    setTeacherErrors((prev) => {
      const copy = [...prev];
      copy[index] = { ...(copy[index] ?? {}), [field]: value };
      return copy;
    });
  };

  const [coautor, setCoautor] = useState<number[]>([]);
  const [coautorData, setCoautorData] = useState<any[]>([]);
  const [coautorErrors, setCoautorErrors] = useState<CoautorErr[]>([]);


  const addCoautor = () => {
    if (coautor.length === 5) return toastService.error("Máximo cinco coautores por informe");

    const nextNumber = coautor.length === 0 ? 1 : Math.max(...coautor) + 1;

    setCoautor([...coautor, nextNumber]);
    setCoautorData([...coautorData, {}]);
    setCoautorErrors([...coautorErrors, {}]);
  };


  const removeCoautor = (index: number) => {
    setCoautor(coautor.filter((_, i) => i !== index));
    setCoautorData(coautorData.filter((_, i) => i !== index));
    setCoautorErrors(coautorErrors.filter((_, i) => i !== index));
  };

  const updateCoautorData = (index: number, data: any) => {
    const newData = [...coautorData];
    newData[index] = data;
    setCoautorData(newData);
  };

  const setCoautorFieldError = (index: number, field: keyof CoautorErr, value: string) => {
    setCoautorErrors((prev) => {
      const copy = [...prev];
      copy[index] = { ...(copy[index] ?? {}), [field]: value };
      return copy;
    });
  };

  const [projectTitle, setProjectTitle] = useState<string>("");

  const [topErrors, setTopErrors] = useState<TopErr>({});

  const [files, setFiles] = useState({
    authorization: null as File | null,
    document: null as File | null,
    similarity: null as File | null,
    report: null as File | null,
  });



  // =========================
  // VALIDACIONES
  // =========================
  const onlyTextOk = (v: string) => /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s.'-]+$/.test(v.trim());
  const onlyDigitsOk = (v: string, len: number) => new RegExp(`^\\d{${len}}$`).test(String(v ?? "").trim());

  const orcidOk = (vRaw: string) => {
    const v = String(vRaw ?? "").trim();
    const url = /^https?:\/\/orcid\.org\/\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/;
    return url.test(v);
  };

  const validatePdf = (file: File | null, maxMB: number) => {
    if (!file) return "Archivo requerido";
    if (file.type !== "application/pdf") return "Solo se permite PDF";
    if (file.size > maxMB * 1024 * 1024) return `Máximo ${maxMB} MB`;
    return "";
  };

  const isRowEmpty = (obj: any, keys: string[]) =>
    keys.every((k) => String(obj?.[k] ?? "").trim() === "");

  const clearTermsErrorIfOk = (next: typeof checkboxes) => {
    const ok = next.agreement && next.format && next.errors && next.informed;
    if (ok) {
      setTopErrors((prev) => ({ ...prev, terms: "" }));
    }
  };
  const validateAll = () => {
    const nextTop: TopErr = { files: {} };
    const nextTeacherErrors: TeacherErr[] = teacherData.map(() => ({}));
    const nextCoautorErrors: CoautorErr[] = coautorData.map(() => ({}));

    // Título
    if (!projectTitle || projectTitle.trim().length < 5) {
      nextTop.projectTitle = "Ingrese un título válido (mínimo 5 caracteres)";
    }

    // Términos
    if (!checkboxes.agreement || !checkboxes.format || !checkboxes.errors || !checkboxes.informed) {
      nextTop.terms = "Debe marcar todos los checks informativos";
    }


    // Veracidad
    if (!checkboxes.truthful) nextTop.truthful = "Debe declarar que la información es verídica";

    // Financiamiento
    if (!checkboxes.funding) nextTop.funding = "Seleccione el tipo de financiamiento";

    // Autores (docentes)
    teacherData.forEach((t, idx) => {
      // si agregaron filas y están vacías, igual las marcamos como requeridas (más pro)
      const dni = String(t?.dni ?? "").trim();
      const nombres = String(t?.nombres ?? "").trim();
      const apellidos = String(t?.apellidos ?? "").trim();
      const orcid = String(t?.orcid ?? "").trim();
      const escuela = String(t?.escuela ?? "").trim();

      if (dni && !onlyDigitsOk(dni, 8)) nextTeacherErrors[idx].dni = "DNI debe tener 8 dígitos";

      if (!nombres || nombres.length < 2 || !onlyTextOk(nombres)) nextTeacherErrors[idx].nombres = "Ingrese nombres válidos (solo letras)";
      if (!apellidos || apellidos.length < 2 || !onlyTextOk(apellidos)) nextTeacherErrors[idx].apellidos = "Ingrese apellidos válidos (solo letras)";
      if (!orcid) nextTeacherErrors[idx].orcid = "El ORCID es obligatorio";
      else if (!orcidOk(orcid)) nextTeacherErrors[idx].orcid = "ORCID inválido (0000-0000-0000-0000 o https://orcid.org/...)";
      if (!escuela) nextTeacherErrors[idx].escuela = "Seleccione una escuela profesional";
      if (!dni) nextTeacherErrors[idx].dni = "El DNI es obligatorio";
    });

    // Coautores (opcional): si está totalmente vacío el coautor 1, no bloqueamos.
    if (coautorData.length > 0) {
      coautorData.forEach((c, idx) => {
        if (!c?.tipoUbicacion) nextCoautorErrors[idx].tipoUbicacion = "Seleccione ubicación";
        if (!c?.tipoRol) nextCoautorErrors[idx].tipoRol = "Seleccione rol";

        const nombre = String(c?.nombre ?? "").trim();
        const apellido = String(c?.apellido ?? "").trim();

        if (!nombre || nombre.length < 2 || !onlyTextOk(nombre)) nextCoautorErrors[idx].nombre = "Ingrese nombres válidos";
        if (!apellido || apellido.length < 2 || !onlyTextOk(apellido)) nextCoautorErrors[idx].apellido = "Ingrese apellidos válidos";

        const orcid = String(c?.orcid ?? "").trim();
        if (!orcid) nextCoautorErrors[idx].orcid = "El ORCID es obligatorio";
        else if (!orcidOk(orcid)) nextCoautorErrors[idx].orcid = "ORCID inválido";
      });
    }

    // Archivos
    nextTop.files!.authorization = validatePdf(files.authorization, 10);
    nextTop.files!.document = validatePdf(files.document, 10);
    nextTop.files!.similarity = validatePdf(files.similarity, 10);
    nextTop.files!.report = validatePdf(files.report, 10);


    const hasTeacherErr = nextTeacherErrors.some((e) => Object.values(e).some(Boolean));
    const hasCoautorErr = nextCoautorErrors.some((e) => Object.values(e).some(Boolean));
    const hasTopErr =
      !!nextTop.projectTitle ||
      !!nextTop.terms ||
      !!nextTop.truthful ||
      !!nextTop.funding ||
      Object.values(nextTop.files ?? {}).some((x) => !!x);

    setTopErrors(nextTop);
    setTeacherErrors(nextTeacherErrors);
    setCoautorErrors(nextCoautorErrors);

    return !(hasTeacherErr || hasCoautorErr || hasTopErr);
  };

  const handleSubmit = async () => {
    if (isLoading) return;

    setSubmitAttempted(true);

    if (!validateAll()) {
      toastService.error("Revisa los campos marcados en rojo");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("projectTitle", projectTitle);
      formData.append("checkboxes", JSON.stringify(checkboxes));
      formData.append("teachers", JSON.stringify(teacherData));
      formData.append("coauthors", JSON.stringify(coautorData));

      if (files.authorization) formData.append("authorization", files.authorization);
      if (files.document) formData.append("document", files.document);
      if (files.similarity) formData.append("similarity", files.similarity);
      if (files.report) formData.append("report", files.report);

      const response = await fetch(`${API_URL}/applications/teachers`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setIsModalOpen(true);
        const applicationId = result.data.applicationId;
        sessionStorage.setItem("lastApplicationId", applicationId);
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

  const MB = 1024 * 1024;
  const MAX_MB = 10;

  const validatePdf10MB = (file: File | null) => {
    if (!file) return "";
    if (file.type !== "application/pdf") return "Solo se permite PDF";
    if (file.size > MAX_MB * MB) return "El archivo no debe superar los 10 MB";
    return "";
  };

  const setFileWithValidation = (
    key: "authorization" | "document" | "similarity" | "report",
    file: File | null
  ) => {
    const err = validatePdf10MB(file);

    if (err) {
      toastService.error(err);

      // ❌ no aceptar archivo inválido
      setFiles((prev) => ({ ...prev, [key]: null }));

      // ✅ mostrar mensaje debajo
      setTopErrors((prev) => ({
        ...prev,
        files: { ...(prev.files ?? {}), [key]: err },
      }));
      return;
    }

    // ✅ archivo válido
    setFiles((prev) => ({ ...prev, [key]: file }));

    // ✅ limpiar error
    setTopErrors((prev) => ({
      ...prev,
      files: { ...(prev.files ?? {}), [key]: "" },
    }));
  };


  const [formKey, setFormKey] = useState(0);
  const resetForm = () => {
    setSubmitAttempted(false);
    setTopErrors({});
    setProjectTitle("");
    setCheckboxes({
      agreement: false,
      format: false,
      errors: false,
      informed: false,
      truthful: false,
      funding: null,
    });

    setTeacher([1]);
    setTeacherData([{}]);
    setTeacherErrors([{}]);

    setCoautor([]);
    setCoautorData([]);
    setCoautorErrors([]);


    setFiles({
      authorization: null,
      document: null,
      similarity: null,
      report: null,
    });

    // ✅ fuerza que hijos (inputs/fileupload) se reinicien al 100%
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

            <h2 className="text-2xl font-bold text-slate-900 text-center mb-4">
              ¡Solicitud enviada con éxito!
            </h2>

            <p className="text-slate-500 text-center leading-relaxed mb-6">
              Tu solicitud para publicar su informe de investigación ha sido enviada correctamente.
              Podrás hacer seguimiento de tu trámite en el siguiente link.
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FileText className="w-8 h-8 text-green-600" />
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
                iconColor="redr"
                text={
                  <>
                    No es función de la unidad de repositorio revisar en todo su extremo el informe de investigación...
                    {" "}
                    <a
                      href="https://drive.google.com/file/d/1FNXxEnW_zWmuuFhHJ7tW2AqECUwekjBc/view"
                      target="_blank"
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      reglamento
                    </a>
                    .
                  </>
                }
                checkboxLabel="Sí, estoy de acuerdo"
                checked={checkboxes.agreement}
                onChange={(e) => {
                  const next = { ...checkboxes, agreement: e.target.checked };
                  setCheckboxes(next);
                  clearTermsErrorIfOk(next);
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
                  clearTermsErrorIfOk(next);
                }}
              />

              <InfoCheckbox
                icon={AlertCircle}
                iconColor="red"
                text={
                  <>
                    He leído los errores más comunes...
                    {" "}
                    <a
                      href="https://drive.google.com/file/d/1yUA2CEBWBsgf1o181WaqmomqtHwkiNEK/view"
                      target="_blank"
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      ERRORES RECURRENTES EN DIAGRAMACION.pdf
                    </a>
                  </>
                }
                checkboxLabel="Sí, he leído"
                checked={checkboxes.errors}
                onChange={(e) => {
                  const next = { ...checkboxes, errors: e.target.checked };
                  setCheckboxes(next);
                  clearTermsErrorIfOk(next);
                }}
              />

              <InfoCheckbox
                icon={CheckCircle2}
                iconColor="green"
                text="Estoy informado que el trámite es virtual..."
                checkboxLabel="Sí, estoy informado"
                checked={checkboxes.informed}
                onChange={(e) => {
                  const next = { ...checkboxes, informed: e.target.checked };
                  setCheckboxes(next);
                  clearTermsErrorIfOk(next);
                }}
              />

              {submitAttempted && topErrors.terms && (
                <p className="text-xs text-red-600 font-medium">{topErrors.terms}</p>
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
                  onClick={addAutorTeacher}
                  disabled={isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Agregar autor
                </button>
              </div>

              <div className="space-y-4">
                {autorTeacher.map((_, index) => (
                  <AddTeacherForm
                    key={index}
                    number={index + 1}
                    onRemove={() => removeAutorTeacher(index)}
                    canRemove={index !== 0}
                    data={teacherData[index]}
                    onChange={(data) => updateTeacherData(index, data)}
                    realTimeErrors={teacherErrors[index]}
                    onRealTimeErrorChange={(field, value) => setTeacherFieldError(index, field, value)}
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
                  <div className="text-sm text-gray-500 border border-dashed rounded-xl p-4">
                    Si deseas, puedes agregar coautores (opcional).
                  </div>
                ) : (
                  coautor.map((_, index) => (
                    <CoautorForm
                      key={index}
                      number={index + 1}
                      onRemove={() => removeCoautor(index)}
                      canRemove={true}
                      data={coautorData[index]}
                      onChange={(data) => updateCoautorData(index, data)}
                      realTimeErrors={coautorErrors[index]}
                      onRealTimeErrorChange={(field, value) => setCoautorFieldError(index, field, value)}
                      showValidation={submitAttempted}
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
                  onChange={(e) => {
                    const v = e.target.value;
                    setProjectTitle(v);

                    if (v.trim().length >= 5) {
                      setTopErrors((prev) => ({ ...prev, projectTitle: "" }));
                    }
                  }}
                  disabled={isLoading}
                  errorMessage={submitAttempted ? topErrors.projectTitle : ""}
                />

                <FileUpload
                  label="Adjuntar hoja de autorización de publicación"
                  sublabel="Debe estar escaneado en formato PDF (Apellidos Nombre Hoja.pdf) max 1 MB, firmado y con su huella digital."
                  maxSize="10 MB"
                  value={files.authorization}
                  onChange={(file) => {
                    setFiles((prev) => ({ ...prev, authorization: file }));

                    if (file) {
                      setTopErrors((prev) => ({
                        ...prev,
                        files: { ...(prev.files ?? {}), authorization: "" },
                      }));
                    }
                  }}
                  errorMessage={submitAttempted ? topErrors.files?.authorization : ""}
                />

                <FileUpload
                  label="Adjuntar documento escaneado"
                  sublabel="(constancia, carta de aceptación, carta de informe de investigacion favorable u otro) emitido por la Dirección de Institutos de Investigación (formato PDF)."
                  maxSize="10 MB"
                  value={files.document}
                  onChange={(file) => setFileWithValidation("document", file)}
                  errorMessage={submitAttempted ? topErrors.files?.document : ""}
                />

                <FileUpload
                  label="Adjuntar reporte de similitud"
                  sublabel="emitido por Turnitin, donde muestre título del informe, nombres y apellidos del primer autor (formato PDF)."
                  maxSize="10 MB"
                  value={files.similarity}
                  onChange={(file) => setFileWithValidation("similarity", file)}
                  errorMessage={submitAttempted ? topErrors.files?.similarity : ""}
                />

                <FileUpload
                  label="Adjuntar Informe de investigacion"
                  sublabel="con el mismo contenido presentado a la Dirección de Institutos de Investigación y que fue aceptado de forma favorable. Este documento será publicado en Repositorio DSpace (formato PDF)."
                  maxSize="10 MB"
                  value={files.report}
                  onChange={(file) => setFileWithValidation("report", file)}
                  errorMessage={submitAttempted ? topErrors.files?.report : ""}
                />

                <div className="space-y-4">
                  <InfoCheckbox
                    icon={AlertCircle}
                    iconColor="red"
                    text="Declaro bajo juramento que toda esta información compartida en la solicitud es verídica."
                    checkboxLabel="Sí, es información verídica"
                    checked={checkboxes.truthful}
                    onChange={(e) => {
                      const next = e.target.checked;
                      setCheckboxes((prev) => ({ ...prev, truthful: next }));

                      if (next) {
                        setTopErrors((prev) => ({ ...prev, truthful: "" }));
                      }
                    }}
                  />
                  {submitAttempted && topErrors.truthful && (
                    <p className="text-xs text-red-600 font-medium">{topErrors.truthful}</p>
                  )}

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
                              checked={checkboxes.funding === "public"}
                              onChange={() => {
                                setCheckboxes((prev) => ({ ...prev, funding: "public" }));
                                setTopErrors((prev) => ({ ...prev, funding: "" }));
                              }}

                              className="w-4 h-4 text-blue-600"
                              disabled={isLoading}
                            />
                            <span className="text-sm text-gray-700">
                              Sí, doy conformidad a esta afirmación.
                            </span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="funding"
                              checked={checkboxes.funding === "self"}
                              onChange={() => {
                                setCheckboxes((prev) => ({ ...prev, funding: "self" }));
                                setTopErrors((prev) => ({ ...prev, funding: "" }));
                              }}
                              className="w-4 h-4 text-blue-600"
                              disabled={isLoading}
                            />
                            <span className="text-sm text-gray-700">
                              No, es un trabajo de investigación autofinanciado.
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  {submitAttempted && topErrors.funding && (
                    <p className="text-xs text-red-600 font-medium mt-2">{topErrors.funding}</p>
                  )}
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
  );
}
