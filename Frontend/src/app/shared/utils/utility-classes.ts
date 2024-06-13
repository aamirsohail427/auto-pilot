export class Action {
    constructor(public code: string,
        public text: string,
        public hasRight: boolean = true,
        public icon: string = '',
        public visible: boolean = true,
        public getVisibleStatus: (data?: any) => boolean = () => true,
        public disabled: boolean = false,
        public items: Action[] = [],
        public template: any = null,
        public closeMenuOnClick: boolean = true,
        public getText?: (data?: any) => any,
        public selected: boolean = false,
        public data: any = null
    ) {
    }
}

export class ButtonOptions {
    constructor(
        public text: string = '',
        public visible: boolean = true,
        public onClickHandler: () => void = null,
        public disabled: boolean = false,
        public onInitializedHandler: (ev) => void = null,
        public elementAttr: any = null
    ) { }
}

export class EquationGrdCloumnOptions {
    constructor(
        public dataField: string = '',
        public caption: string = '',
        public allowHeaderFiltering = true,
        public allowSorting = false,
        public sortOrder: string = '',
        public visible = true
    ) { }
}

export class EquationGridOptions {
    constructor(
        public visible: boolean = true,
        public dataField: string = '',
        public caption: string = '',
    ) { }
}

export class DropDownListOptions {
    constructor(
        public width: number,
        public items: any[],
        public valueExpr,
        public displayExpr,
        public value,
        public valueChangedHandler: (args) => void = null,
        public initializedHandler: (e) => void = null,
        public visible: boolean = true
    ) { }
}

export class AdminUserInfo {
    public firstName: string;
    public lastName: string;
    public email: string;
    public password: string;
    public confirmPassword: string;
    public isSameAccountAdmin = false;
    public isSendEmail = true;
    public isResetPassword = false;
}

