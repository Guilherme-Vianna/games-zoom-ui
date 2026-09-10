"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export type ToastableState = {
  error?: string;
  success?: string;
  /** quando false, o success vira um aviso (amarelo) em vez de sucesso */
  emailSent?: boolean;
  /** timestamp do submit — permite reagir mesmo com mensagem repetida */
  nonce?: number;
};

/**
 * Dispara um toast sempre que uma server action responde. Usa `nonce` para
 * reagir mesmo quando a mensagem e identica a anterior.
 */
export function useFormToast(state: ToastableState) {
  const lastNonce = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (state.nonce === undefined || state.nonce === lastNonce.current) return;
    lastNonce.current = state.nonce;

    if (state.error) {
      toast.error(state.error);
    } else if (state.success) {
      if (state.emailSent === false) toast.warning(state.success);
      else toast.success(state.success);
    }
  }, [state]);
}
