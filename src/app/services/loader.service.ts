import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable()
export class LoaderService {
    isLoading = new Subject<boolean>();

    /**
     * Shows loader service
     */
    show(): void {
        this.isLoading.next(true);
    }

    /**
     * Hides loader service
     */
    hide(): void {
        this.isLoading.next(false);
    }
}