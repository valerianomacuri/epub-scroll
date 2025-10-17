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
    return this.mapNavItems(navigation.toc);
  }

  /**
   * Get chapter content by href
   */
  async getChapterContent(href: string): Promise<ChapterContent> {
    if (!this.book) throw new Error('Book not loaded');

    const section = this.book.spine.get(href);
    if (!section) throw new Error(`Chapter not found: ${href}`);

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

    // Procesar <link rel="stylesheet"> que apuntan a Blob
    const linkElements = $('link[rel="stylesheet"]');

    for (let i = 0; i < linkElements.length; i++) {
      const el = linkElements[i];
      const hrefAttr = $(el).attr('href');
      if (hrefAttr) {
        try {
          // Obtener CSS desde la URL (Blob o remoto)
          const res = await fetch(hrefAttr);
          let cssText = await res.text();

          // Remover !important
          cssText = cssText.replace(/\s*!important\s*/g, '');

          // Reemplazar el <link> por <style> con CSS limpio
          const styleEl = `<style>${cssText}</style>`;
          $(el).replaceWith(styleEl);
        } catch (err) {
          console.warn(`Error cargando CSS ${hrefAttr}:`, err);
          // opcional: eliminar link si falla
          $(el).remove();
        }
      }
    }

    const cleanHtml = $.html();

    return {
      id: section.idref || href,
      content: cleanHtml,
      href,
    };
  }

  /**
   * Get all spine items (chapters in reading order)
   */
  getSpineItems(): Array<{ href: string; index: number }> {
    if (!this.book) throw new Error('Book not loaded');

    const items: Array<{ href: string; index: number }> = [];
    this.book.spine.each((item: any, index: number) => {
      items.push({ href: item.href, index });
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
