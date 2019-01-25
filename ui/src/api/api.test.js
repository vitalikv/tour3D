import { API } from './api';
import { mappedButtons } from '../features/toolbars/buttons/mapButtons';

const mockDispatch = jest.fn(() => true);
const mockGetState = jest.fn(() => ({}));
const mockCenterView = mappedButtons['CENTER_VIEW'];

API.registerDispatch(mockDispatch, mockGetState);

test('getActions returns actions array', () => {
  expect(API.getActions(mockCenterView.name))
    .toEqual(expect.arrayContaining([mockCenterView]));
});

test('getActions returns correct state', () => {
  expect(API.getNewState(mockCenterView.name, true))
    .toMatchObject({ [mockCenterView.alias]: true });
});
