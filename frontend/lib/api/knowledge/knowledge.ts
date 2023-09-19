import { AxiosInstance } from "axios";
import { UUID } from "crypto";

import { Knowledge } from "@/lib/types/Knowledge";

export type GetAllKnowledgeInputProps = {
  brainId: UUID;
};

export const getAllKnowledge = async (
  { brainId }: GetAllKnowledgeInputProps,
  axiosInstance: AxiosInstance
): Promise<Knowledge[]> => {
  const response = await axiosInstance.get<{
    knowledges: Knowledge[];
  }>(`/knowledge?brain_id=${brainId}`);

  return response.data.knowledges;
};

export const deleteKnowledge = async (
  knowledge_id: UUID,
  axiosInstance: AxiosInstance
): Promise<void> => {
  await axiosInstance.delete(`/knowledge/${knowledge_id}`);
};
