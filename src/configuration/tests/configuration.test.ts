import { Application } from "@contextjs/core";
import { test, TestContext } from 'node:test';
import { Configuration } from "../src/configuration.js";
import '../src/extensions/application-extensions.js';
import { IConfigurationProvider } from "../src/interfaces/i-configuration.provider.js";

test('Configuration - instance - success', (context: TestContext) => {
    const application = new Application();
    const configuration = new Configuration(application);

    context.assert.strictEqual(configuration.application, application);
    context.assert.strictEqual(configuration.providers.length, 0);
    context.assert.strictEqual(configuration.useEnvironmentVariables, false);
});

test('Configuration - getValueAsync - success', async (context: TestContext) => {
    class Provider implements IConfigurationProvider {
        public load(source: any): IConfigurationProvider {
            return this;
        }

        public async getValueAsync(key: string) {
            return key;
        }
    }

    const application = new Application();
    const provider = new Provider();
    application.useConfiguration(options => { options.useProvider(provider); });
    const value = await application.configuration.getValueAsync("test");

    context.assert.strictEqual(value, "test");
    context.assert.notStrictEqual(application.configuration, null);
    context.assert.strictEqual(application.configuration.providers.length, 1);
    context.assert.strictEqual(application.configuration.providers[0], provider);
});