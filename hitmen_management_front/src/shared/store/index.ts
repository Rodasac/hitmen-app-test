import axios from 'axios';
import jwt_decode from 'jwt-decode';
import create from 'zustand';
import { persist, devtools } from 'zustand/middleware';

export interface User {
  pk: number;
  url: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  hitmanprofile?: {
    pk: number;
    url: string;
    manages: number[];
    workflow: string;
  };
}

export type UserSignUpInput = Omit<User, 'pk' | 'url' | 'hitmanprofile'> & {
  password: string;
  password2: string;
};

export type UserUpdateInput = Partial<
  Omit<User, 'pk' | 'url' | 'hitmanprofile'> & {
    hitmanprofile: { manages: number[] };
  }
>;

type UserInputErrorData = UserSignUpInput;

export interface Hit {
  pk: number;
  url: string;
  hitman: User;
  created_by: User;
  workflow: string;
  name: string;
  description: string;
}

export type HitCreateInput = Omit<
  Hit,
  'pk' | 'url' | 'created_by' | 'hitman'
> & { hitman: number };
export type HitUpdateInput = Partial<Omit<HitCreateInput, 'hitman'>>;

type HitInputErrorData = Omit<HitCreateInput, 'hitman'> & { hitman: string };

interface TokenUser {
  token_type: string;
  exp: number;
  jti: string;
  user_id: number;
  email: string;
  firstName: string;
  lastName: string;
  isManager: boolean;
}

interface HitmanState {
  token: string | null;
  currentUser: TokenUser | null;
  isSignUpSuccess: boolean;
  userLoginError: string | null;
  requestError: boolean;

  users: User[];
  isUpdatedUserList: boolean;
  hits: Hit[];
  isUpdatedHitList: boolean;

  userInputErrors: UserInputErrorData | null;
  hitInputErrors: HitInputErrorData | null;

  user: User | null;
  isUpdatedUser: boolean;
  hit: Hit | null;
  isUpdatedHit: boolean;

  currentViewHit: User | null;
  currentViewUser: Hit | null;
  managedUsers: User[];

  openSnackbar: boolean;
  msgSnackbar: string;
  severitySnackbar: 'info' | 'success' | 'error' | 'warning';

  login: (username: string, password: string) => void;
  logout: () => void;
  signup: (input: UserSignUpInput) => void;

  getUsers: () => void;
  getHits: () => void;
  getUser: (id: number) => void;
  getManagedUsers: (id: number) => void;
  getHit: (id: number) => void;

  updateUser: (id: number, input: UserUpdateInput) => void;
  disableUser: (id: number) => void;

  createHit: (input: HitCreateInput) => void;
  updateHit: (id: number, input: HitUpdateInput) => void;

  setRequestError: (status: boolean) => void;

  setSnackbar: (
    isOpen: boolean,
    message: string,
    severity: 'info' | 'success' | 'error' | 'warning'
  ) => void;
}

const API_BASE_URL = 'http://127.0.0.1:8000/api/';

