"use client";

import { cloneElement, ReactElement, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "./button";
import Modal from "./modal";

export default function ModalTrigger({
  title,
  type,
  question,
  details,
  modelContent,
  buttonToggle,
}: {
  title: string;
  type?: "edit" | "delete" | "info";
  question?: string;
  details?: string;
  modelContent: ReactElement<{ onClose: () => void }>;
  buttonToggle?: ReactElement<{ onClose: () => void }>;
}) {
  const [showModal, setShowModal] = useState(false);

  const childModalContent = cloneElement(modelContent, {
    onClose: () => setShowModal(false),
  });

  const childButtonToggle =
    buttonToggle &&
    cloneElement(buttonToggle, {
      onClose: () => setShowModal(true),
    });

  return (
    <>
      {buttonToggle && childButtonToggle}

      {!buttonToggle && (
        <Button
          onClick={() => setShowModal(true)}
          className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
        >
          <PlusIcon className="w-5 h-5 me-2" />
          {title}
        </Button>
      )}

      <Modal
        title={title}
        type={type}
        question={question}
        details={details}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        {childModalContent || ""}
      </Modal>
    </>
  );
}
