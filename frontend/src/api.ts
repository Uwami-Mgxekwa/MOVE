const BASE_URL = 'http://localhost:8080';

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Auth
export const apiRegister = (name: string, email: string, password: string) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  }).then((r) => r.json());

export const apiLogin = (email: string, password: string) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then((r) => r.json());

// Trips
export const apiCreateTrip = (trip: {
  originCity: string;
  destinationCity: string;
  riderId: number;
}) =>
  fetch(`${BASE_URL}/trips`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(trip),
  }).then((r) => r.json());

export const apiGetRiderTrips = (riderId: number) =>
  fetch(`${BASE_URL}/trips/rider/${riderId}`, {
    headers: getHeaders(),
  }).then((r) => r.json());

export const apiGetTrip = (id: number) =>
  fetch(`${BASE_URL}/trips/${id}`, {
    headers: getHeaders(),
  }).then((r) => r.json());

export const apiUpdateTripStatus = (id: number, status: string) =>
  fetch(`${BASE_URL}/trips/${id}/status?status=${status}`, {
    method: 'PUT',
    headers: getHeaders(),
  }).then((r) => r.json());

// Payments
export const apiCreatePayment = (tripId: number, amount: number) =>
  fetch(`${BASE_URL}/payments`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ tripId, amount, status: 'PENDING' }),
  }).then((r) => r.json());

export const apiGetPaymentByTrip = (tripId: number) =>
  fetch(`${BASE_URL}/payments/trip/${tripId}`, {
    headers: getHeaders(),
  }).then((r) => r.json());

// User
export const apiGetUser = (id: number) =>
  fetch(`${BASE_URL}/users/${id}`, {
    headers: getHeaders(),
  }).then((r) => r.json());

export const apiUpdateUser = (id: number, data: { name: string; email: string }) =>
  fetch(`${BASE_URL}/users/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());
