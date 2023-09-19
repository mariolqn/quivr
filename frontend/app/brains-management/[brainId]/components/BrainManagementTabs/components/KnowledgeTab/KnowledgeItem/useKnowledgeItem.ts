"use client";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { useKnowledgeApi } from "@/lib/api/knowledge/useKnowledgeApi";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { useKnowledgeContext } from "@/lib/context/KnowledgeProvider/hooks/useKnowledgesContext";
import { useToast } from "@/lib/hooks";
import { Knowledge } from "@/lib/types/Knowledge";
import { useEventTracking } from "@/services/analytics/june/useEventTracking";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useKnowledgeItem = () => {
  const { deleteKnowledge } = useKnowledgeApi();
  const [isDeleting, setIsDeleting] = useState(false);
  const { publish } = useToast();
  const { track } = useEventTracking();
  const { currentBrain } = useBrainContext();
  const { setAllKnowledge } = useKnowledgeContext();
  const { t } = useTranslation(["translation", "explore"]);

  const onDeleteKnowledge = async (knowledge: Knowledge) => {
    setIsDeleting(true);
    void track("DELETE_DOCUMENT");
    try {
      if (currentBrain?.id === undefined) {
        throw new Error(t("noBrain", { ns: "explore" }));
      }
      await deleteKnowledge(knowledge.id);
      setAllKnowledge((knowledges) =>
        knowledges.filter((k) => k.id !== knowledge.id)
      ); // Optimistic update
      publish({
        variant: "success",
        text: t("deleted", {
          fileName: knowledge.name,
          brain: currentBrain.name,
          ns: "explore",
        }),
      });
    } catch (error) {
      publish({
        variant: "warning",
        text: t("errorDeleting", { fileName: knowledge.name, ns: "explore" }),
      });
      console.error(`Error deleting ${knowledge.name}`, error);
    }
    setIsDeleting(false);
  };

  return {
    isDeleting,
    onDeleteKnowledge,
  };
};
