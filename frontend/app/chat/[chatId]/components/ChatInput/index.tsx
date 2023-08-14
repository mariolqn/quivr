"use client";
import { useTranslation } from "react-i18next";

import Button from "@/lib/components/ui/Button";

import { ChatBar } from "./components/ChatBar/ChatBar";
import { ConfigurationProvider } from "./components/ChatBar/ConfigurationProvider/ConfigurationProvider";
import { ConfigModal } from "./components/ConfigModal";
import { MicButton } from "./components/MicButton/MicButton";
import { useChatInput } from "./hooks/useChatInput";

export const ChatInput = (): JSX.Element => {
  const { setMessage, submitQuestion, chatId, generatingAnswer } =
    useChatInput();
  const { t } = useTranslation(["chat"]);

  return (
    <form
      data-testid="chat-input-form"
      onSubmit={(e) => {
        e.preventDefault();
        submitQuestion();
      }}
      className="sticky flex items-star bottom-0 bg-white dark:bg-black w-full flex justify-center gap-2 z-20"
    >
      <div className="flex flex-1 flex-col items-center">
        <ConfigurationProvider>
          <ChatBar />
        </ConfigurationProvider>
      </div>

      <Button
        className="px-3 py-2 sm:px-4 sm:py-2"
        type="submit"
        isLoading={generatingAnswer}
        data-testid="submit-button"
      >
        {generatingAnswer
          ? t("thinking", { ns: "chat" })
          : t("chat", { ns: "chat" })}
      </Button>
      <div className="flex items-center">
        <MicButton setMessage={setMessage} />
        <ConfigModal chatId={chatId} />
      </div>
    </form>
  );
};
