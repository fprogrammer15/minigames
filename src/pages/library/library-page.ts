import type { View } from '../../types/view';
import { html } from '../../utils/dom';

export function createLibraryPage(): View {
  const element = html(`
    <section class="library" aria-labelledby="library-title">
      <h1 class="library__title" id="library-title">Game Library</h1>
    </section>
  `);

  return { element };
}
