import { Package } from '@/entities/Package';
import axios from 'axios';

// Patch
const updatePackage = async (id: number, data: Partial<Package>) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem('access_token');

  if (!apiUrl) {
    console.error('API URL is not found');
    return [];
  }

  try {
    const response = await axios.patch(`${apiUrl}/package/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed fetching Package data: ', error);
    return [];
  }
};

const removePackageClientInfo = async (id: number) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem('access_token');

  if (!apiUrl) {
    console.error('API URL is not found');
    return [];
  }

  try {
    const response = await axios.patch(
      `${apiUrl}/package/${id}/remove-client-info`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Failed fetching Package data: ', error);
    return [];
  }
};

export { updatePackage, removePackageClientInfo };
