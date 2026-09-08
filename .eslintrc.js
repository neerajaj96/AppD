module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-native'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'react/react-in-jsx-scope': 'off',
    'react/no-unescaped-entities': 'off',
    'react-native/no-inline-styles': 'warn',
    'no-restricted-syntax': [
      'warn',
      {
        selector: "Literal[value=/^#[0-9a-fA-F]{3,8}$/]",
        message: "Do not use hardcoded hex colors. Use Tailwind Guna classes (bg-avyakta-2, text-sattva, ...) backed by src/index.css, via getSystemAccent() in src/utils/theme.ts."
      }
    ]
  },
  overrides: [
    {
      files: ['src/theme/tokens.ts'],
      rules: {
        'no-restricted-syntax': 'off'
      }
    }
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  env: {
    'react-native/react-native': true,
  },
  ignorePatterns: ['node_modules/', 'dist/', 'build/']
};
