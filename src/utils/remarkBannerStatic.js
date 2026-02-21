function buildBannerHtml(title, description, imagePath) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = escapeAttribute(imagePath);

  return `
<aside class="mt-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[#f9fafb]">
  <div class="grid gap-0 md:grid-cols-[200px_minmax(0,1fr)]">
    <img src="${safeImage}" alt="${safeTitle}" class="h-full w-full object-cover" loading="lazy" />
    <div class="space-y-3 p-5 md:p-6">
      <p class="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">Indywidualna porada</p>
      <h3 class="text-lg font-semibold leading-tight text-[var(--text)]">${safeTitle}</h3>
      <p class="text-sm leading-relaxed text-[var(--muted)]">${safeDescription}</p>
      <a href="/kontakt/" class="inline-flex rounded-full bg-[var(--accent)] px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:opacity-90">
        Skontaktuj się
      </a>
    </div>
  </div>
</aside>`.trim();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeAttribute(value) {
  return String(value).replaceAll('"', "&quot;");
}

function parseBannerStatic(value) {
  const pattern = /^\s*{%\s*bannerStatic\s+["“](.*?)["”]\s*,\s*["“](.*?)["”]\s*,\s*["“](.*?)["”]\s*%}\s*$/s;
  const match = value.match(pattern);
  if (!match) return null;
  return {
    title: match[1]?.trim() ?? "",
    description: match[2]?.trim() ?? "",
    imagePath: match[3]?.trim() ?? "",
  };
}

function transformNode(node) {
  if (!node || !Array.isArray(node.children)) return;

  node.children = node.children.flatMap((child) => {
    if (child?.type === "paragraph") {
      const rawText = (child.children ?? [])
        .filter((part) => part.type === "text")
        .map((part) => part.value)
        .join("")
        .trim();
      const parsed = parseBannerStatic(rawText);
      if (parsed) {
        return [{
          type: "html",
          value: buildBannerHtml(parsed.title, parsed.description, parsed.imagePath),
        }];
      }
    }

    transformNode(child);
    return [child];
  });
}

export default function remarkBannerStatic() {
  return (tree) => {
    transformNode(tree);
  };
}
