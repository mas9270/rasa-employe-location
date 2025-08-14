
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';



interface loginInfo {
    info?: {
        token: string,
        username: string
    }

}

const initialState: loginInfo = {
    info: undefined
}

export const loginInfoSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {
        setLoginInfo: (state, action: PayloadAction<{ token: string, username: string }>) => {
            state.info = action.payload
        }
    }
})

export const { setLoginInfo } = loginInfoSlice.actions
export default loginInfoSlice.reducer