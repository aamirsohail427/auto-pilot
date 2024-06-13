import { DatePipe, DecimalPipe, CurrencyPipe, PercentPipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class FormatHelper {
    private readonly datePipe = new DatePipe('en-us');
    private readonly decimalPipe = new DecimalPipe('en-us');
    private readonly currencyPipe = new CurrencyPipe('en-us');
    private readonly percentPipe = new PercentPipe('en-us');
    private readonly defaultFormat = 'dd MMM yyyy';
    private readonly defaultDateFormat = 'MM/dd/yyyy';

    public formatAmount(value: any, formatCode: string, decimalPoints: string) {
        let result = '';
        if (value != null && formatCode && decimalPoints) {
            const pointLength = decimalPoints === 'none' || decimalPoints.length === 0 ? 0 : decimalPoints.length - 1;
            const digits = '1.' + pointLength + '-' + pointLength;
            switch (formatCode) {
                case 'Currency':
                    result = this.currencyPipe.transform(value, 'USD', 'symbol', digits);
                    break;
                case 'Percent':
                    result = this.percentPipe.transform(value, digits);
                    break;
                default:
                    result = this.decimalPipe.transform(value, digits);
                    break;
            }
        }
        return result;
    }


    public formatDate(value: any, format?: string) {
        if (!format) {
            format = this.defaultFormat;
        }
        return this.datePipe.transform(value, format);
    }

    public formatDateTime(value: any) {
        return this.formatDate(value, 'MM/dd/yyyy hh:mm a');
    }
    public formatShortDateTime(value: any) {
        return this.formatDate(value, 'yyyy-MM-dd');
    }

    public formatDateStart(date) {
        if (date) {
            const d = this.formatDate(date, this.defaultDateFormat);
            return d;
        }

        return date;
    }

    public formatDateEnd(date) {
        if (date) {
            const d = this.formatDate(date, this.defaultDateFormat);
            return `${d} 23:59:59`;
        }

        return date;
    }
}
