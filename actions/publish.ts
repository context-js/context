/**
 * This script builds ContextJS.
 * 
 * @example
 * npm run build - builds all projects.
 * npm run build project1 project2 ... - builds specified projects.
 */

import { ActionBase } from "./action-base";
import Config from "./config";

export class Publish extends ActionBase {
    public async runAsync(): Promise<void> {
        try {
            const packageNames = await this.getPackageNamesAsync();

            for (let packageName of packageNames)
                await this.publishPackageAsync(packageName);
        }
        catch (error) {
            console.log(error);
        }
    }

    private async publishPackageAsync(packageName: string): Promise<void> {
        await this.writeLogAsync(`Publishing "${packageName}"...`);
        await this.executeCommandAsync(`cd ${Config.buildFolder}/${packageName} && npm publish --provenance --access public && cd .. && cd ..`);
        await this.writeLogAsync(`Publishing "${packageName}"... Done`);
    }
}

new Publish();