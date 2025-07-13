export function getBlogPreview(html: string): string {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  for (const node of Array.from(doc.body.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      return node.textContent.trim();
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      if ((node as HTMLElement).tagName === "IMG") continue;
      const text = (node as HTMLElement).textContent?.trim();
      if (text) return text;
    }
  }
  return "";
}
