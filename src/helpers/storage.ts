import { ELoginMethod } from 'src/store/slices/user/types';

const accessToken = 'access_token';
const loginType = 'login_type';
const event = 'event';
const provider = 'provider';
const queryKeys = 'qs';

export function hasStorageJwtToken() {
  return !!localStorage.getItem(accessToken);
}

export function removeStorageJwtToken() {
  localStorage.removeItem(accessToken);
}

export function setStorageJwtToken(token: string) {
  localStorage.setItem(accessToken, token);
}

export function getStorageJwtToken() {
  return localStorage.getItem(accessToken);
}

export function setStorageLoginType(type: string) {
  sessionStorage.setItem(loginType, type);
}

export function getStorageLoginType() {
  return sessionStorage.getItem(loginType);
}

export function clearStorageLoginType() {
  sessionStorage.removeItem(loginType);
}

export function setCurrentEvent(id: string) {
  localStorage.setItem(event, id);
}

export function setLoginProvider(id: ELoginMethod) {
  localStorage.setItem(provider, id);
}

export function getLoginProvider() {
  return localStorage.getItem(provider);
}

export function clearLoginProvider() {
  return localStorage.removeItem(provider);
}

export function saveQueries(data: string) {
  localStorage.setItem(queryKeys, data);
}

export function getQueries() {
  return localStorage.getItem(queryKeys);
}

export function clearQueries() {
  localStorage.removeItem(queryKeys);
}

export function getCurrentEvent() {
  const eventId = localStorage.getItem(event);
  localStorage.removeItem(event);
  return eventId;
}
