const API_URL = 'http://localhost:5000/api';

export const fetchRooms = async () => {
  const response = await fetch(`${API_URL}/rooms`);
  if (!response.ok) throw new Error('Failed to fetch rooms');
  return response.json();
};
