import React, { useState } from "react";
import { Send, Phone, Mail, MapPin, Loader2 } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
    phone: "",
  });

  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (submissionStatus !== "idle") {
      setSubmissionStatus("idle");
    }
  };

  const validateForm = () => {
    const newErrors = { name: "", email: "", message: "", phone: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "El nombre completo es obligatorio.";
      isValid = false;
    }

    if (formData.phone && !/^\+?[0-9\s-]+$/.test(formData.phone)) {
      newErrors.phone = "El formato del teléfono no es válido.";
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El formato del correo electrónico no es válido.";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es obligatorio.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmissionStatus("loading");

    try {
      const response = await fetch("https://formspree.io/f/xanbnayp", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setSubmissionStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          message: "",
        });
        setTimeout(() => setSubmissionStatus("idle"), 5000);
      } else {
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setSubmissionStatus("error");
    }
  };

  const handleWhatsAppSubmit = () => {
    const namePart = formData.name ? `Hola, soy ${formData.name}` : "Hola";
    const companyPart = formData.company ? ` de ${formData.company}` : "";
    const messagePart = formData.message ? `. ${formData.message}` : "";
    const isFormEmpty =
      !formData.name && !formData.company && !formData.message;
    const message = isFormEmpty
      ? ""
      : `${namePart}${companyPart}${messagePart}`;
    const whatsappUrl = `https://wa.me/543512266159?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section
      id="contacto"
      className="py-20 bg-gray-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-blue-900/10 to-gray-800"></div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
          backgroundSize: "40px 40px",
        }}
      ></div>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent"></div>
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block mb-2 bg-gradient-to-r from-blue-600/20 to-cyan-400/20 rounded-full px-3 py-1 text-xs font-medium text-cyan-400">
            Estamos para Ayudarte
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Contactanos
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto"></div>
          <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
            Estamos listos para ayudarte a transformar tu estación de servicio
            con nuestra tecnología.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-xl p-8 border border-white/10 relative">
              <h3 className="text-2xl font-semibold text-white mb-6">
                Envianos un mensaje
              </h3>
              <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-300 mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-white ${
                        errors.name ? "border-red-500" : "border-gray-700"
                      }`}
                      required
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-300 mb-2">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-white ${
                        errors.email ? "border-red-500" : "border-gray-700"
                      }`}
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="phone" className="block text-gray-300 mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-white ${
                        errors.phone ? "border-red-500" : "border-gray-700"
                      }`}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-gray-300 mb-2"
                    >
                      Empresa
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-white"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-300 mb-2">
                    Mensaje
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className={`w-full px-4 py-3 bg-gray-800/50 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-colors text-white ${
                      errors.message ? "border-red-500" : "border-gray-700"
                    }`}
                    required
                  ></textarea>
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <button
                    type="submit"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submissionStatus === "loading"}
                  >
                    {submissionStatus === "loading" ? (
                      <>
                        Enviando...
                        <Loader2 size={18} className="animate-spin" />
                      </>
                    ) : (
                      <>
                        Enviar mensaje
                        <Send size={18} />
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppSubmit}
                    className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    Enviar por WhatsApp
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 text-center h-5">
                  {submissionStatus === "success" && (
                    <p className="text-green-400">
                      ¡Mensaje enviado! Gracias por contactarnos.
                    </p>
                  )}
                  {submissionStatus === "error" && (
                    <p className="text-red-400">
                      Hubo un error. Por favor, inténtalo de nuevo.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
          <div>
            <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm text-white rounded-xl shadow-lg p-8 mb-8 border border-white/10">
              <h3 className="text-2xl font-semibold mb-6">
                Información de contacto
              </h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-600/20 to-cyan-500/20 p-3 rounded-lg text-cyan-400">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-200">
                      Teléfono
                    </h4>
                    <a
                      href="tel:+543512266159"
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      +54 351 226-6159
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-600/20 to-cyan-500/20 p-3 rounded-lg text-cyan-400">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-200">Email</h4>
                    <a
                      href="mailto:info@sistemassiges.com.ar"
                      className="text-gray-400 hover:text-cyan-400 transition-colors"
                    >
                      info@sistemassiges.com.ar
                    </a>
                  </div>
                </div>
                <a
                  href="https://wa.me/543512266159"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 group"
                >
                  <div className="bg-gradient-to-br from-green-600/20 to-emerald-500/20 p-3 rounded-lg text-green-400 group-hover:text-green-300 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-200 group-hover:text-gray-100 transition-colors">
                      WhatsApp
                    </h4>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                      +54 351 226-6159
                    </p>
                  </div>
                </a>
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-blue-600/20 to-cyan-500/20 p-3 rounded-lg text-cyan-400">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-gray-200">
                      Dirección
                    </h4>
                    <p className="text-gray-400">
                      Av. Monseñor Pablo Cabrera 2074
                      <br />
                      X5008HHF, Córdoba
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-80 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d700.9928743424573!2d-64.20738208466027!3d-31.385628273573484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x943298f06a0b1e7d%3A0x17f7fbbdf1693f4f!2sSistema%20SIGES%20S.A.!5e0!3m2!1ses!2sar!4v1752864218103!5m2!1ses!2sar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="relative z-0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
