import { savePet, loadPet, deletePet } from '../storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('../logger', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

describe('Storage Utils', () => {
  const mockPet = {
    id: '123',
    name: 'TestPet',
    type: 'cat',
    color: 'orange',
    gender: 'male',
    hunger: 100,
    hygiene: 100,
    energy: 100,
    happiness: 100,
    health: 100,
    money: 100,
    clothes: {},
    createdAt: Date.now(),
    lastUpdated: Date.now(),
    isSleeping: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves pet with guest key by default', async () => {
    await savePet(mockPet as any);
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@pet_care_game:pet:guest',
      expect.any(String)
    );
  });

  it('saves pet with user specific key', async () => {
    await savePet(mockPet as any, 'user123');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(
      '@pet_care_game:pet:user123',
      expect.any(String)
    );
  });

  it('loads pet from user specific key', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockPet));
    const pet = await loadPet('user123');
    expect(AsyncStorage.getItem).toHaveBeenCalledWith('@pet_care_game:pet:user123');
    expect(pet).toEqual(expect.objectContaining({ name: 'TestPet' }));
  });

  it('deletes pet from user specific key', async () => {
    await deletePet('user123');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@pet_care_game:pet:user123');
  });

  it('deletes legacy key for guest user', async () => {
    await deletePet('guest');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@pet_care_game:pet:guest');
    expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@pet_care_game:pet');
  });
});
