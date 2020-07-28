import {ConvertStringToDotsPipe} from './convert-string-to-dots.pipe';

describe('ConvertStringToDotsPipe', () => {
    let pipe;
    beforeEach(() => {
        pipe = new ConvertStringToDotsPipe();
    });

    it('should create', () => {
        expect(pipe).toBeTruthy();
    });

    it('should return falsy inputs', () => {
        expect(pipe.transform(undefined, -1)).toBeUndefined();
        expect(pipe.transform(null, -1)).toBeNull();
        expect(pipe.transform(NaN, -1)).toBeNaN();
        expect(pipe.transform(0, -1)).toEqual(0);
        expect(pipe.transform(false, -1)).toEqual(false);
        expect(pipe.transform('', -1)).toEqual('');
    });

    it('should replace anything after the given amount of characters to: "..."', () => {
        expect(pipe.transform('123456789', 8)).toEqual('12345678...');
    });

    it('should not replace anything when given amount of character is equal or more than input', () => {
        expect(pipe.transform('12345678', 8)).toEqual('12345678');
        expect(pipe.transform('12345678', 10)).toEqual('12345678');
    });
});
