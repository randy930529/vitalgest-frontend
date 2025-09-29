import { useState } from "react";
import Modal from "@/app/ui/modal";
import { Button } from "@/app/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import UserForm from "@/app/ui/dashboard/users/create/user-form";

export default function OpenCreateUser() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Button
        onClick={() => setShowModal(true)}
        className="text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
      >
        <PlusIcon className="w-5 h-5 me-2" />
        Crear Usuario
      </Button>
      <Modal
        title="Crear Usuario"
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <UserForm />
      </Modal>
    </>
  );
}
