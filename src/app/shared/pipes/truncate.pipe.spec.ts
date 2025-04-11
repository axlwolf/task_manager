import { TruncatePipe } from './truncate.pipe';

describe('TruncatePipe', () => {
  let pipe: TruncatePipe;

  beforeEach(() => {
    pipe = new TruncatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should truncate text longer than the limit', () => {
    const text = 'This is a long text that should be truncated';
    const result = pipe.transform(text, 10);
    expect(result).toBe('This is a ...');
  });

  it('should not truncate text shorter than the limit', () => {
    const text = 'Short text';
    const result = pipe.transform(text, 20);
    expect(result).toBe('Short text');
  });
});
