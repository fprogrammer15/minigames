import { getErrorMessage, isAbortError } from '../../services/api-client';
import { showSnackbar, SnackbarType } from '../snackbar/snackbar';
import { errorBannerHtml, RETRY_SELECTOR } from '../status-message/status-message';

export interface AsyncContentOptions<T> {
  // The block that shows the skeleton, the data or the error banner
  container: HTMLElement;
  load: (signal: AbortSignal) => Promise<T>;
  renderSkeleton: () => string;
  // Renders the data or an empty state when there is nothing to show
  render: (data: T) => void;
  errorTitle: string;
  retrySuccessText: string;
}

// Loading flow for one block: skeleton => data / empty state / error banner with Retry
export class AsyncContent<T> {
  private readonly options: AsyncContentOptions<T>;
  private controller: AbortController | null = null;

  constructor(options: AsyncContentOptions<T>) {
    this.options = options;

    options.container.addEventListener('click', (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest(RETRY_SELECTOR)) {
        void this.load(true);
      }
    });
  }

  // Cancels the request, so an old response cannot replace newer content
  public abort(): void {
    this.controller?.abort();
    this.controller = null;
  }

  public async load(isRetry = false): Promise<void> {
    this.abort();

    const controller = new AbortController();
    const { container, renderSkeleton, render, errorTitle, retrySuccessText } = this.options;

    this.controller = controller;
    container.setAttribute('aria-busy', 'true');
    container.innerHTML = renderSkeleton();

    try {
      const data = await this.options.load(controller.signal);

      if (controller.signal.aborted) {
        return;
      }

      render(data);

      if (isRetry) {
        showSnackbar(retrySuccessText, SnackbarType.Success);
      }
    } catch (error) {
      if (controller.signal.aborted || isAbortError(error)) {
        return;
      }

      container.innerHTML = errorBannerHtml(errorTitle, getErrorMessage(error));
      showSnackbar(errorTitle, SnackbarType.Error);
    } finally {
      if (this.controller === controller) {
        container.removeAttribute('aria-busy');
      }
    }
  }
}
