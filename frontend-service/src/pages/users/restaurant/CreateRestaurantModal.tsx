import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface CreateRestaurantModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: { name: string; address: string; location: string; image: File | null };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const CreateRestaurantModal: React.FC<CreateRestaurantModalProps> = ({
  isOpen,
  onClose,
  form,
  onChange,
  onSubmit,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
                <Dialog.Title className="text-lg font-bold leading-6 text-purple-600">
                  Create New Restaurant
                </Dialog.Title>

                <form className="mt-4 space-y-4" onSubmit={onSubmit}>
                  {/* Input fields */}
                  {["name", "address", "location"].map((field) => (
                    <div key={field}>
                      <label className="block text-sm font-medium text-gray-700 capitalize">{field}</label>
                      <input
                        type="text"
                        name={field}
                        required
                        value={(form as any)[field]}
                        onChange={onChange}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={onChange}
                      className="w-full px-3 py-2 mt-1 text-gray-700"
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="ml-3 px-5 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateRestaurantModal;
