import { OutputInterface } from "./OutputInterface";

export class Printer {
    readonly PROMPT = '> ';
    readonly TAB = '    ';

    output: OutputInterface;

    constructor(output: OutputInterface) {
        this.output = output;
    }

    public PrintLn(line?: string): void {
        this.Emit(this.Wrap(line || '', this.output.GetColumns()));
    }

    public Prompt(): void {
        if (this.output.ShouldWritePrompt()) {
            this.output.Print(this.PROMPT);
        }
    }

    public Clear(): void {
        this.output.Clear();
    }

    private Wrap(str: string, maxWidth: number): string[] {
        return this.WrapHelper(str, maxWidth, '\n').split('\n');
    }

    private WrapHelper(str: string, maxWidth: number, spaceReplacer: string) {
        if (str.length > maxWidth) {
            var p = maxWidth;
            for (; p > 0 && str[p] != ' '; p--) {
            }
            if (p > 0) {
                var left = str.substring(0, p);
                var right = str.substring(p + 1);
                return left + spaceReplacer + this.WrapHelper(right, maxWidth, spaceReplacer);
            }
        }
        return str;
    }

    private Emit(lines: string[]): void {
        lines.forEach((line) => {
            this.output.PrintLn(line);
        })
    }
}
