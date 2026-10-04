import './not-found-page.scss';
import { ButtonSize, linkButtonHtml } from '../../components/button/button';
import { AppRoute } from '../../types/routes';
import type { View } from '../../types/view';
import { escapeHtml, html } from '../../utils/dom';

export function createNotFoundPage(): View {
  const element = html(`
    <section class="not-found" aria-labelledby="not-found-title">
      <div class="not-found__container">
        <p class="not-found__code" aria-hidden="true">404</p>
        <h1 class="not-found__title" id="not-found-title">Page Not Found</h1>
        <p class="not-found__text">
          The page <span class="not-found__path">${escapeHtml(location.pathname)}</span>
          does not exist or has been moved.
        </p>
        ${linkButtonHtml({
          text: 'Return to Home Page',
          href: AppRoute.Home,
          size: ButtonSize.Large,
          className: 'not-found__button',
        })}
      </div>
    </section>
  `);

  return { element };
}
