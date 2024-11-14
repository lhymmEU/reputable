"use client";
import { createContext, useContext, useState, ReactNode, Dispatch, SetStateAction } from "react";

// Define the structure of the userData object
interface UserData {
  userId: string;
  username: string;
}

// Define the shape of the context value
interface UserContextType {
  userData: UserData | null;
  setUserData: Dispatch<SetStateAction<UserData | null>>;
}

// Initialize context with a default value of null or empty functions
const UserContext = createContext<UserContextType>({
  userData: null,
  setUserData: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);