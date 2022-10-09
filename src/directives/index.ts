/**
 * Configure and register global directives
 */
import type { App } from 'vue';
import { setupPermissionDirective } from './permission';

export function registerGlobDirectives(app: App) {
  setupPermissionDirective(app);
}
