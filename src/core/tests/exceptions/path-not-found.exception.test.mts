/**
 * @license
 * Copyright ContextJS All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found at https://github.com/context-js/context/blob/main/LICENSE
 */

import test, { TestContext } from 'node:test';
import { Exception } from '../../src/exceptions/exception.mjs';
import { PathNotFoundException } from '../../src/exceptions/path-not-found.exception.mjs';


test('PathNotFoundException: instance - success', (context: TestContext) => {
    const exception = new PathNotFoundException("path");
    context.assert.ok(exception instanceof PathNotFoundException);
    context.assert.ok(exception instanceof Exception);
    context.assert.ok(exception instanceof Error);
});

test('PathNotFoundException: message - success', (context: TestContext) => {
    const exception = new PathNotFoundException("path");
    context.assert.strictEqual(exception.message, "The specified path was not found: path");
});

test('PathNotFoundException: toString - success', (context: TestContext) => {
    const exception = new PathNotFoundException("path");
    context.assert.strictEqual(exception.toString(), "Exception: The specified path was not found: path");
});