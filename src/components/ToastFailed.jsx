import { Toast, ToastToggle } from "flowbite-react";
import { HiExclamation } from "react-icons/hi";

export default function ToastFailed({ error }) {
  return (
    <div className="flex w-full justify-end pe-25">
      <Toast className="bg-red-500 text-white">
      <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-500 dark:bg-range-500">
        <HiExclamation className="h-5 w-5" />
      </div>
      <div className="ml-3 text-sm font-normal">{error}</div>
      <ToastToggle />
      </Toast>
    </div>
  );
}
