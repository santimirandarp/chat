var __awaiter =
    (this && this.__awaiter) ||
    function (thisArg, _arguments, P, generator) {
        function adopt(value) {
            return value instanceof P
                ? value
                : new P(function (resolve) {
                      resolve(value);
                  });
        }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator["throw"](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : adopt(result.value).then(fulfilled, rejected);
            }
            step(
                (generator = generator.apply(thisArg, _arguments || [])).next()
            );
        });
    };
import { HTMLToDOM, msgToHTML } from "./buildMsg.js";
import { ul } from "./elements.js";
export const getMsgsAsync = (uri, skip, limit) =>
    __awaiter(void 0, void 0, void 0, function* () {
        const route = uri + "/" + skip.toString() + "/" + limit.toString();
        const msgs = yield fetch(route).then((d) => d.json());
        msgs.forEach((msg) => HTMLToDOM(msgToHTML(msg), ul, "prepend"));
        return 0;
    });
export const getLastMsgsAsync = (uri) =>
    __awaiter(void 0, void 0, void 0, function* () {
        return yield getMsgsAsync(uri, 0, 10);
    });
