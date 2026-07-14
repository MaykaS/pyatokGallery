"use client";

import { useActionState } from "react";

import { loginAdmin } from "@/app/admin/actions";
import type { Dictionary } from "@/lib/types";

type AdminLoginFormProps = {
  t: Dictionary;
};

const initialState = {
  error: "",
};

export function AdminLoginForm({ t }: AdminLoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <div className="space-y-2">
        <label className="ui-label" htmlFor="password">
          {t.password}
        </label>
        <input
          className="ui-input"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>

      {state.error ? (
        <p className="text-sm text-[var(--error-color)]">{t.incorrectPassword}</p>
      ) : null}

      <button className="ui-button w-full" disabled={isPending} type="submit">
        {t.enter}
      </button>
    </form>
  );
}
