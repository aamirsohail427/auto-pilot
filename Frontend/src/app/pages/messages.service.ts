import { Injectable } from "@angular/core";
import { ServiceBase } from "src/app/shared/base-classes";
import { Messages } from "src/app/shared/utils";

@Injectable({
    providedIn: 'root'
})
class MessagesService extends ServiceBase {
    constructor() {
        super();
        this.messages = [
            {
                code: 'U01', message: Messages.duplicationMsg.replace(new RegExp('{name}', 'gm'), 'email')
            },
            {
                code: 'U02', message: 'The insurance company already is in use. Please enter a different company.'
            },
            {
                code: 'U03', message: 'Delete is not allowed. The user is the last unarchived user who has the built-in Admin assigned.'
            }, {
                code: 'DC01', message: Messages.deleteConfirmationMsg
            },
            {
                code: 'DC02', message: 'Are you sure you want to delete this item?'
            },
            {
                code: 'ET01', message: 'Delete is not allowed. This user has contents, please delete the contents first.'
            },
            {
                code: 'CP01', message: 'The current password is not valid. Please enter the valid current password.'
            },
            {
                code: 'RP01', message: 'The email you entered does not exist in the system.'
            },
            {
                code: 'UT01', message: 'The user type already is in use. Please use different type.'
            },
            {
                code: 'AC01', message: 'The company name already is in use. Please use different name.'
            },
            {
                code: 'BT01', message: 'The business type already is in use. Please use different type.'
            },
            {
                code: 'BL01', message: 'The business line already is in use. Please use different type.'
            },
            {
                code: 'EAC01', message: 'Delete is not allowed. This company is in used.'
            },
            {
                code: 'EBT01', message: 'Delete is not allowed. This business type is in used.'
            },
            {
                code: 'EBL01', message: 'Delete is not allowed. This business line is in used.'
            },
            {
                code: 'ST01', message: 'The state already is in use. Please use different type.'
            },
            {
                code: 'ET01', message: 'The email template already is in use. Please use different type.'
            },
            {
                code: 'SM01', message: 'SMTP informations are not valid.'
            },
        ];
    }

}
export default MessagesService