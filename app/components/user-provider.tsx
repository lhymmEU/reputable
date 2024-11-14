"use client";
import { createContext, useContext, useState } from "react";

const UserContext = createContext({ userData: null, setUserData: (value: any) => {} });

import { ReactNode } from "react";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userData, setUserData] = useState(null);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);