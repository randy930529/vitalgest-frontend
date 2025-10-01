"use client";

import { cloneElement, ReactElement, useState } from "react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "./button";
import Modal from "./modal";

export default function ModalTrigger({
  title,
  modelContent,
}: {
  title: string;
  modelContent: ReactElement<{ onClose: () => void }>;
}) {
  const [showModal, setShowModal] = useState(false);

  const childModalContent = cloneElement(modelContent, {
    onClose: () => setShowModal(false),
  });

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
      >
        <PlusIcon className="w-5 h-5 me-2" />
        {title}
      </Button>
      <Modal
        title={title}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        {childModalContent || ""}
      </Modal>
    </>
  );
}
