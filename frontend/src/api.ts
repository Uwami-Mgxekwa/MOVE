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

export const apiGoogleLogin = (idToken: string) =>
  fetch(`${BASE_URL}/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
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

// PayFast
export const apiGeneratePayFastPayment = (amount: number, itemName: string) =>
  fetch(`${BASE_URL}/payments/payfast/generate`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ amount, itemName }),
  }).then((r) => r.json());

// Promo codes
export const apiValidatePromo = (code: string) =>
  fetch(`${BASE_URL}/promo/validate/${code}`, { headers: getHeaders() }).then((r) => r.json());

// Saved places
export const apiGetSavedPlaces = (userId: number) =>
  fetch(`${BASE_URL}/places/user/${userId}`, { headers: getHeaders() }).then((r) => r.json());

export const apiSavePlace = (place: { userId: number; label: string; address: string }) =>
  fetch(`${BASE_URL}/places`, {
    method: 'POST', headers: getHeaders(), body: JSON.stringify(place),
  }).then((r) => r.json());

export const apiDeletePlace = (id: number) =>
  fetch(`${BASE_URL}/places/${id}`, { method: 'DELETE', headers: getHeaders() });

// Notifications
export const apiGetNotifications = (userId: number) =>
  fetch(`${BASE_URL}/notifications/user/${userId}`, { headers: getHeaders() }).then((r) => r.json());

export const apiGetUnreadCount = (userId: number) =>
  fetch(`${BASE_URL}/notifications/user/${userId}/unread-count`, { headers: getHeaders() }).then((r) => r.json());

export const apiMarkAllRead = (userId: number) =>
  fetch(`${BASE_URL}/notifications/user/${userId}/read-all`, { method: 'PUT', headers: getHeaders() });

// Ratings
export const apiRateTrip = (tripId: number, riderId: number, stars: number, comment?: string) =>
  fetch(`${BASE_URL}/ratings`, {
    method: 'POST', headers: getHeaders(),
    body: JSON.stringify({ tripId, riderId, stars, comment }),
  }).then((r) => r.json());

// OTP
export const apiSendOtp = (phone: string) =>
  fetch(`${BASE_URL}/auth/otp/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  }).then((r) => r.json());

export const apiVerifyOtp = (phone: string, code: string) =>
  fetch(`${BASE_URL}/auth/otp/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code }),
  }).then((r) => r.json());

// Password reset
export const apiSendPasswordReset = (phone: string) =>
  fetch(`${BASE_URL}/auth/reset/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  }).then((r) => r.json());

export const apiConfirmPasswordReset = (phone: string, code: string, newPassword: string) =>
  fetch(`${BASE_URL}/auth/reset/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code, newPassword }),
  }).then((r) => r.json());
