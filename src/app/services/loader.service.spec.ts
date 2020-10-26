import { TestBed } from '@angular/core/testing';
import { LoaderService } from './loader.service';


describe('LoaderService', () => {
    let service: LoaderService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LoaderService]
        });
        service = TestBed.inject(LoaderService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should set isLoading to true when the show method is called', () => {
        service.isLoading.subscribe((data: boolean) => {
            expect(data).toBe(true);
        });
        service.show();
    });

    it('should set isLoading to false when the hide method is called', () => {
        service.isLoading.subscribe((data: boolean) => {
            expect(data).toBe(false);
        });
        service.hide();
    });
});
