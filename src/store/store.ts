import { configureStore } from '@reduxjs/toolkit'
import appThemeSlice from './slices/appTheme'
import loginInfoSlice from './slices/loginInfo'

export const makeStore = () => {
  return configureStore({
    reducer: {
      appTheme: appThemeSlice,
      loginInfo: loginInfoSlice
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']