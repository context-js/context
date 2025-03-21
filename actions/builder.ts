import { ActionBase } from "./action-base.ts";
import Config from "./config.ts";

export class Builder extends ActionBase {
    public override async runAsync(): Promise<void> {
        await this.npmInstallAsync();
        await this.createOutputDirectoriesAsync();

        const packageNames = await this.getPackageNamesAsync();

        for (const packageName of packageNames)
            await this.buildPackageAsync(packageName);
    }

    private async npmInstallAsync(): Promise<void> {
        if (await this.pathExistsAsync('node_modules') === false) {
            this.writeLogAsync('Installing npm packages...');
            this.executeCommandAsync('npm pkg delete dependencies && npm update');
        }
    }

    private async createOutputDirectoriesAsync(): Promise<void> {
        await this.createDirectoryAsync(Config.buildFolder);
        await this.createDirectoryAsync(Config.packagesFolder);
    }

    private async buildPackageAsync(packageName: string): Promise<void> {
        await this.writeLogAsync(`Building "${packageName} "...`);

        await this.removeDependencyAsync(packageName);
        await this.createPackageDirectoryAsync(packageName);
        await this.runPackageBuilderAsync(packageName);
        await this.copyPackageFileAsync(packageName);
        await this.writeVersionAsync(packageName);
        await this.createPackageAsync(packageName);
        await this.installPackageAsync(packageName);

        await this.writeLogAsync(`Building "${packageName}"... Done`);
    }

    private async removeDependencyAsync(packageName: string): Promise<void> {
        await this.executeCommandAsync(`npm pkg delete dependencies.@contextjs/${packageName}`);
    }

    private async createPackageDirectoryAsync(packageName: string): Promise<void> {
        const directoryName = `${Config.buildFolder}/${packageName}`;

        await this.removeDirectoryAsync(directoryName);
        await this.createDirectoryAsync(directoryName);
    }

    private async runPackageBuilderAsync(packageName: string): Promise<void> {
        if (await this.pathExistsAsync(`src/${packageName}/builder.ts`) === false)
            return;

        await import(`../src/${packageName}/builder.ts`);
    }

    private async copyPackageFileAsync(packageName: string): Promise<void> {
        const packageFilePath = `src/${packageName}/package.json`;
        if (await this.pathExistsAsync(packageFilePath) === false)
            throw new Error(`Missing package.json in "${packageName}" package.`);

        await this.copyFileAsync(packageFilePath, `${Config.buildFolder}/${packageName}/package.json`);
    }

    private async writeVersionAsync(packageName: string): Promise<void> {
        const packageFilePath = `${Config.buildFolder}/${packageName}/package.json`;
        let packageFileContent = await this.readFileAsync(packageFilePath);
        packageFileContent = packageFileContent.replace(/__VERSION__/g, Config.version);
        await this.writeFileSync(packageFilePath, packageFileContent);
    }

    private async createPackageAsync(packageName: string): Promise<void> {
        await this.executeCommandAsync(`cd src/${packageName} && tsc`);
        await this.executeCommandAsync(`cd ${Config.buildFolder}/${packageName} && npm pack --silent --pack-destination ../../${Config.packagesFolder}`);
    }

    private async installPackageAsync(packageName: string): Promise<void> {
        const packageJsonFile = await this.readFileAsync(`${Config.buildFolder}/${packageName}/package.json`);
        const packageJson = JSON.parse(packageJsonFile);
        const name = packageJson.name.replace("@", "").replace("/", "-");

        await this.executeCommandAsync(`npm install ./${Config.packagesFolder}/${name}-${Config.version}.tgz`);
    }
}

const builer = new Builder();
await builer.runAsync();