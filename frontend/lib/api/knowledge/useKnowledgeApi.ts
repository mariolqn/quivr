import { UUID } from "crypto";

import { useAxios } from "@/lib/hooks";

import {
  deleteKnowledge,
  getAllKnowledge,
  GetAllKnowledgeInputProps,
} from "./knowledge";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useKnowledgeApi = () => {
  const { axiosInstance } = useAxios();

  return {
    getAllKnowledge: async (props: GetAllKnowledgeInputProps) =>
      getAllKnowledge(props, axiosInstance),
    deleteKnowledge: async (knowledge_id: UUID) =>
      deleteKnowledge(knowledge_id, axiosInstance),
  };
};
