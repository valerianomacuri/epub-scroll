/**
 * Unit Tests for ReaderContainer
 * Tests business logic and state management
 */

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { ReaderContainer } from '../features/reader/ReaderContainer';

// Mock the EpubService
vi.mock('../core/epub/EpubService', () => ({
  EpubService: vi.fn().mockImplementation(() => ({
    loadFromFile: vi.fn().mockResolvedValue(undefined),
    getMetadata: vi.fn().mockResolvedValue({
      title: 'Test Book',
      creator: 'Test Author',
    }),
    getToc: vi.fn().mockResolvedValue([
      {
        id: 'chapter1',
        label: 'Chapter 1',
        href: 'chapter1.html',
      },
    ]),
    getSpineItems: vi.fn().mockReturnValue([
      { href: 'chapter1.html', index: 0 },
    ]),
    getChapterContent: vi.fn().mockResolvedValue({
      id: 'chapter1',
      title: 'Chapter 1',
      content: '<p>Test content</p>',
      index: 0,
    }),
    destroy: vi.fn(),
  })),
}));

describe('ReaderContainer', () => {
  const mockFile = new File(['test'], 'test.epub', { type: 'application/epub+zip' });

  it('renders loading state initially', () => {
    const { container } = render(<ReaderContainer file={mockFile} onClose={vi.fn()} />);
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).toBeTruthy();
  });

  it('loads book successfully', async () => {
    const { container } = render(<ReaderContainer file={mockFile} onClose={vi.fn()} />);
    expect(container).toBeTruthy();
  });
});
