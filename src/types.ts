export interface Options {
  /**
   * The name of your app.
   * This'll be where you import modules from.
   *
   * if name is 'my-app', then:
   *
   * import { foo } from 'my-app';
   */
  name: string;
  /**
   * Command forwarded to ember-cli
   */
  command: string;
  /**
   * Which ember-source and ember-cli version to use.
   * These will always be in lock-step for buttered projects.
   */
  emberVersion: string;
  cacheName: string;
  dependencies: Record<string, string>;
  removeDependencies: string[];
  /**
   * Overlay the files at the template target on top of
   * the buttered project. This can be useful for generating
   * projects with the same look and feel.
   *
   * example:
   *   templateOverlay: path.join(__dirname, 'app-template'),
   */
  template: string | null;
  outputPath: string | null;
  /**
   * Which port to run the ember server on
   */
  port: number | null;
  /**
   * Which environment to start or build the project on
   */
  environment: 'development' | 'production';

  /**
   * Path to local files for the end user.
   * These are applied *after* the template.
   */
  localFiles: string;
}
