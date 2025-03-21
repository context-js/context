import { execSync } from "child_process";
import Config from "./config.ts";
import fs from "fs";

export abstract class ActionBase {
    abstract runAsync(): Promise<void>;

    protected async executeCommandAsync(command: string): Promise<void> {
        execSync(command, { stdio: 'inherit' });
    }

    protected async writeLogAsync(message: string): Promise<void> {
        console.log(message);
    }

    protected async getPackageNamesAsync(): Promise<string[]> {
        const packageNames = process.argv.slice(2);
        return packageNames.length > 0
            ? packageNames
            : Config.packages;
    }

    protected async createDirectoryAsync(directoryName: string): Promise<void> {
        if (!fs.existsSync(directoryName))
            fs.mkdirSync(directoryName, { recursive: true });
    }

    protected async removeDirectoryAsync(directoryName: string): Promise<void> {
        if (fs.existsSync(directoryName))
            fs.rmSync(directoryName, { recursive: true });
    }

    protected async pathExistsAsync(path: string): Promise<boolean> {
        return fs.existsSync(path);
    }

    protected async copyFileAsync(source: string, destination: string): Promise<void> {
        fs.copyFileSync(source, destination);
    }

    protected async readFileAsync(filePath: string): Promise<string> {
        return fs.readFileSync(filePath, 'utf8')?.toString();
    }

    protected async writeFileSync(filePath: string, content: string): Promise<void> {
        fs.writeFileSync(filePath, content);
    }
}