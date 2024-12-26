import { Attendant } from "@/hooks/use-authentication-service";
import Client from "@/models/client";
import { AxiosInstance } from "axios";

export class JuridicalCase {
  id: number;
  subject: string;
  client_id: number;
  client: Client;
  attendant: Attendant;

  constructor(
    id: number,
    subject: string,
    client_id: number,
    client: Client,
    attendant: Attendant
  ) {
    this.id = id;
    this.subject = subject;
    this.client_id = client_id;
    this.client = client;
    this.attendant = attendant;
  }

}

export default class HttpJuridicalCaseService {
  private httpClient: AxiosInstance;
  private static instance: HttpJuridicalCaseService;

  private constructor(httpClient: AxiosInstance) {
    this.httpClient = httpClient;
  }

  public static getInstance(httpClient: AxiosInstance): HttpJuridicalCaseService {
    if (!this.instance) {
      this.instance = new HttpJuridicalCaseService(httpClient);
    }
    return this.instance;
  }

  // Obtiene los casos jurídicos de un abogado
  public async getJuridicalCases(
    attendantId: number,
  ): Promise<JuridicalCase[]> {
    const response = await this.httpClient.get<
      JuridicalCase[]
    >(`/attendants/${attendantId}/juridical_cases`);
    return response.data;
  }


  // Crea un nuevo caso jurídico y agrega una observación.
  // Recibe el id del abogado, el asunto, el id del cliente y la observación.
  // Retorna el caso jurídico creado.
  public async createJuridicalCase(
    attendantId: string,
    subject: string,
    clientId: number,
    observation: string,
  ): Promise<JuridicalCase> {
    const response = await this.httpClient.post<JuridicalCase>(`/attendants/${attendantId}/juridical_cases`, {
      subject,
      client_id: clientId,
    });
    const juridicalCase = response.data;
    await this.httpClient.post(`/attendants/${juridicalCase.attendant.id}/juridical_cases/${juridicalCase.id}/observations`, {
      attendant_id: juridicalCase.attendant.id,
      content: observation,
    });
    return juridicalCase;
  }


  // Agrega una observación al caso
  public async addObservation(juridicalCase: JuridicalCase, observation: string, attendantId: number): Promise<void> {
    await this.httpClient.post(`/attendants/${juridicalCase.attendant.id}/juridical_cases/${juridicalCase.id}/observations`, {
      attendant_id: attendantId,
      content: observation,
    });
  }


  // Elimina una observación del caso
  public async removeObservation(juridicalCase: JuridicalCase, observationId: number): Promise<void> {
    await this.httpClient.delete(`/attendants/${juridicalCase.attendant.id}/juridical_cases/${juridicalCase.id}/observations/${observationId}`);
  }


}
