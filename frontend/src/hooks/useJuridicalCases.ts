import { JuridicalCase } from '@/services/juridical-case-service';
import { useState, useCallback } from 'react';
import useJuridicalCaseService from './use-juridical-case-service';

export const useJuridicalCases = () => {
  const [cases, setCases] = useState<JuridicalCase[]>([]);
  const [history, setHistory] = useState<JuridicalCase[]>([]); // Tipo específico en lugar de `any[]`
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hook del servicio
  const service = useJuridicalCaseService();

  // Obtener la lista de casos
  const loadCases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await service.getJuridicalCases(); // Reemplaza `fetchCases`
      setCases(data);
    } catch (err) {
      setError('Error al cargar los casos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [service]);

  // Crear un nuevo caso
  const addCase = async (
    attendantId: number,
    subject: string,
    clientId: number,
    observation: string
  ) => {
    setError(null);
    try {
      const newCase = await service.createJuridicalCase(
        attendantId,
        subject,
        clientId,
        observation
      );
      setCases((prevCases) => [...prevCases, newCase]);
      setSuccessMessage('¡Caso creado con éxito!');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setError('Error al crear el caso.');
      console.error(err);
    }
  };

  // Eliminar un caso
  const removeCase = async (id: number) => {
    setError(null);
    try {
      await service.removeJuridicalCase(id); // Reemplaza `deleteCase`
      setCases((prevCases) => prevCases.filter((c) => c.id !== id));
      setSuccessMessage('¡Caso eliminado con éxito!');
      setTimeout(() => setSuccessMessage(null), 2000);
    } catch (err) {
      setError('Error al eliminar el caso.');
      console.error(err);
    }
  };

  // Obtener el historial de un caso
  const loadCaseHistory = async (id: number) => {
    setError(null);
    setLoading(true);
    try {
      const data = await service.getCaseHistory(id); // Reemplaza `fetchCaseHistory`
      setHistory(data);
    } catch (err) {
      setError('Error al cargar el historial del caso.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    cases,
    history,
    loading,
    error,
    successMessage,
    loadCases,
    addCase,
    removeCase,
    loadCaseHistory,
  };
};
