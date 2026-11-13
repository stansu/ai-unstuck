export async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy path.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  try {
    const copied = document.execCommand('copy');
    return copied;
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export function shareOrCopy(
  url: string,
  title: string,
  text: string,
): Promise<'shared' | 'copied' | 'cancelled' | 'failed'> {
  if (typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches) {
    return navigator
      .share({ title, text, url })
      .then(() => 'shared' as const)
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return 'cancelled' as const;
        return copyText(url).then((ok) => (ok ? 'copied' as const : 'failed' as const));
      });
  }

  return copyText(url).then((ok) => (ok ? 'copied' as const : 'failed' as const));
}
