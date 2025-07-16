import Cookies from 'js-cookie';

// Function to retrieve the authentication token from cookies
export const getAuthToken = () => {
  return Cookies.get('token'); // Replace with the actual cookie name
};
