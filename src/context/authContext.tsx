// // import { useLocalStorage } from "@/lib/useLocalStorage";
// // import { refreshToken } from "@/query/authQuery";
// // import axios from "@/query/axiosInstance";
// import { createContext, ReactNode, useContext, useEffect } from "react";

// const AuthContext = createContext<string | null>(null);
// const AuthContextDispatch = createContext<React.Dispatch<
//   React.SetStateAction<string | null>
// > | null>(null);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   // const [token, setToken] = useLocalStorage<string | null>("token", null);

//   useEffect(() => {
//     if (!token) {
//       return;
//     }
//     const requestInterceptor = axios.interceptors.request.use(
//       async (config) => {
//         if (config.headers) {
//           config.headers["Authorization"] = `Bearer ${token}`;
//           config.headers["Content-Type"] = "application/x-www-form-urlencoded";
//         }
//         return config;
//       },
//       (error) => {
//         Promise.reject(error);
//       }
//     );
//     // Response interceptor for API calls
//     const responseInterceptor = axios.interceptors.response.use(
//       (response) => {
//         return response;
//       },
//       async function (error) {
//         const originalRequest = error.config;
//         if (
//           (error.response.status === 403 || error.response.status === 401) &&
//           !originalRequest._retry
//         ) {
//           originalRequest._retry = true;
//           try {
//             const data = await refreshToken();
//             const access_token = data.accessToken;
//             axios.defaults.headers.common["Authorization"] =
//               "Bearer " + access_token;
//             setToken(access_token);
//             return axios(originalRequest);
//           } catch {
//             setToken(null);
//           }
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axios.interceptors.request.eject(requestInterceptor);
//       axios.interceptors.response.eject(responseInterceptor);
//     };
//   }, [token]);

//   return (
//     <AuthContext.Provider value={token}>
//       <AuthContextDispatch.Provider value={setToken}>
//         {children}
//       </AuthContextDispatch.Provider>
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const token = useContext(AuthContext);
//   const setToken = useContext(AuthContextDispatch)!;

//   const clearToken = () => setToken?.(null);

//   return { token, setToken, clearToken };
// };
