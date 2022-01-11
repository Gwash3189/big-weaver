import { NextApiRequest } from 'next';
import { getBody } from '../../src/request'

describe('getBody', () => {
  it('returns the body of the provided object', () => {
    const req = { body: { name: 'name' }} as unknown as NextApiRequest
    expect(getBody<any>(req)).toEqual(req.body)
  });
});
