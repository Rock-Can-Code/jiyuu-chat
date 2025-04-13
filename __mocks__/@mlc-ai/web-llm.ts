import { MockMLCEngine } from './MockMLCEngine';

export const CreateMLCEngine = jest.fn(() => Promise.resolve(new MockMLCEngine()));
