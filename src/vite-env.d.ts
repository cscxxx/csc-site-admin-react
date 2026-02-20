/// <reference types="vite/client" />

// CSS Modules 类型声明
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

// Less Modules 类型声明
declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

/** libheif-js (wasm-bundle) 无官方类型，仅声明使用到的 API */
declare module 'libheif-js/wasm-bundle' {
  interface HeifImage {
    get_width(): number;
    get_height(): number;
    display(imageData: ImageData, callback: (displayData: ImageData | null) => void): void;
  }
  interface HeifDecoder {
    decode(buffer: Uint8Array): HeifImage[];
  }
  const libheif: {
    HeifDecoder: new () => HeifDecoder;
  };
  export default libheif;
}

declare module 'turndown' {
  interface TurndownOptions {
    codeBlockStyle?: 'indented' | 'fenced';
    fence?: string;
  }
  interface TurndownRule {
    filter: string | string[] | ((node: HTMLElement) => boolean);
    replacement: (content: string, node: HTMLElement, options?: unknown) => string;
  }
  class TurndownService {
    constructor(options?: TurndownOptions);
    turndown(html: string | Node): string;
    addRule(key: string, rule: TurndownRule): TurndownService;
  }
  export default TurndownService;
}
