import './section-title.scss';

// h1 for a page title, h2 for a section title
export function sectionTitleHtml(id: string, content: string, tag: 'h1' | 'h2' = 'h2'): string {
  return `<${tag} class="section-title" id="${id}">${content}</${tag}>`;
}
