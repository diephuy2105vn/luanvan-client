"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserBase, UserPackageInfo } from "@/types/user";
import { PackageType } from "@/types/package";

type UserState = {
	user: UserBase | null;
	pack: UserPackageInfo | null;
};

const initialState: UserState = {
	user: null,
	pack: null,
};

export const userReducer = createSlice({
	name: "User",
	initialState: initialState,
	reducers: {
		setUser: (state, action: PayloadAction<UserBase | null>) => {
			state.user = action.payload;
		},
		setUserPack: (state, action: PayloadAction<UserPackageInfo | null>) => {
			state.pack = action.payload;
		},
	},
});

export const getUser = (state: { user: UserState }) => state.user.user;
export const getUserPack = (state: { user: UserState }) => state.user.pack;
export const { setUser, setUserPack } = userReducer.actions;

export default userReducer.reducer;
