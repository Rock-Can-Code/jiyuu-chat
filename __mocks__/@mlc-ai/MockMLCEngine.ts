class MockMLCEngine {
  chat = {
    completions: {
      create: jest.fn(() => Promise.resolve({
        choices: [
          {
            message: {
              content: 'Mock AI response',
            },
          },
        ],
      })),
    },
  };

  reload = jest.fn(() => Promise.resolve());
  resetChat = jest.fn(() => Promise.resolve());

  constructor() {}

  initProgressCallback = jest.fn((info) => {
    console.log('Mock Init progress:', info);
  });
}

export { MockMLCEngine };
