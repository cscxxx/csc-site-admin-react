/**
 * 设置信息 Store
 * 登录成功后由 GET /api/setting 拉取并写入，退出登录时清空
 *
 * @module store/settingStore
 */

import { create } from 'zustand';
import { persist, createJSONStorage, devtools } from 'zustand/middleware';
import type { SettingData } from '@/types';

const SETTING_STORAGE_KEY = 'csc-site-admin-setting';

interface SettingState {
  /** 设置数据，未登录或未拉取时为 null */
  setting: SettingData | null;
  setSetting: (data: SettingData | null) => void;
  clearSetting: () => void;
}

export const useSettingStore = create<SettingState>()(
  persist(
    devtools(
      set => ({
        setting: null,
        setSetting: data => set({ setting: data }),
        clearSetting: () => set({ setting: null }),
      }),
      { name: 'SettingStore' }
    ),
    {
      name: SETTING_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
    }
  )
);
