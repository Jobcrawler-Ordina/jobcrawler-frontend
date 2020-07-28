import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'convertStringToDots'
})
export class ConvertStringToDotsPipe implements PipeTransform {


    /**
     * Transforms convert string to dots pipe
     * @param value string that needs to be converted
     * @param num convert string to dots after x chars
     * @returns transformed string 
     */
    transform(value: string, num: number): string {
        if (!value || value.length <= (num)) {
            return value;
        } else {
            return value.substring(0, num) + '...';
        }
    }

}
