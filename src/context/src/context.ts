/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import { CommandType } from "./models/command-type.js";
import { CLIService } from "./services/cli.service.js";
import { BuildCommand } from "./services/commands/build.command.js";
import { NewCommand } from "./services/commands/new.command.js";
import { VersionCommand } from "./services/commands/version.command.js";
import { WatchCommand } from "./services/commands/watch.command.js";

process.title = 'ContextJS';

const command = CLIService.parse();

switch (command.type) {
    case CommandType.New:
        await new NewCommand().runAsync(command);
        break;
    case CommandType.Build:
        await new BuildCommand().runAsync(command);
        break;
    case CommandType.Watch:
        await new WatchCommand().runAsync(command);
        break;
    case CommandType.Version:
        await new VersionCommand().runAsync(command);
        break;
    default:
        console.error('Invalid command. Exiting...');
        process.exit(1);
}
