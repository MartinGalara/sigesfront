import { useState, useEffect } from "react";
import { Accordion, AccordionItem, Button, Chip, Spinner } from "@heroui/react";
import { Download } from "lucide-react";
import { capacitacionesService, authService } from "../api";

interface Instructivo {
  id: string;
  name: string;
  mimeType?: string;
  size?: string;
}

type InstructivosData = {
  [category: string]: Instructivo[];
};

export function Capacitaciones() {
  const [user, setUser] = useState<any>(null);
  const [instructivos, setInstructivos] = useState<InstructivosData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const isLoggedIn = authService.isLoggedIn();
    if (isLoggedIn) {
      authService
        .getCurrentUser()
        .then((userData) => {
          setUser(userData);
          loadInstructivos();
        })
        .catch((error) => {
          console.error("Error al obtener los datos del usuario:", error);
          loadInstructivos();
        });
    } else {
      loadInstructivos();
    }
    // eslint-disable-next-line
  }, []);

  // Carga carpetas y archivos desde Google Drive
  const loadInstructivos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // 1. Obtener las carpetas (categorías)
      const folders = await capacitacionesService.getFolders();
      // 2. Para cada carpeta, obtener los archivos
      const instructivosData: InstructivosData = {};
      for (const folder of folders) {
        const files = await capacitacionesService.getFilesByFolder(folder.id);
        instructivosData[folder.name] = files.map((file: any) => ({
          id: file.id,
          name: file.name,
          mimeType: file.mimeType,
          size: file.size,
        }));
      }
      setInstructivos(instructivosData);
    } catch (error) {
      console.error("Error al cargar los instructivos:", error);
      setError("No se pudieron cargar los instructivos. Intenta nuevamente más tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadInstructivo = async (fileId: string, filename: string) => {
    try {
      const blob = await capacitacionesService.downloadInstructivo(fileId, filename);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al descargar el instructivo:", error);
      alert("Error al descargar el archivo. Por favor, inténtalo de nuevo.");
    }
  };

  const formatFileName = (fileName: string): string => {
    const nameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
    return nameWithoutExtension.replace(/_/g, " ").toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 text-red-700 p-6 rounded-lg shadow text-center">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-center text-white mb-4">Capacitaciones</h2>
      </div>
      <div className="max-w-4xl mx-auto">
        <Accordion variant="splitted" className="gap-4">
          {Object.entries(instructivos).map(([category, files]) => (
            <AccordionItem
              key={category}
              aria-label={category}
              title={<span className="text-lg font-semibold text-white">{category}</span>}
              className="bg-gray-800/50 backdrop-blur-sm border text-white border-gray-700/50 rounded-lg"
            >
              <div className="p-4">
                {files.length > 0 ? (
                  <div className="space-y-3">
                    {files.map((instructivo: Instructivo) => (
                      <div
                        key={instructivo.id}
                        className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg border border-gray-700/30"
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-white">{formatFileName(instructivo.name)}</span>
                        </div>
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          startContent={<Download size={16} />}
                          onClick={() => downloadInstructivo(instructivo.id, instructivo.name)}
                        >
                          Descargar
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 text-center py-4">
                    No hay capacitaciones para esta categoría.
                  </p>
                )}
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
