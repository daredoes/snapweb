import { atom, useAtom } from "jotai";
import React from "react";

type ModalTypes =
  // GLOBALS
  "SETTINGS" | "ABOUT" | "SWITCH_THEME" | "NAVIGATION_FORM" | "JSON_VIEWER";

const globalModal = atom<{
  [key in ModalTypes]?: boolean;
}>({});

type ModalHashes = "settings" | "about";

// To Add An Anchor For A Modal Link A Hash To A Modal Type, The Rest Is Handled
const ANCHOR_TO_MODAL: Record<ModalHashes, ModalTypes> = {
  settings: "SETTINGS",
  about: "ABOUT",
};

type ReverseMap<T extends Record<keyof T, keyof any>> = {
  [P in T[keyof T]]: {
    [K in keyof T]: T[K] extends P ? K : never;
  }[keyof T];
};

const MODAL_TO_ANCHOR: ReverseMap<typeof ANCHOR_TO_MODAL> = Object.entries(
  ANCHOR_TO_MODAL,
).reduce((rMap, [k, v]) => {
  rMap[v] = k;
  return rMap;
}, {} as any);

const useGlobalModal = () => {
  const [modal, setModal] = useAtom(globalModal);

  const functions = React.useMemo(() => {
    return {
      openModal: (key: ModalTypes) => {
        const hash = MODAL_TO_ANCHOR[key];
        if (hash) {
          if (typeof window !== undefined) {
            let search = "";
            if (window.location.hash.indexOf("?") !== -1) {
              search =
                "?" + window.location.hash.replace("#", "").split("?")[1];
            }
            window.location.hash = hash + search;
          }
        }
        return setModal((p) => ({ ...p, [key]: true }));
      },
      closeModal: (key: ModalTypes) => {
        const hash = MODAL_TO_ANCHOR[key];
        if (hash) {
          if (typeof window !== undefined) {
            window.history.pushState(null, "", " ");
          }
        }
        return setModal((p) => ({ ...p, [key]: false }));
      },
      resetModals: () => setModal({}),
      isOpen: (key: ModalTypes) => !!modal[key],
    };
  }, [modal, setModal]);

  const handleLoad = React.useCallback(() => {
    if (typeof window !== undefined) {
      const hash = window.location.hash
        .replace("#", "")
        .split("?")[0] as ModalHashes;
      try {
        const modalKey = ANCHOR_TO_MODAL[hash];
        if (modalKey) {
          if (!functions.isOpen(modalKey)) {
            functions.openModal(modalKey);
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [functions]);

  React.useEffect(() => {
    if (handleLoad) {
      handleLoad();
    }
  });

  return functions;
};

export { globalModal, useGlobalModal, MODAL_TO_ANCHOR, ANCHOR_TO_MODAL };
export type { ModalTypes, ModalHashes };
