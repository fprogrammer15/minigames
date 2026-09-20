import './responsive-text.scss';

export enum ShortTextFrom {
  Tablet = 'tablet',
  Mobile = 'mobile',
}

// The mockup uses shorter texts on small screens, for example "Games Played" => "Games"
export function responsiveTextHtml(full: string, short: string, from: ShortTextFrom): string {
  return `
    <span class="responsive-text responsive-text--${from}">
      <span class="responsive-text__full">${full}</span>
      <span class="responsive-text__short">${short}</span>
    </span>
  `;
}
