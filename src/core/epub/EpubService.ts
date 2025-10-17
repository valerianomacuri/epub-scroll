import * as cheerio from 'cheerio';
/**
 * EPUB Service - Dependency Inversion Principle
 * Abstract away epub.js implementation details
 * Single Responsibility: Handle EPUB parsing and content extraction
 */

import ePub, { Book, NavItem } from 'epubjs';
import type {
  EpubMetadata,
  TocItem,
  ChapterContent,
} from '../types/epub.types';
import Section from 'epubjs/types/section';

export class EpubService {
  private book: Book | null = null;

  /**
   * Load EPUB from file
   * @param file - EPUB file from input
   */
  async loadFromFile(file: File): Promise<void> {
    const arrayBuffer = await file.arrayBuffer();
    this.book = ePub(arrayBuffer);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await this.book.ready;
  }

  /**
   * Extract metadata from loaded book
   */
  async getMetadata(): Promise<EpubMetadata> {
    if (!this.book) throw new Error('Book not loaded');

    const metadata = await this.book.loaded.metadata;

    return {
      title: metadata.title || 'Unknown Title',
      creator: metadata.creator || 'Unknown Author',
      description: metadata.description,
      language: metadata.language,
      publisher: metadata.publisher,
      pubdate: metadata.pubdate,
    };
  }

  /**
   * Get table of contents
   */
  async getToc(): Promise<TocItem[]> {
    if (!this.book) throw new Error('Book not loaded');

    const navigation = await this.book.loaded.navigation;
    console.log({ navigation });
    const tocItems = this.mapNavItems(navigation.toc);
    return tocItems;
  }

  /**
   * Get chapter content by href
   */
  async getChapterContent({
    href,
    idref,
  }: {
    href: string;
    idref: string;
  }): Promise<ChapterContent> {
    console.log({ idref, href });
    if (!this.book) throw new Error('Book not loaded');

    let section: Section | null = null;

    if (href) {
      section = this.book.spine.get(href);
    }

    if (!section && idref) {
      section = this.book.spine.get(idref);
    }

    if (!section) {
      throw new Error(`Chapter not found: ${href || idref}`);
    }

    const content = await section.render(this.book.load.bind(this.book));
    const htmlContent = content as string;

    const $ = cheerio.load(htmlContent);

    // Selecciona todos los <a> sin href
    $('a:not([href])').each(function () {
      const inner = $(this).html();
      if (inner !== null) {
        $(this).replaceWith(inner);
      } else {
        // Si no hay contenido interior, simplemente lo eliminamos
        $(this).remove();
      }
    });

    $('pre').each((i, el) => {
      const $el = $(el);
      // Añade atributo estándar y clase reconocida por traductores
      $el.attr('translate', 'no');
      // clase 'notranslate' la reconoce Google Translate y otros
      const existing = $el.attr('class') || '';
      if (!existing.split(/\s+/).includes('notranslate')) {
        $el.attr('class', (existing + ' notranslate').trim());
      }
    });

    $('code').each((i, el) => {
      const $el = $(el);
      // Añade atributo estándar y clase reconocida por traductores
      $el.attr('translate', 'no');
      // clase 'notranslate' la reconoce Google Translate y otros
      const existing = $el.attr('class') || '';
      if (!existing.split(/\s+/).includes('notranslate')) {
        $el.attr('class', (existing + ' notranslate').trim());
      }
    });

    // Selecciona todas las etiquetas <sup> que están vacías
    $('sup:empty').each((i, el) => {
      const $sup = $(el);
      const $nextElement = $sup.next();

      // Comprueba si el siguiente elemento es un <a> Y si tiene el atributo correcto
      if (
        $nextElement.is('a') &&
        $nextElement.attr('data-type') === 'noteref'
      ) {
        // Si cumple ambas condiciones, mueve el <a> dentro del <sup>
        $sup.append($nextElement);
      }
    });

    const cleanHtml = $.html();
    return {
      idref: section.idref,
      href: section.href,
      content: cleanHtml,
    };
  }

  /**
   * Get all spine items (chapters in reading order)
   */
  getSpineItems(): Array<{ href: string; idref: string }> {
    if (!this.book) throw new Error('Book not loaded');

    const items: Array<{ href: string; idref: string }> = [];
    this.book.spine.each((item) => {
      items.push({ href: item.href, idref: item.idref });
    });
    return items;
  }

  /**
   * Destroy book instance and free memory
   */
  destroy(): void {
    if (this.book) {
      this.book.destroy();
      this.book = null;
    }
  }

  /**
   * Map epub.js NavItem to our TocItem type
   */
  private mapNavItems(items: NavItem[]): TocItem[] {
    return items.map((item) => ({
      id: item.id || item.href,
      label: item.label,
      href: item.href,
      subitems: item.subitems ? this.mapNavItems(item.subitems) : undefined,
    }));
  }
}