export const useStore = create<HitmanState>(
  devtools(
    persist(
      (set, get) => ({
        token: null,
        currentUser: null,
        isSignUpSuccess: false,
        userLoginError: null,
        requestError: false,

        users: [],
        isUpdatedUserList: true,
        hits: [],
        isUpdatedHitList: true,

        user: null,
        isUpdatedUser: true,
        hit: null,
        isUpdatedHit: true,

        userInputErrors: null,
        hitInputErrors: null,
        currentViewHit: null,
        currentViewUser: null,
        managedUsers: [],

        openSnackbar: false,
        msgSnackbar: '',
        severitySnackbar: 'info',

        login: (username: string, password: string) => {
          axios
            .post(`${API_BASE_URL}token/`, { username, password })
            .then((res) => {
              const token = res.data.access;
              const decoded = jwt_decode(token);
              set((state) => ({
                ...state,
                token,
                currentUser: decoded as TokenUser,
              }));

              get().setSnackbar(true, 'Welcome back!', 'success');
            })
            .catch((err) => {
              console.log(err.response.data);
              if (err.response.data && err.response.data.detail) {
                set((state) => ({
                  ...state,
                  userLoginError: err.response.data.detail,
                }));
              } else {
                get().setRequestError(true);
              }
            });
        },
        logout: () => {
          set((state) => ({ ...state, token: null, currentUser: null }));
        },
        signup: (input: UserSignUpInput) => {
          axios
            .post(`${API_BASE_URL}signup/`, { ...input })
            .then((res) => {
              set((state) => ({
                ...state,
                isSignUpSuccess: true,
              }));

              get().setSnackbar(true, "You've registered!", 'success');
            })
            .catch((err) => {
              console.log(err.response.data);
              if (err.response.data) {
                set((state) => ({
                  ...state,
                  userInputErrors: err.response.data as UserInputErrorData,
                }));
              } else {
                get().setRequestError(true);
              }
            });
        },

        getUsers: () => {
          axios
            .get(`${API_BASE_URL}users/`, {
              headers: {
                authorization: 'Bearer ' + get().token,
              },
            })
            .then((res) => {
              set((state) => ({
                ...state,
                users: res.data,
                isUpdatedUserList: false,
              }));
            })
            .catch((err) => {
              console.log(err.response.data);
              get().setRequestError(true);
            });
        },
        getHits: () => {
          axios
            .get(`${API_BASE_URL}hits/`, {
              headers: {
                authorization: 'Bearer ' + get().token,
              },
            })
            .then((res) => {
              set((state) => ({
                ...state,
                hits: res.data,
                isUpdatedHitList: false,
              }));
              set((state) => ({
                ...state,
                requestError: true,
              }));
            })
            .catch((err) => {
              console.log(err.response.data);
              get().setRequestError(true);
            });
        },
        getUser: (id: number) => {
          axios
            .get(`${API_BASE_URL}users/${id}/`, {
              headers: {
                authorization: 'Bearer ' + get().token,
              },
            })
            .then((res) => {
              set((state) => ({
                ...state,
                user: res.data,
                managedUsers: [],
                isUpdatedUser: false,
              }));
            })
            .catch((err) => {
              console.log(err.response.data);
              get().setRequestError(true);
            });
        },
        getManagedUsers: (id: number) => {
          axios
            .get(`${API_BASE_URL}users/${id}/get_managed_users/`, {
              headers: {
                authorization: 'Bearer ' + get().token,
              },
            })
            .then((res) => {
              set((state) => ({
                ...state,
                managedUsers: res.data,
                isUpdatedUser: false,
              }));
            })
            .catch((err) => {
              console.log(err.response.data);
              get().setRequestError(true);
            });
        },
        getHit: (id: number) => {
          axios
            .get(`${API_BASE_URL}hits/${id}/`, {
              headers: {
                authorization: 'Bearer ' + get().token,
              },
            })
            .then((res) => {
              set((state) => ({
                ...state,
                hit: res.data,
                isUpdatedHit: false,
              }));
            })
            .catch((err) => {
              console.log(err.response.data);
              get().setRequestError(true);
            });
        },

        updateUser: (id: number, input: UserUpdateInput) => {
          axios
            .patch(
              `${API_BASE_URL}users/${id}/`,
              {
                ...input,
              },
              {
                headers: {
                  authorization: 'Bearer ' + get().token,
                },
              }
            )
            .then((res) => {
              set((state) => ({
                ...state,
                hit: res.data,
                isUpdatedUser: true,
                isUpdatedUserList: true,
              }));

              get().setSnackbar(true, 'User updated successfully', 'success');
            })
            .catch((err) => {
              console.log(err.response.data);
              if (err.response.data) {
                set((state) => ({
                  ...state,
                  userInputErrors: err.response.data as UserInputErrorData,
                }));
              } else {
                get().setRequestError(true);
              }
            });
        },
        disableUser: (id: number) => {
          axios
            .delete(`${API_BASE_URL}users/${id}/`, {
              headers: {
                authorization: 'Bearer ' + get().token,
              },
            })
            .then((res) => {
              set((state) => ({
                ...state,
                isUpdatedUser: true,
                isUpdatedUserList: true,
              }));

              get().setSnackbar(true, 'User disabled correctly', 'success');
            })
            .catch((err) => {
              console.log(err.response.data);
              get().setRequestError(true);
            });
        },

        createHit: (input: HitCreateInput) => {
          axios
            .post(
              `${API_BASE_URL}hits/`,
              {
                ...input,
                hitman: {
                  pk: input.hitman,
                  hitmanprofile: {
                    manages: [],
                  },
                },
              },
              {
                headers: {
                  authorization: 'Bearer ' + get().token,
                },
              }
            )
            .then((res) => {
              set((state) => ({
                ...state,
                isUpdatedHit: true,
                isUpdatedHitList: true,
              }));

              get().setSnackbar(true, 'The hit was created', 'success');
            })
            .catch((err) => {
              console.log(err.response.data);
              if (err.response.data) {
                set((state) => ({
                  ...state,
                  hitInputErrors: err.response.data as HitInputErrorData,
                }));
              } else {
                get().setRequestError(true);
              }
            });
        },
        updateHit: (id: number, input: HitUpdateInput) => {
          axios
            .patch(
              `${API_BASE_URL}hits/${id}/`,
              { ...input },
              {
                headers: {
                  authorization: 'Bearer ' + get().token,
                },
              }
            )
            .then((res) => {
              set((state) => ({
                ...state,
                isUpdatedHit: true,
                isUpdatedHitList: true,
              }));

              get().setSnackbar(
                true,
                'The hit was updated successfully',
                'success'
              );
            })
            .catch((err) => {
              console.log(err.response.data);
              if (err.response.data) {
                set((state) => ({
                  ...state,
                  hitInputErrors: err.response.data as HitInputErrorData,
                }));
              } else {
                get().setRequestError(true);
              }
            });
        },
        setRequestError: (status: boolean) => {
          set((state) => ({
            ...state,
            requestError: status,
          }));

          get().setSnackbar(true, 'Something was wrong', 'error');
        },

        setSnackbar: (
          isOpen: boolean,
          message: string,
          severity: 'info' | 'success' | 'error' | 'warning'
        ) => {
          set((state) => ({
            ...state,
            openSnackbar: isOpen,
            msgSnackbar: message,
            severitySnackbar: severity,
          }));
        },
      }),
      {
        name: 'hitman-storage',
        whitelist: ['token', 'currentUser'],
      }
    )
  )
);
