import googleIconUrl from '../../assets/icons/google.svg';
import { AuthMode } from '../../types/auth';
import { AppRoute } from '../../types/routes';
import { buttonHtml, ButtonSize } from '../button/button';
import { IconName } from '../icon/icon';
import { type AuthField, authFieldHtml } from './auth-field';

interface AuthPanel {
  mode: AuthMode;
  title: string;
  subtitle: string;
  fields: AuthField[];
  submitText: string;
  googleText: string;
  hasForgotLink: boolean;
  switchText: string;
  switchLabel: string;
  switchTo: AuthMode;
}

const PANELS: AuthPanel[] = [
  {
    mode: AuthMode.Login,
    title: 'Welcome Back!',
    subtitle: 'Sign in to resume your games and progress.',
    fields: [
      {
        id: 'login-email',
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'e.g. alex@minigames.com',
        autocomplete: 'email',
        icon: IconName.Mail,
      },
      {
        id: 'login-password',
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: '••••••••',
        autocomplete: 'current-password',
        icon: IconName.Lock,
        hasVisibilityToggle: true,
      },
    ],
    submitText: 'Login',
    googleText: 'Continue with Google',
    hasForgotLink: true,
    switchText: "Don't have an account?",
    switchLabel: 'Register',
    switchTo: AuthMode.Register,
  },
  {
    mode: AuthMode.Register,
    title: 'Create Account',
    subtitle: 'Join MiniGames to track your score &amp; streak.',
    fields: [
      {
        id: 'register-username',
        name: 'username',
        label: 'Username',
        type: 'text',
        placeholder: 'e.g. CozyGamer_99',
        autocomplete: 'username',
        icon: IconName.Person,
      },
      {
        id: 'register-email',
        name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'your.email@domain.com',
        autocomplete: 'email',
        icon: IconName.Mail,
      },
      {
        id: 'register-password',
        name: 'password',
        label: 'Password',
        type: 'password',
        placeholder: 'Min. 8 characters',
        autocomplete: 'new-password',
        icon: IconName.Lock,
      },
      {
        id: 'register-confirm-password',
        name: 'confirmPassword',
        label: 'Confirm Password',
        type: 'password',
        placeholder: 'Repeat your password',
        autocomplete: 'new-password',
        icon: IconName.Lock,
      },
    ],
    submitText: 'Create Account',
    googleText: 'Sign up with Google',
    hasForgotLink: false,
    switchText: 'Already have an account?',
    switchLabel: 'Login',
    switchTo: AuthMode.Login,
  },
];

function panelHtml(panel: AuthPanel): string {
  const forgotLink = panel.hasForgotLink
    ? `<a class="auth-dialog__link auth-dialog__link--forgot" href="${AppRoute.Home}" data-link>Forgot Password?</a>`
    : '';

  return `
    <div
      class="auth-dialog__panel"
      id="auth-panel-${panel.mode}"
      role="tabpanel"
      aria-labelledby="auth-tab-${panel.mode}"
      data-auth-panel="${panel.mode}"
      hidden
    >
      <div class="auth-dialog__heading">
        <h2 class="auth-dialog__title">${panel.title}</h2>
        <p class="auth-dialog__subtitle">${panel.subtitle}</p>
      </div>

      <form class="auth-dialog__form" novalidate>
        <div class="auth-dialog__fields">
          ${panel.fields.map((field) => authFieldHtml(field)).join('')}
          ${forgotLink}
        </div>

        <div class="auth-dialog__actions">
          ${buttonHtml({
            text: panel.submitText,
            size: ButtonSize.Large,
            className: 'auth-dialog__submit',
            type: 'submit',
          })}
          <p class="auth-dialog__divider">or</p>
          <button class="auth-dialog__google" type="button">
            <img class="auth-dialog__google-icon" src="${googleIconUrl}" alt="" width="18" height="18">
            ${panel.googleText}
          </button>
        </div>
      </form>

      <p class="auth-dialog__footer">
        ${panel.switchText}
        <button class="auth-dialog__link" type="button" data-auth="${panel.switchTo}">
          ${panel.switchLabel}
        </button>
      </p>
    </div>
  `;
}

export function authPanelsHtml(): string {
  return PANELS.map((panel) => panelHtml(panel)).join('');
}
