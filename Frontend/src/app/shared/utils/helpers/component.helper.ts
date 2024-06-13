import {
    ComponentFactoryResolver, Type,
    ComponentRef, ViewContainerRef,
    ViewRef
} from '@angular/core';


export class ComponentHelper {
    public static addComponent(componentFactoryResolver: ComponentFactoryResolver,
        componentContainer: ViewContainerRef, componentType: Type<any>) {

        const componentFactory = componentFactoryResolver.resolveComponentFactory(componentType);
        return componentContainer.createComponent(componentFactory);
    }

    public static removeComponent(componentContainer: ViewContainerRef, componentType: any) {
        const index = componentContainer.indexOf(componentType);
        if (index !== -1) {
            componentContainer.remove(index);
        }
        componentType.destroy();
        componentType = null;
    }
}
