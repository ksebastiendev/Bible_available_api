import { ApiError } from "@/lib/types/api";

interface ApiErrorMessageOptions {
  actionLabel: string;
  invalidHint?: string;
  notFoundHint?: string;
}

function extractApiDetail(details: unknown): string | null {
  if (!details) {
    return null;
  }

  if (typeof details === "string") {
    return details;
  }

  if (typeof details === "object") {
    const payload = details as { message?: string | string[] };

    if (Array.isArray(payload.message)) {
      return payload.message.join(" ");
    }

    if (typeof payload.message === "string") {
      return payload.message;
    }
  }

  return null;
}

export function toApiErrorMessage(error: ApiError, options: ApiErrorMessageOptions): string {
  const detail = extractApiDetail(error.details);

  if (error.status === 400) {
    const base = options.invalidHint
      ? `Saisie invalide pour ${options.actionLabel}. ${options.invalidHint}`
      : `Saisie invalide pour ${options.actionLabel}. Verifiez le format.`;

    return detail ? `${base} Detail: ${detail}` : base;
  }

  if (error.status === 404) {
    const base = options.notFoundHint
      ? options.notFoundHint
      : `Aucun resultat trouve pour ${options.actionLabel}.`;

    return detail ? `${base} Detail: ${detail}` : base;
  }

  if (error.status >= 500) {
    return "Le serveur est indisponible pour le moment. Reessayez dans quelques instants.";
  }

  return detail
    ? `Erreur API (${error.status}) pendant ${options.actionLabel}. Detail: ${detail}`
    : `Erreur API (${error.status}) pendant ${options.actionLabel}.`;
}

export function toUnexpectedErrorMessage(actionLabel: string): string {
  return `Erreur inattendue pendant ${actionLabel}. Verifiez votre connexion puis reessayez.`;
}
