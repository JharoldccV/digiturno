import { useJuridicalCaseResource } from '@/providers/juridical-case-provider';
import { JuridicalCase } from '@/services/juridical-case-service';
import React, { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import FormCreateJuridicalCase from './FormCreateJuridicalCase';

type CasesModalProps = {
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
};

const CasesModal: React.FC<CasesModalProps> = ({
  isOpen,
  onClose,
  loading,
}) => {
  const [filteredCases, setFilteredCases] = useState<JuridicalCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<JuridicalCase | undefined>(
    undefined
  );
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { juridicalCases, createJuridicalCase } = useJuridicalCaseResource();

  useEffect(() => {
    setFilteredCases(juridicalCases);
  }, [juridicalCases]);

  const handleCreate = () => {
    setIsEditing(true);
  };

  const handleSave = ({
    subject,
    observation,
  }: {
    subject: string;
    observation: string;
  }) => {
    createJuridicalCase(subject, observation);
  };

  const handleEdit = (c: JuridicalCase) => {
    setSelectedCase(c);
    setIsEditing(true);
  };

  const handleSearch = () => {
    const filtered = juridicalCases.filter((c) =>
      c.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCases(filtered);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
    setFilteredCases(juridicalCases);
  };

  const onDelete = (juridicalCaseId: number) => {
    // Delete logic
  };

  return (
    <div
      className={`${
        isOpen ? 'fixed' : 'hidden'
      } inset-0 bg-black/50 flex justify-center items-center z-50`}
    >
      <div className="bg-white w-5/6 h-4/5 max-w-7xl rounded-lg shadow-lg p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {isEditing ? 'Editar Caso' : 'Lista de Casos'}
          </h2>
          <button onClick={onClose} className="text-red-500 font-bold">
            Cerrar
          </button>
        </div>

        {!isEditing && (
          <>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handleCreate}
                className="bg-blue-600 text-white py-2 px-4 rounded"
              >
                Crear Nuevo Caso
              </button>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por Número de Caso"
                  className="border rounded px-3 py-2"
                />
                <button
                  onClick={handleSearch}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Buscar
                </button>
                <button
                  onClick={handleResetSearch}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Reiniciar
                </button>
              </div>
            </div>

            {loading && <p className="text-gray-500">Cargando casos...</p>}

            <div className="overflow-y-auto h-96">
              <table className="min-w-full bg-white border rounded shadow-lg">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    {[
                      'Número de Caso',
                      'Asunto',
                      'Atendido Por',
                      'Cliente',
                      'Tipo Registro',
                      'Fecha Creación',
                      'Fecha Modificación',
                      'Observación',
                      'Acciones',
                    ].map((header) => (
                      <th key={header} className="py-2 px-4 border-b">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map((c) => (
                    <tr key={c.id} className="border-t">
                      <td className="py-2 px-4">{c.id}</td>
                      <td className="py-2 px-4">{c.subject}</td>
                      <td className="py-2 px-4">{c.attendant.name}</td>
                      <td className="py-2 px-4">
                        {c.client.name}
                        <br />
                        <small>{c.client.dni}</small>
                      </td>
                      <td className="py-2 px-4">{c.subject}</td>
                      <td className="py-2 px-4">{c.subject}</td>
                      <td className="py-2 px-4">{c.subject}</td>
                      <td className="py-2 px-4">{c.subject}</td>
                      <td className="py-2 px-4 flex gap-3">
                        <button
                          onClick={() => handleEdit(c)}
                          className="text-blue-500"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => onDelete(c.id)}
                          className="text-red-500"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {isEditing && (
          <FormCreateJuridicalCase
            handleBack={() => {
              setIsEditing(false);
            }}
            handleSave={handleSave}
          />
        )}
      </div>
    </div>
  );
};

export default CasesModal;
