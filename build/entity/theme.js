"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var Theme = /** @class */ (function (_super) {
    tslib_1.__extends(Theme, _super);
    function Theme() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    tslib_1.__decorate([
        typeorm_1.PrimaryColumn('varchar', { length: 255 }),
        tslib_1.__metadata("design:type", String)
    ], Theme.prototype, "theme", void 0);
    Theme = tslib_1.__decorate([
        typeorm_1.Entity("themes")
    ], Theme);
    return Theme;
}(typeorm_1.BaseEntity));
exports.default = Theme;
//# sourceMappingURL=theme.js.map