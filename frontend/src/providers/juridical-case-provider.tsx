import useModuleShifts from "@/hooks/operator/use-module-shifts";
import useAuth from "@/hooks/use-auth";
import useJuridicalCaseService from "@/hooks/use-juridical-case-service";
import { JuridicalCase } from "@/services/juridical-case-service";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const JuridicalCaseContext = createContext<{
  juridicalCases: JuridicalCase[],
  addObservation: (juridicalCase: JuridicalCase, observation: string, attendantId: number) => Promise<void>,
  createJuridicalCase: (subject: string, observation: string) => Promise<void>,
}>({
  juridicalCases: [],
  addObservation: async () => { },
  createJuridicalCase: async () => { },

})

const JuridicalCaseProvider: React.FC<{
  children: ReactNode,
}> = ({

  children,
}) => {
    const [juridicalCases, setJuridicalCases] = useState<JuridicalCase[]>([]);
    // =================================================================

    const juridicalService = useJuridicalCaseService();

    // =================================================================

    // =================================================================

    const { currentShift } = useModuleShifts();

    // =================================================================

    const { attendant } = useAuth()

    // =================================================================

    useEffect(() => {

      const fetchJuridicalCases = async (attendantId: number) => {
        const juridicalCases = await juridicalService.getJuridicalCases(attendantId);
        setJuridicalCases(juridicalCases);
      }
      if (attendant) {
        fetchJuridicalCases(attendant.id)
      }
    }, [attendant, juridicalService]);

    // =================================================================

    const handleAddObservation = async (juridicalCase: JuridicalCase, observation: string, attendantId: number) => {
      return juridicalService.addObservation(juridicalCase, observation, attendantId);
    }

    const handleCreateJuridicalCase = async (subject: string, observation: string): Promise<void> => {
      // if (currentShift === undefined) {
      //   toast.error("No hay un cliente en atención")
      //   return;
      // }
      // if (attendant === null) {
      //   toast.error("No hay un funcionario en el modulo");
      //   return;
      // }
      const juridicalCase = await juridicalService.createJuridicalCase(
        "17",
        subject,
        100,
        observation,
      )

      setJuridicalCases([
        juridicalCase,
        ...juridicalCases,
      ])

      return;

    }


    // =================================================================
    return (
      <JuridicalCaseContext.Provider value={{
        juridicalCases,
        addObservation: handleAddObservation,
        createJuridicalCase: handleCreateJuridicalCase
      }}>

        {children}

      </JuridicalCaseContext.Provider>
    )
  }

export function useJuridicalCaseResource() {
  const context = useContext(JuridicalCaseContext);
  if (!context) {
    throw new Error("useJuridicalCaseResource must be used within a JuridicalCaseProvider")
  }
  return context;  // returns the context value

}

export default JuridicalCaseProvider;
