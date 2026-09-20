import './section-title.scss';

export function sectionTitleHtml(id: string, content: string): string {
  return `<h2 class="section-title" id="${id}">${content}</h2>`;
}
