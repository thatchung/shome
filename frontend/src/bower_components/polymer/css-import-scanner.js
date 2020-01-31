"use strict";
/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const dom5 = require("dom5/lib/index-next");
const model_1 = require("../model/model");
const p = dom5.predicates;
const isCssImportNode = p.AND(p.hasTagName('link'), p.hasSpaceSeparatedAttrValue('rel', 'import'), p.hasAttr('href'), p.hasAttrValue('type', 'css'), p.parentMatches(p.hasTagName('dom-module')));
class CssImportScanner {
    scan(document, visit) {
        return __awaiter(this, void 0, void 0, function* () {
            const imports = [];
            yield visit((node) => {
                if (isCssImportNode(node)) {
                    const href = dom5.getAttribute(node, 'href');
                    imports.push(new model_1.ScannedImport('css-import', href, document.sourceRangeForNode(node), document.sourceRangeForAttributeValue(node, 'href'), { language: 'html', node, containingDocument: document }, false));
                }
            });
            return { features: imports, warnings: [] };
        });
    }
}
exports.CssImportScanner = CssImportScanner;
//# sourceMappingURL=css-import-scanner.js.map