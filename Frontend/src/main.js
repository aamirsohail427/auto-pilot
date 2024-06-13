"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var themes_1 = require("devextreme/ui/themes");
var app_module_1 = require("./app/app.module");
var environment_1 = require("./environments/environment");
var shared_1 = require("./app/shared");
if (environment_1.environment.production) {
    core_1.enableProdMode();
}
themes_1.default.initialized(function () {
    platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule).then(function (moduleRef) {
        shared_1.AppInjector.setInjector(moduleRef.injector);
    });
});
//# sourceMappingURL=main.js.map