import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['**/*.test.js'],
        globals: true,
        environment: 'node',
        exclude: ['dist', 'node_modules', '**/__mocks__/**'],
        reporters: 'verbose',
        coverage: {
            reporter: ['html', 'lcov'],
        },
    },
});
