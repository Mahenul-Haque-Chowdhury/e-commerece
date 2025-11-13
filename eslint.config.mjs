import next from "eslint-config-next";

const eslintConfig = next.map((config) => {
  if (!config.ignores) return config;
  return {
    ...config,
    ignores: Array.from(
      new Set([
        ...config.ignores,
        "node_modules/**",
        "build/**",
      ])
    ),
  };
});

export default eslintConfig;
