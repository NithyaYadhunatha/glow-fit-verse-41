import fetch from 'node-fetch';

console.log('Testing API connection...');

fetch('http://localhost:5000/api/test')
  .then(response => {
    console.log('API connection test response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('API connection test data:', data);
  })
  .catch(error => {
    console.error('API connection test error:', error);
  });