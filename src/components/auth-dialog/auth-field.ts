import { iconHtml, IconName } from '../icon/icon';

export interface AuthField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'password';
  placeholder: string;
  autocomplete: string;
  icon: IconName;
  hasVisibilityToggle?: boolean;
}

function visibilityToggleHtml(inputId: string): string {
  return `
    <button
      class="auth-field__toggle"
      type="button"
      aria-label="Show password"
      aria-pressed="false"
      aria-controls="${inputId}"
      data-password-toggle
    >
      ${iconHtml(IconName.Visibility, 'auth-field__toggle-icon auth-field__toggle-icon--show')}
      ${iconHtml(IconName.VisibilityOff, 'auth-field__toggle-icon auth-field__toggle-icon--hide')}
    </button>
  `;
}

export function authFieldHtml(field: AuthField): string {
  return `
    <div class="auth-field">
      <label class="auth-field__label" for="${field.id}">${field.label}</label>
      <div class="auth-field__control">
        ${iconHtml(field.icon, 'auth-field__icon')}
        <input
          class="auth-field__input"
          id="${field.id}"
          name="${field.name}"
          type="${field.type}"
          placeholder="${field.placeholder}"
          autocomplete="${field.autocomplete}"
          required
        >
        ${field.hasVisibilityToggle ? visibilityToggleHtml(field.id) : ''}
      </div>
    </div>
  `;
}
