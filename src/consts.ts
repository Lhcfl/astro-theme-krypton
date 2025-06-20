// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

import YAML from "js-yaml";
import ConfigText from "@data/theme-config.yml?raw";

const ThemeConfig = (() => {
  try {
    return YAML.load(ConfigText) as Record<string, any>;
  } catch (error) {
    console.error("Error loading theme config:", error);
    throw new Error(
      "Failed to load theme configuration. Please check your data/theme-config.yml file."
    );
  }
})();

function config<T>(key: string, valueType: T): T {
  if (key in ThemeConfig) {
    if (typeof ThemeConfig[key] !== typeof valueType) {
      throw new Error(
        `Type mismatch for key "${key}": expected ${typeof valueType}, got ${typeof ThemeConfig[
          key
        ]}, please check your "data/theme-config.yml"`
      );
    }
    return ThemeConfig[key] as T;
  }
  throw new Error(
    `Key "${key}" not found in theme config, please check your "data/theme-config.yml"`
  );
}

export const SITE_TITLE = config("title", "string");
export const SITE_DESCRIPTION = config("description", "string");
export const SITE_AUTHOR = config("author", "string");
