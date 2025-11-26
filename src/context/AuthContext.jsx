import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
import axios from 'axios';

const STORAGE_KEY = 'skytech_auth';
const BASE_URL = import.meta.env.VITE_BASE_API_URL;

const AuthContext = createContext(undefined);
const initialUser = null;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(initialUser);

  // Restore session from localStorage
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.token && dayjs(parsed.expiresAt).isAfter(dayjs())) {
          setUser(parsed);
        }
      }
    } catch (error) {
      toast.error('Could not restore session');
    }
  }, []);

  // Persist user session to localStorage
  const persist = (value) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  };

  // Login with Axios
  const login = async (credentials) => {
  try {
    // 1. Login request
    const { data } = await axios.post(`${BASE_URL}/testuser/login`, credentials);
    console.log("Login Response:", data);

    if (data.success !== 'yes') throw new Error(data.message || 'Login failed');

    const token = data.token;
    const userId = data.id;

    // 2. Fetch full user profile from your API
    const { data: full } = await axios.get(`${BASE_URL}/testuser/find/${userId}`, {
      headers: {
        // id: userId,
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Full Profile:", full);

    // 3. Build final user object
    const rid = String(full.role_id ?? '').trim()
    const role = rid === '2' || full.role === 'super_admin' ? 'super_admin' : rid === '1' || full.role === 'admin' ? 'admin' : 'customer'
    const loggedUser = {
      id: full.id,
      email: full.email,
      name: full.name,
      phone: full.phone,
      address: full.address,
      city: full.city,
      postal_code: full.postal_code,
      country: full.country,
      role,
      token: token,
      expiresAt: full.expiresAt || data.expiresAt,
    };

    // 4. Save user in state + localStorage
    setUser(loggedUser);
    persist(loggedUser);

    toast.success('Welcome back');
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};


  // Register new user with Axios
  const register = async (data) => {
    try {
      const { data: responseData } = await axios.post(`${BASE_URL}/testuser/save`, data);
      console.log(responseData);
      if (responseData.success !== 'yes') throw new Error(responseData.message || 'Registration failed');

      const rid = String(responseData.role_id ?? '').trim()
      const role = rid === '2' || responseData.role === 'super_admin' ? 'super_admin' : rid === '1' || responseData.role === 'admin' ? 'admin' : 'customer'
      const newUser = {
        id: responseData.id,
        email: responseData.email,
        name: responseData.name,
        role,
        token: responseData.token,
        expiresAt: responseData.expiresAt,
      };

      setUser(newUser);
      persist(newUser);
      toast.success('Account created successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Logout
  const logout = () => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
    toast.info('Signed out');
  };

  // Update profile with Axios
  const updateProfile = async (data) => {
  if (!user) return;
  // console.log(user);
  try {
    const { data: updated } = await axios.put(`${BASE_URL}/testuser/update/${user.id}`, {
      id: user.id,
      ...data
    }, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      },
    });

    console.log(updated);

    if (updated.success !== 'yes') throw new Error(updated.message || 'Update failed');

    const next = {
      ...user,
      ...data
    };

    setUser(next);
    persist(next);
    toast.success('Profile updated');
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};
;

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user?.token),
      isAdmin: user?.role === 'admin',
      isSuperAdmin: user?.role === 'super_admin',
      login,
      register,
      logout,
      updateProfile,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
