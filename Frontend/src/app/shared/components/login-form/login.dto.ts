export class LoginDto {
    public loginType = 1;
    public userName = '';
    public password = '';
    public loginId = '';
    public rememberMeToken = null;
    public userId = '';
    public rememberMe = false;
    public email = '';
    
}

export class LoginResult {
    constructor(
        public succeeded: boolean,
        public errorMsg: string = ''
    ) { }
}
