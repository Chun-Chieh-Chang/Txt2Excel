
declare module 'xlsx-populate/browser/xlsx-populate' {
    const XlsxPopulate: any;
    export default XlsxPopulate;
}

declare module 'jschardet' {
    const jschardet: {
        detect: (input: string) => { encoding: string; confidence: number };
    };
    export default jschardet;
}
