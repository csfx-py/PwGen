import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordOption } from '../models/Password';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class AppComponent {
  password: string = '';
  passwordLength: number = 12;
  showCopied: boolean = false;

  passwordOptions: PasswordOption[] = [
    {
      id: 1,
      label: 'Letters',
      enabled: true,
      chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    },
    { id: 2, label: 'Numbers', enabled: false, chars: '0123456789' },
    {
      id: 3,
      label: 'Symbols',
      enabled: false,
      chars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    },
  ];

  isValidConfig = computed(() =>
    this.passwordOptions.some((opt) => opt.enabled)
  );

  updateLength(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    const parsed = parseInt(value);
    if (!isNaN(parsed)) {
      this.passwordLength = Math.min(Math.max(parsed, 4), 64);
      (event.target as HTMLInputElement).value = this.passwordLength.toString();
    }
  }

  updateOptionEnabled(id: number, enabled: boolean) {
    this.passwordOptions = this.passwordOptions.map((opt) =>
      opt.id === id ? { ...opt, enabled } : opt
    );
  }

  generatePassword() {
    const options = this.passwordOptions;
    const enabledOptions = options.filter((opt) => opt.enabled);

    if (enabledOptions.length === 0) return;

    // create an initial password with at least one character from all enabled options, then fill the rest with random characters from all enabled options
    let password = enabledOptions
      .map((opt) => opt.chars[Math.floor(Math.random() * opt.chars.length)])
      .join('');

    const remainingLength = this.passwordLength - password.length;

    for (let i = 0; i < remainingLength; i++) {
      const randomOption =
        enabledOptions[Math.floor(Math.random() * enabledOptions.length)];
      password +=
        randomOption.chars[
          Math.floor(Math.random() * randomOption.chars.length)
        ];
    }

    const shuffled = password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');

    this.password = shuffled;
  }

  async copyToClipboard() {
    if (!this.password) return;

    await navigator.clipboard.writeText(this.password);
    this.showCopied = true;
    setTimeout(() => (this.showCopied = false), 2000);
  }
}
