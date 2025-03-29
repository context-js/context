/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/contextjs/context/blob/main/LICENSE
 */

import { ConsoleService, ObjectExtensions } from "@contextjs/system";
import { CommandType, CommandTypeExtensions } from "../../models/command-type.js";
import { Command } from "../../models/command.js";

export class CommandsService {
    public static parse(): Command {
        const args = process.argv.slice(2);

        if (args.length === 0)
            return new Command(CommandType.Ctx, []);

        const command = CommandTypeExtensions.fromString(args[0]);
        if (ObjectExtensions.isNullOrUndefined(command)) {
            console.error('Invalid command provided. Exiting...');
            return process.exit(1);
        }

        const parsedArguments = ConsoleService.parseArguments(args.slice(1));

        return new Command(command!, parsedArguments);
    }
}