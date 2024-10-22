"use client";

import { useEffect, useState } from "react";

import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = () => {
     const [isMounted, setIsMounted] = useState(false);

     useEffect(() => {
          setIsMounted(true);
     }, []);

     if (!isMounted) return null;

     return (
          <>
               <StoreModal />
          </>
     );
};

// useEffect to avoid hydration errors - https://nextjs.org/docs/messages/react-hydration-error
// (using client components -ModalProvider- into server components -layout.tsx- might raise unexpected errors)
// while modal is not mounted, it will return null, and once it is mounted, it will return the children components.
