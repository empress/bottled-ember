export interface Options {
  /**
   * Which ember-source and ember-cli version to use.
   * These will always be in lock-step for buttered projects.
   */
  emberVersion: string;
  cacheName: string;
  deps: Record<string, string>;
  links: string[];
  noOverlay: boolean;
  /**
   * Overlay the files at the template target on top of
   * the buttered project. This can be useful for generating
   * projects with the same look and feel.
   *
   * example:
   *   templateOverlay: path.join(__dirname, 'app-template'),
   */
  templateOverlay: string;
  outputPath: string | null;
  /**
   * Which port to run the ember server on
   */
  port: number | null;
  /**
   * Which environment to start or build the project on
   */
  environment: 'development' | 'production';
}
