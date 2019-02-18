export interface OutputInterface {
    /** Print a string to the terminal */
    Print(str: string): void;

    /** Print a string to the terminal and append a newline */
    PrintLn(str: string): void;

    /** Clear the terminal */
    Clear(): void;

    GetColumns(): number;

    ShouldWritePrompt(): boolean;
}
