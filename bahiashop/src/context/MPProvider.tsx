import React, { ReactNode, useContext } from "react";

interface MPProviderProps {
  getPreferenceId: (items: any[]) => Promise<any>;
}

const MPContext = React.createContext<MPProviderProps | undefined>(undefined);
const MPProvider = ({ children }: { children: ReactNode }) => {
  const getPreferenceId = async (items: any[]) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payment`,
        {
          method: "POST",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: items,
            back_urls: {
              success: `${process.env.NEXT_PUBLIC_PAGE_URL}/payment/success`,
              pending: `${process.env.NEXT_PUBLIC_PAGE_URL}/payment/pending`,
              failure: `${process.env.NEXT_PUBLIC_PAGE_URL}/payment/failure`,
            },
          }),
        }
      );
      if (!response.ok) {
        throw new Error(await response.json());
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <MPContext.Provider
      value={{
        getPreferenceId,
      }}
    >
      {children}
    </MPContext.Provider>
  );
};

export const usePaymentContext = () => {
  const context = useContext(MPContext);
  if (context === undefined) {
    throw new Error("MPContext must be used within a payment");
  }
  return context;
};

export { MPContext, MPProvider };
