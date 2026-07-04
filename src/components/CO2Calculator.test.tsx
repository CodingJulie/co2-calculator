import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { CO2Calculator } from './CO2Calculator';

const t = (key: string, options?: Record<string, unknown>) => {
    if (options && 'co2' in options) return `${key}:${options.co2}`;
    if (options && 'count' in options) return `${key}:${options.count}`;
    if (options && 'avg' in options) return `${key}:${options.avg}`;
    if (options && 'period' in options) return `${key}:${options.period}`;
    return key;
};

const createQueryMock = (data: unknown[] = [], error: unknown = null) => {
    const finalPromise = Promise.resolve({ data, error });

    const query: Record<string, unknown> = {
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        then: finalPromise.then.bind(finalPromise),
        catch: finalPromise.catch.bind(finalPromise),
    };

    return query;
};

const mockSupabase = {
    auth: {
        getUser: vi.fn(),
    },
    from: vi.fn(),
};

const originalError = console.error;
console.error = (...args: unknown[]) => {
    if (
        typeof args[0] === 'string' &&
        (args[0].includes('act(...)') ||
            args[0].includes('AnimatePresence') ||
            args[0].includes('not wrapped in act') ||
            args[0].includes('ResizeObserver'))
    ) {
        return;
    }
    originalError(...args);
};

describe('CO2Calculator', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockSupabase.auth.getUser.mockResolvedValue({
            data: { user: { id: '123' } },
        });
    });

    it('отображает форму и добавляет запись', async () => {
        const user = userEvent.setup();

        const mockSingle = vi.fn().mockResolvedValue({
            data: {
                id: 'new-1',
                user_id: '123',
                category: 'transport',
                activity: 'car_petrol',
                value: 50,
                co2e: 10,
                date: new Date().toISOString().split('T')[0],
                created_at: new Date().toISOString(),
            },
            error: null,
        });
        const mockInsert = vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({ single: mockSingle }),
        });
        const query = createQueryMock([], null);
        query.insert = mockInsert;

        mockSupabase.from.mockReturnValue(query);

        render(<CO2Calculator supabase={mockSupabase} t={t} />);

        await waitFor(() => {
            expect(screen.getByText('carbon_footprint_calculator')).toBeInTheDocument();
        });

        const valueInput = screen.getByDisplayValue('10');
        await user.clear(valueInput);
        await user.type(valueInput, '50');

        const addButton = screen.getByRole('button', { name: /add/i });
        await user.click(addButton);

        await waitFor(() => {
            expect(mockInsert).toHaveBeenCalled();
        });
    });

    it('показывает статистику', async () => {
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

        const mockEntries = [
            {
                id: '1',
                co2e: 100,
                category: 'transport',
                activity: 'car_petrol',
                value: 10,
                date: today,
                user_id: '123',
                created_at: new Date().toISOString(),
            },
            {
                id: '2',
                co2e: 200,
                category: 'food',
                activity: 'beef',
                value: 5,
                date: yesterday,
                user_id: '123',
                created_at: new Date(Date.now() - 86400000).toISOString(),
            },
        ];

        const query = createQueryMock(mockEntries, null);
        mockSupabase.from.mockReturnValue(query);

        render(<CO2Calculator supabase={mockSupabase} t={t} />);

        await waitFor(() => {
            const elements = screen.getAllByText((content) => content.includes('300.0'));
            expect(elements.length).toBeGreaterThan(0);
        }, { timeout: 5000 });
    });

    it('удаляет запись', async () => {
        const user = userEvent.setup();

        const mockEqFn = vi.fn().mockResolvedValue({ error: null });
        const mockDeleteFn = vi.fn().mockReturnValue({
            eq: mockEqFn,
        });

        const today = new Date().toISOString().split('T')[0];
        const mockEntries = [{
            id: '1',
            co2e: 10,
            category: 'transport',
            activity: 'car_petrol',
            value: 1,
            date: today,
            user_id: '123',
            created_at: new Date().toISOString(),
        }];

        const query = createQueryMock(mockEntries, null);
        query.delete = mockDeleteFn;

        mockSupabase.from.mockReturnValue(query);

        render(<CO2Calculator supabase={mockSupabase} t={t} />);

        await waitFor(() => {
            const totalElement = document.querySelector('.text-6xl.font-bold.text-emerald-600');
            expect(totalElement).toBeInTheDocument();
            expect(totalElement?.textContent).toContain('10.0');
        }, { timeout: 5000 });

        const allButtons = screen.getAllByRole('button');
        const deleteButton = allButtons.find(button =>
            button.querySelector('.text-red-500') !== null
        );

        expect(deleteButton).toBeDefined();
        if (deleteButton) {
            await user.click(deleteButton);
        }

        await waitFor(() => {
            expect(mockDeleteFn).toHaveBeenCalled();
        });

        expect(mockEqFn).toHaveBeenCalledWith('id', '1');
    });
});
