import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 15 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.05'],
    http_req_duration: ['p(95)<500'],
  },
};

const baseUrl = __ENV.BASE_URL || 'http://localhost:5000';

export default function () {
  const loginResponse = http.post(
    `${baseUrl}/login`,
    JSON.stringify({ username: 'sara', password: '12345' }),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(loginResponse, {
    'login status 200': (res) => res.status === 200,
    'login success true': (res) => JSON.parse(res.body).success === true,
  });

  const bankResponse = http.get(`${baseUrl}/bank/bank-details?username=sara`);
  check(bankResponse, {
    'bank details status 200': (res) => res.status === 200,
  });

  sleep(1);
}
