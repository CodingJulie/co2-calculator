import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import React from 'react';

afterEach(() => {
    cleanup();
});

class MockResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}

global.ResizeObserver = MockResizeObserver as typeof ResizeObserver;

vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
            React.createElement('div', props, children),
        button: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
            React.createElement('button', props, children),
        span: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
            React.createElement('span', props, children),
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) =>
        React.createElement(React.Fragment, null, children),
}));

Object.defineProperty(window, 'scrollTo', { value: vi.fn(), writable: true });
Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
