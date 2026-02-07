import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface UserState {
  userInfo: UserInfo | null;
  setUserInfo: (userInfo: UserInfo) => void;
  clearUserInfo: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    set => ({
      userInfo: null,
      setUserInfo: userInfo => set({ userInfo }),
      clearUserInfo: () => set({ userInfo: null }),
    }),
    { name: 'UserStore' }
  )
);
