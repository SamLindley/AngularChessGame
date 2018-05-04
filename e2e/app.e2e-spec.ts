import { ChessGamePage } from './app.po';

describe('chess-game App', () => {
  let page: ChessGamePage;

  beforeEach(() => {
    page = new ChessGamePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
