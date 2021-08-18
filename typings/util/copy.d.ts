export declare class TemplateCopy {
    target: string;
    template: string;
    options: any;
    name: string;
    constructor(target: string, template: string, options: any);
    init(): Promise<void>;
    copyFiles(template: string, target: string): Promise<void>;
}
