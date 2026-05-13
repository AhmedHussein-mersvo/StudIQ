export type FileTypePresentation = {
  iconName: string;
  color: string;
};

const defaultPresentation: FileTypePresentation = {
  iconName: 'insert-drive-file',
  color: '#94A3B8',
};

const byExtension: Array<{
  suffixes: string[];
  presentation: FileTypePresentation;
}> = [
  {
    suffixes: ['.pdf'],
    presentation: { iconName: 'picture-as-pdf', color: '#EF4444' },
  },
  {
    suffixes: ['.doc', '.docx'],
    presentation: { iconName: 'article', color: '#2563EB' },
  },
  {
    suffixes: ['.ppt', '.pptx'],
    presentation: { iconName: 'slideshow', color: '#EA580C' },
  },
  {
    suffixes: ['.xls', '.xlsx'],
    presentation: { iconName: 'table-chart', color: '#16A34A' },
  },
];

const mimeHints: Array<{
  includes: string;
  presentation: FileTypePresentation;
}> = [
  { includes: 'pdf', presentation: byExtension[0].presentation },
  {
    includes: 'wordprocessing',
    presentation: byExtension[1].presentation,
  },
  { includes: 'msword', presentation: byExtension[1].presentation },
  {
    includes: 'presentation',
    presentation: byExtension[2].presentation,
  },
  { includes: 'powerpoint', presentation: byExtension[2].presentation },
  { includes: 'spreadsheet', presentation: byExtension[3].presentation },
  { includes: 'excel', presentation: byExtension[3].presentation },
];

export function getFileTypePresentation(
  fileName: string | undefined | null,
  mimeType?: string | null,
): FileTypePresentation {
  const mime = mimeType?.toLowerCase() ?? '';
  for (const { includes, presentation } of mimeHints) {
    if (mime.includes(includes)) {
      return presentation;
    }
  }

  const lower = fileName?.toLowerCase() ?? '';
  for (const { suffixes, presentation } of byExtension) {
    if (suffixes.some(s => lower.endsWith(s))) {
      return presentation;
    }
  }

  return defaultPresentation;
}
