import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true, // Enable global APIs like describe and tests
        environment: 'node', // Use 'jsdom' if testing browser-related code
        exclude: ['dist', 'node_modules'], // Exclude these folders
    },
});
