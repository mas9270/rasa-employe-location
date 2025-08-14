
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

type theme = "dark" | "light" | null

interface appTheme {
    theme: theme
}

const initialState: appTheme = {
    theme: null
}

export const appThemeSlice = createSlice({
    name: 'app-theme',
    initialState,
    reducers: {
        changeTheme: (state, action: PayloadAction<theme>) => {
            state.theme = action.payload
        }
    }
})

export const { changeTheme } = appThemeSlice.actions
export default appThemeSlice.reducer