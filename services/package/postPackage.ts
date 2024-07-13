import { Package } from '@/entities/Package';
import axios from 'axios';

const postPackage = async (data: Package) => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const token = localStorage.getItem('access_token');

  if (!apiUrl) {
    console.error('API URL is not found');
    return [];
  }

  try {
    const response = await axios.post(`${apiUrl}/package`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('Package data: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Failed fetching Package data: ', error);
    return [];
  }
};

export { postPackage };
