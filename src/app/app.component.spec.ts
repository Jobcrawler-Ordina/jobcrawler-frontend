import {TestBed, async} from '@angular/core/testing';
import {AppComponent} from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LoaderService } from './services/loader.service';
import { LoaderComponent } from './components/loader/loader.component';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                AppComponent,
                LoaderComponent
            ],
            providers: [
                LoaderService
            ]
        }).compileComponents();
    }));

    it('should create the app', () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app).toBeTruthy();
    });

    it(`should have as title 'angular-app'`, () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        expect(app.title).toEqual('angular-app');
    });
});
