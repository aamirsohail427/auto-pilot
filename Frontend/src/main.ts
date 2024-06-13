import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import themes from 'devextreme/ui/themes';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { AppInjector } from './app/shared';

if (environment.production) {
  enableProdMode();
}


themes.initialized(() => {
  platformBrowserDynamic().bootstrapModule(AppModule).then((moduleRef) => {
    AppInjector.setInjector(moduleRef.injector);
  });
});
