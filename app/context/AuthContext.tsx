import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios, { AxiosError } from 'axios'; // Importa AxiosError

interface AuthState {
  token: string | null;
  authenticated: boolean | null;
}

interface AuthContextProps {
  authState: AuthState;
  onRegister: (email: string, password: string) => Promise<any>;
  onLogin: (email: string, password: string) => Promise<any>;
  onLogout: () => Promise<any>;
}

const TOKEN_KEY = 'my-jwt';
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    authenticated: null
  });

  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await SecureStore.getItemAsync(TOKEN_KEY);
        console.log("stored:", token);
  
        if (token) {
          setAuthState({
            token: token,
            authenticated: true
          });
        }
      } catch (error) {
        console.error('Error al cargar el token:', error);
      }
    };
    loadToken();
  }, []);

  const register = async (email: string, password: string) => {

    console.log("Registering:", email, password);
    return { success: true };
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://192.168.100.22:8002/api/login', {
        email,
        password
      });

      const { token } = response.data;

      if (token) {
        setAuthState({
          token,
          authenticated: true
        });
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        return { data: { token } };
      } else {
        return { error: true, msg: 'Credenciales inválidas' };
      }
    } catch (error: unknown) {
     
      
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 422) {
          return { error: true, msg: 'Datos inválidos. Por favor, revisa tus credenciales.' };
        }
        return { error: true, msg: 'Error al conectar con el servidor' };
      }
      
      return { error: true, msg: 'Error desconocido' };
    }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setAuthState({
      token: null,
      authenticated: false
    });
  };

  return (
    <AuthContext.Provider value={{ authState, onRegister: register, onLogin: login, onLogout: logout }}>
      {children}
    </AuthContext.Provider>
  );
};