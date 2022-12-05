interface Tokenizer {
    tokenize(text: string): string[];
}

declare class WordTokenizer implements Tokenizer {
    tokenize(text: string): string[];
}
declare class TreebankWordTokenizer implements Tokenizer {
    tokenize(text: string): string[];
}
interface RegexTokenizerOptions {
    pattern?: RegExp | undefined;
    discardEmpty?: boolean | undefined;
}
declare class RegexpTokenizer implements Tokenizer {
    constructor(options: RegexTokenizerOptions);
    tokenize(text: string): string[];
}
declare class OrthographyTokenizer implements Tokenizer {
    constructor(options: RegexTokenizerOptions & { language: string });
    tokenize(text: string): string[];
}
declare class WordPunctTokenizer implements Tokenizer {
    tokenize(text: string): string[];
}
declare class SentenceTokenizer implements Tokenizer {
    tokenize(text: string): string[];
}
declare class CaseTokenizer implements Tokenizer {
    tokenize(text: string, preserveApostrophy?: boolean): string[];
}
declare class AggressiveTokenizer implements Tokenizer {
    tokenize(text: string): string[];
}
declare class AggressiveTokenizerEs implements Tokenizer {
    tokenize(text: string): string[];
}
declare class AggressiveTokenizerFa implements Tokenizer {
    tokenize(text: string): string[];
}
declare class AggressiveTokenizerFr implements Tokenizer {
    tokenize(text: string): string[];
}
declare class AggressiveTokenizerId implements Tokenizer {
    tokenize(text: string): string[];
}
declare class AggressiveTokenizerIt implements Tokenizer {
    tokenize(text: string): string[];
}
declare class AggressiveTokenizerNl implements Tokenizer {
    tokenize(text: string): string[];
}
declare class AggressiveTokenizerNo implements Tokenizer {
    tokenize(text: string): string[];
}
declare class AggressiveTokenizerPl implements Tokenizer {
    tokenize(text: string): string[];
}
declare class AggressiveTokenizerPt implements Tokenizer {
    tokenize(text: string): string[];
}
declare class AggressiveTokenizerRu implements Tokenizer {
    tokenize(text: string): string[];
}
declare class AggressiveTokenizerSv implements Tokenizer {
    tokenize(text: string): string[];
}
declare class AggressiveTokenizerVi implements Tokenizer {
    tokenize(text: string): string[];
}
